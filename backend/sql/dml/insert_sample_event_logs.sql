-- Sample data insert (optional for development or demo)
INSERT INTO event_logs (
    id, title, description, date_start, date_end, address_street,
    latitude, longitude, fetched_at
) VALUES (
    'event_001',
    'Concert at Arena',
    'Outdoor concert event',
    '2025-07-28 17:00:00',
    '2025-07-28 22:00:00',
    '123 Main St, Paris',
    48.8566,
    2.3522,
    NOW()
);
