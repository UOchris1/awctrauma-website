-- Migration: Fix algorithms table - add image_url column if missing
-- Run this in your Supabase SQL Editor to fix the missing image_url column
-- Date: 2025-11-28

-- Add image_url column if it doesn't exist
ALTER TABLE algorithms ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Update all algorithms with their image URLs (runs safely even if already set)
UPDATE algorithms SET image_url = '/flowcharts/rib_fracture.png' WHERE short_title = 'Rib Fracture' AND (image_url IS NULL OR image_url = '');
UPDATE algorithms SET image_url = '/flowcharts/pelvic_fracture.jpg' WHERE short_title = 'Pelvic Fracture' AND (image_url IS NULL OR image_url = '');
UPDATE algorithms SET image_url = '/flowcharts/BCVI.jpg' WHERE short_title = 'BCVI' AND (image_url IS NULL OR image_url = '');
UPDATE algorithms SET image_url = '/flowcharts/splenic_injury.jfif' WHERE short_title = 'Spleen' AND (image_url IS NULL OR image_url = '');
UPDATE algorithms SET image_url = '/flowcharts/hepatic_injury_flow_chart.png' WHERE short_title = 'Liver' AND (image_url IS NULL OR image_url = '');
UPDATE algorithms SET image_url = '/flowcharts/renal_injury.jfif' WHERE short_title = 'Kidney' AND (image_url IS NULL OR image_url = '');
UPDATE algorithms SET image_url = '/flowcharts/difficult_airway.jpg' WHERE short_title = 'Airway' AND (image_url IS NULL OR image_url = '');
UPDATE algorithms SET image_url = '/flowcharts/adrenal_insufficiency.jpg' WHERE short_title = 'Adrenal' AND (image_url IS NULL OR image_url = '');

-- Ensure Spleen algorithm exists (insert if missing)
INSERT INTO algorithms (title, short_title, icon_type, image_url, sort_order, is_active)
SELECT 'Splenic Injury Management', 'Spleen', 'spleen', '/flowcharts/splenic_injury.jfif', 4, true
WHERE NOT EXISTS (SELECT 1 FROM algorithms WHERE short_title = 'Spleen');

-- Ensure all algorithms are active
UPDATE algorithms SET is_active = true WHERE short_title IN (
  'Rib Fracture', 'Pelvic Fracture', 'BCVI', 'Spleen', 'Liver', 'Kidney', 'Airway', 'Adrenal'
);

-- Verify (this won't affect anything, just for checking)
-- SELECT id, title, short_title, icon_type, image_url, is_active, sort_order FROM algorithms ORDER BY sort_order;
