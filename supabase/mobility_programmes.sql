-- Mobility Programmes Table for ERIO Dashboard
-- Run this SQL in your Supabase SQL Editor (after schema.sql)
-- Use for Faculty Exchange / Student Exchange, Inbound / Outbound programmes

-- Mobility Programmes Table
CREATE TABLE IF NOT EXISTS mobility_programmes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    programme_name VARCHAR(255) NOT NULL,
    programme_date VARCHAR(100),
    place VARCHAR(255),
    number_of_students INTEGER NOT NULL DEFAULT 0,
    type VARCHAR(50) NOT NULL CHECK (type IN ('student_exchange', 'faculty_exchange')),
    direction VARCHAR(50) NOT NULL CHECK (direction IN ('inbound', 'outbound')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Index for filtering by type and direction (public modal)
CREATE INDEX IF NOT EXISTS idx_mobility_type ON mobility_programmes(type);
CREATE INDEX IF NOT EXISTS idx_mobility_direction ON mobility_programmes(direction);
CREATE INDEX IF NOT EXISTS idx_mobility_updated ON mobility_programmes(updated_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE mobility_programmes ENABLE ROW LEVEL SECURITY;

-- Public can read all mobility programmes
CREATE POLICY "Public can read mobility programmes" ON mobility_programmes
    FOR SELECT USING (true);

-- Admins can manage mobility programmes (insert, update, delete)
CREATE POLICY "Admins can manage mobility programmes" ON mobility_programmes
    FOR ALL USING (true);

-- Function for updated_at (skip if already exists from schema.sql)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_mobility_programmes_updated_at BEFORE UPDATE ON mobility_programmes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Optional: seed a few sample rows (remove or adjust as needed)
-- INSERT INTO mobility_programmes (programme_name, programme_date, place, number_of_students, type, direction) VALUES
-- ('Exchange with Universiti Malaya', '2025-01-15', 'Kuala Lumpur, Malaysia', 5, 'student_exchange', 'outbound'),
-- ('Faculty Visit - Kansai University', '2025-02-20', 'Osaka, Japan', 2, 'faculty_exchange', 'outbound');
