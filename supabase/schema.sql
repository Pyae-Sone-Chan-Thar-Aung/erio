-- ERIO Dashboard Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Dashboard Statistics Table
CREATE TABLE IF NOT EXISTS dashboard_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    partner_universities INTEGER NOT NULL DEFAULT 76,
    active_agreements INTEGER NOT NULL DEFAULT 65,
    student_exchanges INTEGER NOT NULL DEFAULT 892,
    events_this_year INTEGER NOT NULL DEFAULT 32,
    regional_distribution JSONB NOT NULL DEFAULT '{"asiaPacific": 88, "europe": 7, "americas": 5}'::jsonb,
    programs_offered JSONB NOT NULL DEFAULT '{"exchange": 68, "research": 24, "summer": 18}'::jsonb,
    engagement_score DECIMAL(3,1) NOT NULL DEFAULT 9.2,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Partner Universities Table
CREATE TABLE IF NOT EXISTS partner_universities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    city VARCHAR(100),
    lat DECIMAL(10, 6),
    lng DECIMAL(10, 6),
    students INTEGER DEFAULT 0,
    programs TEXT[] DEFAULT ARRAY['Student Exchange'],
    established VARCHAR(50),
    type VARCHAR(50) DEFAULT 'Comprehensive',
    -- Agreement dates for Active Agreements tracking
    sign_date DATE,
    expiry_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Recent Activities Table
CREATE TABLE IF NOT EXISTS recent_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    last_login TIMESTAMP WITH TIME ZONE
);

-- Insert default dashboard stats
INSERT INTO dashboard_stats (
    partner_universities, 
    active_agreements, 
    student_exchanges, 
    events_this_year, 
    regional_distribution, 
    programs_offered, 
    engagement_score
)
VALUES (
    76, 
    65, 
    892, 
    32, 
    '{"asiaPacific": 88, "europe": 7, "americas": 5}'::jsonb, 
    '{"exchange": 68, "research": 24, "summer": 18}'::jsonb, 
    9.2
)
ON CONFLICT DO NOTHING;

-- Insert default admin user
-- Password: erio2026pass! (stored as plain text for now - in production, use proper hashing)
INSERT INTO admin_users (email, password_hash)
VALUES ('paung_230000001724@uic.edu.ph', 'erio2026pass!')
ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_partner_country ON partner_universities(country);
CREATE INDEX IF NOT EXISTS idx_activity_date ON recent_activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_dashboard_stats_updated ON dashboard_stats(updated_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE dashboard_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE recent_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can read dashboard stats" ON dashboard_stats
    FOR SELECT USING (true);

CREATE POLICY "Public can read partners" ON partner_universities
    FOR SELECT USING (true);

CREATE POLICY "Public can read activities" ON recent_activities
    FOR SELECT USING (true);

-- Create policies for admin write access
-- Note: In production, implement proper authentication checks
CREATE POLICY "Admins can update dashboard stats" ON dashboard_stats
    FOR ALL USING (true);

CREATE POLICY "Admins can manage partners" ON partner_universities
    FOR ALL USING (true);

CREATE POLICY "Admins can manage activities" ON recent_activities
    FOR ALL USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_dashboard_stats_updated_at BEFORE UPDATE ON dashboard_stats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_partner_universities_updated_at BEFORE UPDATE ON partner_universities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recent_activities_updated_at BEFORE UPDATE ON recent_activities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
