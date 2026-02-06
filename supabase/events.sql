-- Events Table for ERIO Dashboard
-- Run this SQL in your Supabase SQL Editor (after schema.sql)
-- Events This Year: title, place, date, short_description

-- Events Table
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    place VARCHAR(255),
    event_date VARCHAR(100),
    short_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Index for sorting by date
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date DESC);
CREATE INDEX IF NOT EXISTS idx_events_updated ON events(updated_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Public can read all events
CREATE POLICY "Public can read events" ON events
    FOR SELECT USING (true);

-- Admins can manage events (insert, update, delete)
CREATE POLICY "Admins can manage events" ON events
    FOR ALL USING (true);

-- Function for updated_at (skip if already exists from schema.sql)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
