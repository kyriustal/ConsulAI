-- SQL DIRECTIVE FOR SUPABASE DATABASE SETUP
-- Execute this script inside your Supabase SQL Editor (https://supabase.com)

-- 1. Create 'users' table
CREATE TABLE IF NOT EXISTS users (
  email TEXT PRIMARY KEY,
  uid TEXT NOT NULL,
  password TEXT,
  role TEXT DEFAULT 'agente',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  created_by TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Turn on Row Level Security (RLS) or leave public for direct prototype integration
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 2. Create 'cases' table
CREATE TABLE IF NOT EXISTS cases (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  applicant_name TEXT NOT NULL,
  country TEXT NOT NULL,
  decision TEXT NOT NULL,
  risk_score NUMERIC NOT NULL,
  result JSONB NOT NULL
);

-- Turn on Row Level Security (RLS) or leave public for direct prototype integration
ALTER TABLE cases DISABLE ROW LEVEL SECURITY;

-- 3. Create 'activity_logs' table
CREATE TABLE IF NOT EXISTS activity_logs (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  performed_by TEXT NOT NULL,
  action_type TEXT NOT NULL,
  description TEXT NOT NULL
);

ALTER TABLE activity_logs DISABLE ROW LEVEL SECURITY;

-- 4. Insert some default bootstrap accounts to guarantee immediate system access
INSERT INTO users (email, uid, password, role, created_by) VALUES
('natalj824@gmail.com', 'owner_bootstrap1', 'admin', 'proprietario', 'bootstrap'),
('onvisaexpress@gmail.com', 'owner_bootstrap2', 'admin', 'proprietario', 'bootstrap'),
('onvisacompany@gmail.com', 'owner_bootstrap3', 'admin', 'proprietario', 'bootstrap'),
('cirilnatal@gmail.com', 'owner_bootstrap4', 'admin', 'proprietario', 'bootstrap'),
('kyriusnatal@gmail.com', 'owner_bootstrap5', 'admin', 'proprietario', 'bootstrap'),
('cyrusnatalj@gmail.com', 'owner_bootstrap6', 'admin', 'proprietario', 'bootstrap'),
('josecirilosnatal@gmail.com', 'owner_bootstrap7', 'admin', 'proprietario', 'bootstrap')
ON CONFLICT (email) DO NOTHING;
