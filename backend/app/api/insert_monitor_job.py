from fastapi import APIRouter, Request, Depends, HTTPException
from pydantic import BaseModel
from app.auth.routes import get_current_user
from app.core.config import supabase
from datetime import datetime

router = APIRouter()

class MonitorRequest(BaseModel):
    facility_id: str
    monitor_for_time: datetime  # time the user wants to be alerted for

# Function to get current free places from DB
def get_current_availability_from_db(facility_id: str) -> int:
    response = supabase.table("real_time_parking_spots")\
        .select("counterfreeplaces")\
        .eq("facilityid", facility_id)\
        .limit(1)\
        .execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="Parking facility not found.")

    return response.data[0]["counterfreeplaces"]

# Function to insert a monitoring job
def insert_monitor_job(user_email: str, facility_id: str, original_free_places: int, monitor_for_time: datetime):
    row = {
        "user_email": user_email,
        "facility_id": facility_id,
        "original_free_places": original_free_places,
        "monitor_for_time": monitor_for_time.isoformat(),
        "created_at": datetime.utcnow().isoformat()
    }

    try:
      response = supabase.table("parking_monitor_jobs").insert(row).execute()
    except Exception as e:
      raise HTTPException(status_code=500, detail=f"Failed to schedule monitoring job: {e}")


# Endpoint: Create a monitor alert job
@router.post("/monitor-parking-alert")
def monitor_alert(
    data: MonitorRequest,
    user=Depends(get_current_user)
):
    # Step 1: Get current free places
    current_free = get_current_availability_from_db(data.facility_id)

    # Step 2: Insert into monitoring jobs
    insert_monitor_job(
        user_email=user.email,
        facility_id=data.facility_id,
        original_free_places=current_free,
        monitor_for_time=data.monitor_for_time
    )

    return {"message": "Monitoring job scheduled."}
