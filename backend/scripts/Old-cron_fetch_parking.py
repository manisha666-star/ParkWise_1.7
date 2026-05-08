import os
import requests
from datetime import datetime
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise Exception("Missing Supabase credentials in .env")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


# --- Fetch real-time data from Saemes parking API ---
print(" Fetching data from Saemes parking availability API...")
api_url = "https://opendata.saemes.fr/api/records/1.0/search/"
params = {
    "dataset": "places-disponibles-parkings-saemes",
    "rows": 66
}

try:
    response = requests.get(api_url, params=params)
    response.raise_for_status()
    data = response.json()
    records = data.get("records", [])
    print(f"Received {len(records)} records.")
except Exception as e:
    print(f"Failed to fetch parking data: {e}")
    exit(1)

success_logs = 0
success_realtime = 0

# Clear real-time table
supabase.table("real_time_parking_spots").delete().neq("facilityid", "").execute()

for record in records:
    fields = record.get("fields", {})
    facility_id = fields.get("facilityid")
    nom_parking = fields.get("nom_parking", "").strip()    
    # Extract coordinates
    geo = fields.get("geo")
    if geo and len(geo) == 2:
        lat, lon = geo[0], geo[1]
    else:
        coords = record.get("geometry", {}).get("coordinates", [])
        if coords and len(coords) == 2:
            lon, lat = coords[0], coords[1]
        else:
            lat, lon = None, None

    if not facility_id or lat is None or lon is None:
        continue  # skip invalid entries


    row = {
        "facilityid": facility_id,
        "countertype": fields.get("countertype"),
        "counterfreeplaces": fields.get("counterfreeplaces"),
        "nom_parking": nom_parking,
        "type_de_parc": fields.get("type_de_parc"),
        "latitude": lat,
        "longitude": lon,
        "timestamp": datetime.utcnow().isoformat(),
    }

    # try:
    #     supabase.table("parking_logs").insert(row).execute()
    #     success_logs += 1
    # except Excepton as e:
    #     print(f" Failed to insert into parking_logs for facility {facility_id}: {e}")

    try:
        supabase.table("real_time_parking_spots").insert(row).execute()
        success_realtime += 1
    except Exception as e:
        print(f" Failed to insert into real_time_parking_spots for facility {facility_id}: {e}")
    
supabase.rpc("update_event_status_realtime", {}).execute()
# print(f"Done. Inserted {success_logs} records into parking_logs.")
print(f"Done. Inserted {success_realtime} records into real_time_parking_spots.")
