-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create real_time_parking_spots table
CREATE TABLE public.real_time_parking_spots (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    facilityid TEXT UNIQUE,
    countertype TEXT,
    counterfreeplaces INTEGER,
    nom_parking TEXT,
    type_de_parc TEXT,
    timestamp TIMESTAMP DEFAULT now(),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    geog GEOGRAPHY(Point, 4326)
);

-- Add additional columns
ALTER TABLE real_time_parking_spots
ADD COLUMN image_url TEXT;

ALTER TABLE real_time_parking_spots
ADD COLUMN event_id TEXT
REFERENCES event_logs(id);

ALTER TABLE public.real_time_parking_spots
ADD COLUMN is_event_occurring INTEGER DEFAULT 0;
