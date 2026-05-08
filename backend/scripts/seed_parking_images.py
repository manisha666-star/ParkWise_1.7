import os
import requests
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise Exception("Missing Supabase credentials")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# API to fetch image data
image_api_url = "https://opendata.saemes.fr/api/explore/v2.1/catalog/datasets/photos-parkings-et-zones-voirie-saemes/records?limit=100"

print(" Fetching image data from Saemes API...")

try:
    response = requests.get(image_api_url)
    response.raise_for_status()
    records = response.json().get("results", [])
except Exception as e:
    print(f" Failed to fetch data: {e}")
    exit(1)

print(f" Fetched {len(records)} image records.")

# Process each record
for item in records:
    nom_parking = item.get("nom_parking", "").strip().lower()
    photo_data = item.get("nom_fichier_photo")

    if not nom_parking or not photo_data or not photo_data.get("url"):
        continue  # skip incomplete entries

    image_url = photo_data.get("url")

    try:
        supabase.table("parking_images").upsert({
            "nom_parking": nom_parking,
            "image_url": image_url
        }, on_conflict=["nom_parking"]).execute()
        print(f" Inserted/Updated: {nom_parking}")
    except Exception as e:
        print(f" Error inserting {nom_parking}: {e}")
