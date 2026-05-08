-- Drop a now-unneeded column from parking_event_aggressor table
ALTER TABLE parking_event_aggressor
DROP COLUMN IF EXISTS is_event_occurring;
