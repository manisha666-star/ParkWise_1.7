-- Function to update real-time parking rows with nearby event info
CREATE OR REPLACE FUNCTION update_event_status_realtime()
RETURNS void AS $$
BEGIN
  -- 1. Reset event info
  UPDATE real_time_parking_spots
  SET is_event_occurring = 0,
      event_id = NULL;

  -- 2. Update based on nearby active events
  UPDATE real_time_parking_spots p
  SET is_event_occurring = 1,
      event_id = e.id
  FROM event_logs e
  WHERE ST_DWithin(
          geography(ST_MakePoint(p.longitude, p.latitude)),
          geography(ST_MakePoint(e.longitude, e.latitude)),
          1000
        )
    AND p.timestamp BETWEEN e.date_start AND e.date_end;

  -- 3. Archive data
  INSERT INTO parking_logs (
    facilityid,
    countertype,
    counterfreeplaces,
    nom_parking,
    type_de_parc,
    latitude,
    longitude,
    timestamp,
    geog,
    is_event_occurring,
    event_id
  )
  SELECT
    facilityid,
    countertype,
    counterfreeplaces,
    nom_parking,
    type_de_parc,
    latitude,
    longitude,
    timestamp,
    geog,
    is_event_occurring,
    event_id
  FROM real_time_parking_spots;
END;
$$ LANGUAGE plpgsql;
