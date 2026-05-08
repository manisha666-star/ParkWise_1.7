-- Trigger function to auto-set geog from latitude/longitude
CREATE OR REPLACE FUNCTION set_geog_from_coords()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
    NEW.geog := ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to parking_logs
CREATE TRIGGER trg_set_geog
BEFORE INSERT OR UPDATE ON parking_logs
FOR EACH ROW
EXECUTE FUNCTION set_geog_from_coords();
