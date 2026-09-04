-- ==========================================================
-- LabTrack: Microbiology Laboratory Reagent Inventory Schema
-- Target Database: Supabase PostgreSQL
-- ==========================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Reagents Table
CREATE TABLE IF NOT EXISTS reagents (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    quantity NUMERIC(10, 2) NOT NULL CHECK (quantity >= 0),
    unit VARCHAR(50) NOT NULL,
    expiry_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Index on expiry_date for efficient date queries and alerts
CREATE INDEX IF NOT EXISTS idx_reagents_expiry_date ON reagents(expiry_date);
CREATE INDEX IF NOT EXISTS idx_reagents_name ON reagents(name);

-- Seed realistic microbiology laboratory reagents with dates relative to 2026/current date
INSERT INTO reagents (name, quantity, unit, expiry_date, created_at)
VALUES 
    ('Nutrient Agar', 500.00, 'g', CURRENT_DATE + INTERVAL '45 days', CURRENT_TIMESTAMP),
    ('MacConkey Agar', 500.00, 'g', CURRENT_DATE + INTERVAL '30 days', CURRENT_TIMESTAMP),
    ('Gram Crystal Violet', 250.00, 'mL', CURRENT_DATE + INTERVAL '4 days', CURRENT_TIMESTAMP),
    ('Gram Iodine Solution', 250.00, 'mL', CURRENT_DATE + INTERVAL '2 days', CURRENT_TIMESTAMP),
    ('Gram Safranin Counterstain', 250.00, 'mL', CURRENT_DATE - INTERVAL '3 days', CURRENT_TIMESTAMP),
    ('Hydrogen Peroxide 3% (Catalase Test)', 100.00, 'mL', CURRENT_DATE + INTERVAL '90 days', CURRENT_TIMESTAMP),
    ('Kovacs Reagent (Indole Test)', 50.00, 'mL', CURRENT_DATE - INTERVAL '12 days', CURRENT_TIMESTAMP),
    ('Oxidase Test Reagent (1% TMPD)', 30.00, 'mL', CURRENT_DATE + INTERVAL '6 days', CURRENT_TIMESTAMP),
    ('Blood Agar Base', 500.00, 'g', CURRENT_DATE + INTERVAL '120 days', CURRENT_TIMESTAMP),
    ('Mueller-Hinton Agar', 500.00, 'g', CURRENT_DATE + INTERVAL '60 days', CURRENT_TIMESTAMP),
    ('Ethanol 70% Disinfectant', 1000.00, 'mL', CURRENT_DATE + INTERVAL '5 days', CURRENT_TIMESTAMP),
    ('Phenol Red Broth Base', 250.00, 'g', CURRENT_DATE + INTERVAL '180 days', CURRENT_TIMESTAMP),
    ('Sabouraud Dextrose Agar', 500.00, 'g', CURRENT_DATE - INTERVAL '1 day', CURRENT_TIMESTAMP),
    ('Eosin Methylene Blue (EMB) Agar', 500.00, 'g', CURRENT_DATE + INTERVAL '210 days', CURRENT_TIMESTAMP),
    ('Simmons Citrate Agar', 250.00, 'g', CURRENT_DATE + INTERVAL '15 days', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;
