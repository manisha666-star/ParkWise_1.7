-- Function to get nearby parking within radius
CREATE OR REPLACE FUNCTION get_nearby_parking(
  lat DOUBLE PRECISION,
  lon DOUBLE PRECISION,
  radius_m DOUBLE PRECISION
)
RETURNS TABLE (
  facilityid TEXT,
  nom_parking TEXT,
  image_url TEXT,
  counterfreeplaces INTEGER,
  distance_m DOUBLE PRECISION,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.facilityid,
    r.nom_parking,
    r.image_url,
    r.counterfreeplaces,
    ST_Distance(r.geog, ST_MakePoint(lon, lat)::geography) AS distance_m,
    r.latitude,
    r.longitude
  FROM real_time_parking_spots r
  WHERE ST_DWithin(r.geog, ST_MakePoint(lon, lat)::geography, radius_m)
  ORDER BY distance_m
  LIMIT 10;
END;
$$ LANGUAGE plpgsql STABLE;
