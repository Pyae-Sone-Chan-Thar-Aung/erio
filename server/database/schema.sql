-- ERIO Dashboard Database Schema

-- Create database (run this manually in PostgreSQL)
-- CREATE DATABASE erio_dashboard;

-- Dashboard Statistics Table
CREATE TABLE IF NOT EXISTS dashboard_stats (
    id SERIAL PRIMARY KEY,
    partner_universities INTEGER NOT NULL DEFAULT 76,
    active_agreements INTEGER NOT NULL DEFAULT 65,
    student_exchanges INTEGER NOT NULL DEFAULT 892,
    events_this_year INTEGER NOT NULL DEFAULT 32,
    regional_distribution JSONB NOT NULL DEFAULT '{"asiaPacific": 88, "europe": 7, "americas": 5}',
    programs_offered JSONB NOT NULL DEFAULT '{"exchange": 68, "research": 24, "summer": 18}',
    engagement_score DECIMAL(3,1) NOT NULL DEFAULT 9.2,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Partner Universities Table
CREATE TABLE IF NOT EXISTS partner_universities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    city VARCHAR(100),
    lat DECIMAL(10, 6),
    lng DECIMAL(10, 6),
    students INTEGER DEFAULT 0,
    programs TEXT[] DEFAULT ARRAY['Student Exchange'],
    established VARCHAR(50),
    type VARCHAR(50) DEFAULT 'Comprehensive',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Recent Activities Table
CREATE TABLE IF NOT EXISTS recent_activities (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Insert default dashboard stats
INSERT INTO dashboard_stats (partner_universities, active_agreements, student_exchanges, events_this_year, regional_distribution, programs_offered, engagement_score)
VALUES (76, 65, 892, 32, '{"asiaPacific": 88, "europe": 7, "americas": 5}', '{"exchange": 68, "research": 24, "summer": 18}', 9.2)
ON CONFLICT DO NOTHING;

-- Insert default admin user (password will be hashed by the server)
-- Password: erio2026pass!
-- This should be done via the server's initialization script

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_partner_country ON partner_universities(country);
CREATE INDEX IF NOT EXISTS idx_activity_date ON recent_activities(created_at DESC);
