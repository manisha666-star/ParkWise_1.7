from fastapi import APIRouter, Query, HTTPException
from app.core.config import supabase

router = APIRouter()
# from the user location 
@router.get("/nearby-parking")
def get_nearby_parking(
    lat: float = Query(..., description="User latitude"),
    lon: float = Query(..., description="User longitude"),
    radius_km: float = Query(2.0, description="Search radius in kilometers"),
    #vehicle_type: str = Query(..., description="Vehicle type filter"),
):
    response = supabase.rpc("get_nearby_parking", {
        "lat": lat,
        "lon": lon,
        "radius_m": radius_km * 1000,  # meters
        #"vtype": vehicle_type
    }).execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="No nearby parking spots found.")

    return [
         {
             "id": row["facilityid"],
             "name": row["nom_parking"],
             "distance_km": round(row["distance_m"] / 1000, 2),
             "free_places": row["counterfreeplaces"],
             "image_url": row.get("image_url") or "",
             "latitude": row["latitude"],
             "longitude": row["longitude"]
         }
         for row in response.data
     ]
    