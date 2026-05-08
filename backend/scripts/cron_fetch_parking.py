import os
import requests
from datetime import datetime
from supabase import create_client, Client
from dotenv import load_dotenv
import unicodedata
import json
import re



# Load environment variables from .env
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise Exception("Missing Supabase credentials in .env")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# --- Step 1: Fetch parking image metadata from Saemes images API ---
images_api_url = "https://opendata.saemes.fr/api/explore/v2.1/catalog/datasets/photos-parkings-et-zones-voirie-saemes/records"
image_results = {}

try:
    img_response = requests.get(images_api_url, params={"limit": 100})
    img_response.raise_for_status()
    img_data = img_response.json()
    
    # Check the key before proceeding
    if "results" not in img_data:
        raise ValueError("Unexpected API response: 'results' key not found")

    for item in img_data.get("results", []):
        name = item.get("nom_parking", "")


        #img_url = item.get("nom_fichier_photo", {}).get("url")
        img_fichier = item.get("nom_fichier_photo")
        img_url = img_fichier.get("url") if isinstance(img_fichier, dict) else None

        if img_url:
    # Fix common Saemes typos just in case
         img_url = img_url.replace("photos-parkkings", "photos-parkings") \
                         .replace("photos-pparkings", "photos-parkings") \
                         .replace("photos-parkinngs", "photos-parkings") \
                         .replace("phootos-parkings", "photos-parkings")

        image_results[name] = img_url
        
        print(f"Found image for  {name},{image_results[name]}")

       

    
   
    
except Exception as e:
    print(f"Error while processing image metadata: {e}")
    print("Continuing with partially fetched image_results...")



print(json.dumps(image_results, indent=2, ensure_ascii=False)) 
# --- Step 2: Fetch real-time parking availability data ---

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
    #print(f"✅ Received {len(records)} parking records.")
except Exception as e:
    #print(f"❌ Failed to fetch parking data: {e}")
    exit(1)

# Clear real-time table
#print("🧹 Clearing real_time_parking_spots table...")
supabase.table("real_time_parking_spots").delete().neq("facilityid", "").execute()

success_realtime = 0
seen_facilities = set()
for record in records:
    fields = record.get("fields", {})
    facility_id = fields.get("facilityid")
    nom_parking = fields.get("nom_parking", "").strip()
    print("NORMALISED NAME :",nom_parking)

    if not facility_id or facility_id in seen_facilities:
        continue
    seen_facilities.add(facility_id)

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
        #print(f"⚠️ Skipping record with missing data: {facility_id}, {lat}, {lon}")
        continue


    image_url = image_results.get(nom_parking)
    

    row = {
        "facilityid": facility_id,
        "countertype": fields.get("countertype"),
        "counterfreeplaces": fields.get("counterfreeplaces"),
        "nom_parking": nom_parking,
        "type_de_parc": fields.get("type_de_parc"),
        "latitude": lat,
        "longitude": lon,
        "timestamp": datetime.utcnow().isoformat(),
        "image_url": image_url,
    }
    print(f"📦 Inserting: {nom_parking} → {image_url}")

    try:
        supabase.table("real_time_parking_spots").insert(row).execute()
        success_realtime += 1
    except Exception as e:
        print(f"Failed to insert into real_time_parking_spots for facility {facility_id}: {e}")

# Call the stored procedure
print("📡 Calling Supabase function: update_event_status_realtime()...")
supabase.rpc("update_event_status_realtime", {}).execute()

print(f"✅ Done. Inserted {success_realtime} records into real_time_parking_spots.")
