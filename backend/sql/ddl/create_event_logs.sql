-- Create the event_logs table
CREATE TABLE IF NOT EXISTS event_logs (
    id TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    date_start TIMESTAMP,
    date_end TIMESTAMP,
    address_street TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    fetched_at TIMESTAMP
);
