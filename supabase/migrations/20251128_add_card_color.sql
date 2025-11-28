-- Add card_color column to algorithms table for custom color selection
ALTER TABLE algorithms
ADD COLUMN IF NOT EXISTS card_color TEXT DEFAULT 'auto';

-- Add constraint to ensure valid color values
ALTER TABLE algorithms
ADD CONSTRAINT valid_card_color
CHECK (card_color IN ('auto', 'blue', 'rose', 'emerald', 'amber', 'sky', 'indigo', 'purple', 'teal', 'orange'));
