import os
import logging
from datetime import datetime, timezone
from dateutil import parser
from email.mime.text import MIMEText
import smtplib
from app.core.config import supabase

# -------------------- Logger Configuration --------------------
logger = logging.getLogger("parkwise.cron")
if not logger.handlers:
    logger.setLevel(logging.DEBUG)  # Use INFO in production

    ch = logging.StreamHandler()
    ch.setLevel(logging.DEBUG)
    formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
    ch.setFormatter(formatter)

    logger.addHandler(ch)

# -------------------- Email Sending Function --------------------
def send_email(to_email: str, subject: str, message: str):
    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", 587))
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASS")

    msg = MIMEText(message)
    msg["Subject"] = subject
    msg["From"] = smtp_user
    msg["To"] = to_email

    try:
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.send_message(msg)
        logger.info(f"Email sent to {to_email}")
    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {e}")
        raise

# -------------------- Main Cron Job --------------------
def cron_send_email():
    now = datetime.now(timezone.utc)
    logger.info(f"Running cron job at {now.isoformat()}")

    response = supabase.table("parking_monitor_jobs")\
        .select("*")\
        .eq("is_active", True)\
        .execute()

    if not response.data:
        logger.info("No active monitoring jobs found.")
        return

    for job in response.data:
        user_email = job.get("user_email")
        facility_id = job.get("facility_id")
        original_free_places = job.get("original_free_places")
        monitor_time_str = job.get("monitor_for_time")

        logger.debug(f"Raw monitor_for_time string: {monitor_time_str}")

        # Parse and ensure UTC-aware
        try:
            monitor_for_time = parser.isoparse(monitor_time_str)
            if monitor_for_time.tzinfo is None:
                monitor_for_time = monitor_for_time.replace(tzinfo=timezone.utc)
        except Exception as e:
            logger.error(f"Failed to parse monitor_for_time: {monitor_time_str} — {e}")
            continue

        logger.debug(f"Checking job ID {job['id']} for {user_email} (monitor until {monitor_for_time})")

        if now >= monitor_for_time:
            logger.info(f"Monitor time passed for job ID {job['id']}, disabling it.")
            supabase.table("parking_monitor_jobs")\
                .update({"is_active": False})\
                .eq("id", job["id"])\
                .execute()
            continue

        # Fetch real-time parking info
        rt_response = supabase.table("real_time_parking_spots")\
            .select("counterfreeplaces")\
            .eq("facilityid", facility_id)\
            .limit(1)\
            .execute()

        if not rt_response.data:
            logger.warning(f"No real-time data found for facility_id={facility_id}")
            continue

        current_free = rt_response.data[0]["counterfreeplaces"]
        logger.debug(f"Job ID {job['id']} — Original: {original_free_places}, Current: {current_free}")

        if current_free < (0.7 * original_free_places):
            logger.info(f"Triggering alert for {user_email} — availability dropped below 70%.")
            send_email(
                to_email=user_email,
                subject="ParkWise Alert: Spots Decreasing",
                message=(
                    f"Availability Alert!\n\n"
                    f"Parking {facility_id} has dropped below 70% availability.\n"
                    f"Original: {original_free_places} spots\n"
                    f"Current: {current_free} spots\n"
                    f"Time: {datetime.utcnow().isoformat()}"
                )
            )
