-- Add event_id foreign key column
ALTER TABLE parking_logs
  ADD COLUMN IF NOT EXISTS event_id TEXT
  REFERENCES event_logs(id);

-- Add latitude and longitude
ALTER TABLE parking_logs
  ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;

ALTER TABLE parking_logs
  ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;

-- Add is_event_occurring column
ALTER TABLE parking_logs
  ADD COLUMN IF NOT EXISTS is_event_occurring INTEGER DEFAULT 0;

-- Enable PostGIS if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Add geog column for spatial queries
ALTER TABLE parking_logs
  ADD COLUMN IF NOT EXISTS geog GEOGRAPHY(Point, 4326);
