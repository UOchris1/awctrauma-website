-- Migration: Rename "Brain" algorithm to "Adrenal Insufficiency"
-- Run this in your Supabase SQL Editor

UPDATE algorithms
SET
  title = 'Adrenal Insufficiency / Stress Dose Steroids',
  short_title = 'Adrenal Insufficiency',
  icon_type = 'endocrine'
WHERE short_title = 'Brain';
