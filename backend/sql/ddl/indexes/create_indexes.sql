-- Add spatial index to event_logs (related to parking_logs)
CREATE INDEX IF NOT EXISTS idx_events_location ON event_logs
USING GIST (geography(ST_MakePoint(longitude, latitude)));
