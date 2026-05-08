-- Trigger function to populate geog from lat/lon
CREATE OR REPLACE FUNCTION set_geog_from_coords()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
    NEW.geog := ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger definition for geog
CREATE TRIGGER trg_set_geog
BEFORE INSERT OR UPDATE ON real_time_parking_spots
FOR EACH ROW
EXECUTE FUNCTION set_geog_from_coords();
