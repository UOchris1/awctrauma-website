-- Migration: Update algorithms with existing flowchart images
-- Run this in your Supabase SQL Editor to link existing flowchart images

-- Update each algorithm with the corresponding image URL from public/flowcharts
UPDATE algorithms SET image_url = '/flowcharts/rib_fracture.png' WHERE short_title = 'Rib Fracture';
UPDATE algorithms SET image_url = '/flowcharts/pelvic_fracture.jpg' WHERE short_title = 'Pelvic Fracture';
UPDATE algorithms SET image_url = '/flowcharts/BCVI.jpg' WHERE short_title = 'BCVI';
UPDATE algorithms SET image_url = '/flowcharts/splenic_injury.jfif' WHERE short_title = 'Spleen';
UPDATE algorithms SET image_url = '/flowcharts/hepatic_injury_flow_chart.png' WHERE short_title = 'Liver';
UPDATE algorithms SET image_url = '/flowcharts/renal_injury.jfif' WHERE short_title = 'Kidney';
UPDATE algorithms SET image_url = '/flowcharts/difficult_airway.jpg' WHERE short_title = 'Airway';
UPDATE algorithms SET image_url = '/flowcharts/adrenal_insufficiency.jpg' WHERE short_title = 'Brain';
