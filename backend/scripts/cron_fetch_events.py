import os
import requests
from datetime import datetime
from supabase import create_client, Client
from dotenv import load_dotenv
import time

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise Exception("Missing Supabase credentials in .env")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Geocoding function (fallback)
def geocode_address(address):
    if not address:
        return None, None
    url = "https://nominatim.openstreetmap.org/search"
    params = {
        "q": f"{address}, Paris",
        "format": "json",
        "limit": 1
    }
    headers = {
        "User-Agent": "ParkWiseBot (contact@example.com)"
    }

    try:
        response = requests.get(url, params=params, headers=headers)
        data = response.json()
        if data:
            return float(data[0]["lat"]), float(data[0]["lon"])
    except Exception as e:
        print(f"Geocoding failed for {address}: {e}")
    return None, None

# Fetch event data
print("Fetching events from 'Que Faire à Paris' API...")
api_url = "https://opendata.paris.fr/api/records/1.0/search/"
params = {
    "dataset": "que-faire-a-paris-",
    "rows": 60
}

try:
    response = requests.get(api_url, params=params)
    response.raise_for_status()
    records = response.json().get("records", [])
    print(f" Received {len(records)} events.")
except Exception as e:
    print(f" Failed to fetch event data: {e}")
    exit(1)

success_count = 0

for record in records:
    fields = record.get("fields", {})
    title = fields.get("title")
    address = fields.get("address_street")
    event_id = fields.get("id") or fields.get("event_id") or record.get("recordid")

    # Get lat/lon
    lat, lon = fields.get("lat_lon", [None, None])
    if lat is None or lon is None:
        coords = record.get("geometry", {}).get("coordinates", [])
        if coords and len(coords) == 2:
            lon, lat = coords[0], coords[1]
    if lat is None or lon is None:
        lat, lon = geocode_address(address)

    if not event_id or lat is None or lon is None:
        continue  # skip incomplete data

    row = {
        "event_id": event_id,
        "title": title,
        "address": address,
        "latitude": lat,
        "longitude": lon,
        "timestamp": datetime.utcnow().isoformat(),
        "description": fields.get("description"),
        "price_type": fields.get("price_type"),
        "price_detail": fields.get("price_detail"),
        "event_url": fields.get("url"),
        "cover_url": fields.get("cover_url"),
    }

    try:
        supabase.table("paris_events").upsert(row, on_conflict="event_id").execute()
        success_count += 1
    except Exception as e:
        print(f" Failed to upsert event {event_id}: {e}")

print(f" Done. Upserted {success_count} events to Supabase.")
