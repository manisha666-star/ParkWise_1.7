-- Create the parking_logs table
CREATE TABLE IF NOT EXISTS public.parking_logs (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    facilityid TEXT,
    countertype TEXT,
    counterfreeplaces INTEGER,
    nom_parking TEXT,
    type_de_parc TEXT,
    timestamp TIMESTAMP DEFAULT now()
);
