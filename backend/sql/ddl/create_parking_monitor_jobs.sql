CREATE TABLE parking_monitor_jobs (
    id SERIAL PRIMARY KEY,
    user_email TEXT,
    facility_id TEXT,
    original_free_places INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT now(),
    monitor_for_time TIMESTAMP
);
