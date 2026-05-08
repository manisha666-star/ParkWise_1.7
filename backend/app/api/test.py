import os
from datetime import datetime, timezone
from fastapi import APIRouter, Query, HTTPException
from app.core.config import supabase
import smtplib
from email.mime.text import MIMEText

def send_email(to_email: str, subject: str, message: str):
    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", 587))
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASS")

    msg = MIMEText(message)
    msg["Subject"] = subject
    msg["From"] = smtp_user
    msg["To"] = to_email

    with smtplib.SMTP(smtp_host, smtp_port) as server:
        server.starttls()
        server.login(smtp_user, smtp_pass)
        server.send_message(msg)

def check_monitoring_jobs():
    now = datetime.now(timezone.utc).isoformat()

    response = supabase.table("parking_monitor_jobs")\
        .select("*")\
        .eq("is_active", True)\
        .execute()

    for job in response.data:
        user_email = job["user_email"]
        facility_id = job["facility_id"]
        original_free_places = job["original_free_places"]
        monitor_for_time = job["monitor_for_time"]

        if now >= monitor_for_time:
            supabase.table("parking_monitor_jobs")\
                .update({"is_active": False})\
                .eq("id", job["id"])\
                .execute()
            continue

        rt_response = supabase.table("real_time_parking_spots")\
            .select("counterfreeplaces")\
            .eq("facilityid", facility_id)\
            .limit(1)\
            .execute()

        if not rt_response.data:
            continue

        current_free = rt_response.data[0]["counterfreeplaces"]

        if current_free < (0.7 * original_free_places):
            try:
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
                print(f"Email sent to {user_email}")
            except Exception as e:
                print(f"Failed to send email to {user_email}: {e}")
