import os
import logging
from app.core.config import supabase
from datetime import datetime

# Logger config
logger = logging.getLogger("parkwise.cleanup")
logger.setLevel(logging.DEBUG)
ch = logging.StreamHandler()
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
ch.setFormatter(formatter)
logger.addHandler(ch)

def delete_inactive_jobs():
    logger.info("Running cleanup job for inactive monitor records...")

    # Fetch inactive jobs
    response = supabase.table("parking_monitor_jobs")\
        .select("id")\
        .eq("is_active", False)\
        .execute()

    inactive_jobs = response.data

    if not inactive_jobs:
        logger.info("No inactive jobs to delete.")
        return

    for job in inactive_jobs:
        supabase.table("parking_monitor_jobs")\
            .delete()\
            .eq("id", job["id"])\
            .execute()
        logger.info(f"Deleted job ID {job['id']}")

    logger.info(f"Cleanup complete. Deleted {len(inactive_jobs)} jobs.")

if __name__ == "__main__":
    delete_inactive_jobs()
