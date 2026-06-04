-- SQL DIRECTIVE FOR SUPABASE DATABASE SETUP
-- Execute this script inside your Supabase SQL Editor (https://supabase.com)
-- This script is fully IDEMPOTENT: safe to run multiple times without data loss.

-- ============================================================
-- 1. Table: users
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  email      TEXT PRIMARY KEY,
  uid        TEXT NOT NULL,
  name       TEXT,                        -- display name of the agent/user
  password   TEXT,
  role       TEXT DEFAULT 'agente',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  created_by TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Add columns that may be missing in older installations
ALTER TABLE users ADD COLUMN IF NOT EXISTS name       TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_role       ON users (role);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users (created_at DESC);

-- Disable Row Level Security (direct anon-key access)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- ============================================================
-- 2. Table: cases
-- ============================================================
CREATE TABLE IF NOT EXISTS cases (
  id             TEXT PRIMARY KEY,
  created_at     TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  applicant_name TEXT NOT NULL,
  country        TEXT NOT NULL,
  decision       TEXT NOT NULL,
  risk_score     NUMERIC NOT NULL,
  result         JSONB NOT NULL,
  agent_email    TEXT                     -- e-mail of the agent who saved the case
);

-- Add columns that may be missing in older installations
ALTER TABLE cases ADD COLUMN IF NOT EXISTS agent_email TEXT;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_cases_created_at  ON cases (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cases_decision    ON cases (decision);
CREATE INDEX IF NOT EXISTS idx_cases_country     ON cases (country);
CREATE INDEX IF NOT EXISTS idx_cases_agent_email ON cases (agent_email);

-- Disable Row Level Security
ALTER TABLE cases DISABLE ROW LEVEL SECURITY;

-- ============================================================
-- 3. Table: activity_logs
-- ============================================================
CREATE TABLE IF NOT EXISTS activity_logs (
  id           TEXT PRIMARY KEY,
  created_at   TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  performed_by TEXT NOT NULL,
  action_type  TEXT NOT NULL,
  description  TEXT NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at   ON activity_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_performed_by ON activity_logs (performed_by);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action_type  ON activity_logs (action_type);

-- Disable Row Level Security
ALTER TABLE activity_logs DISABLE ROW LEVEL SECURITY;

-- ============================================================
-- 4. Bootstrap admin accounts (safe to re-run via ON CONFLICT)
-- ============================================================
INSERT INTO users (email, uid, password, role, created_by) VALUES
  ('natalj824@gmail.com',        'owner_bootstrap1', 'admin', 'proprietario', 'bootstrap'),
  ('onvisaexpress@gmail.com',    'owner_bootstrap2', 'admin', 'proprietario', 'bootstrap'),
  ('onvisacompany@gmail.com',    'owner_bootstrap3', 'admin', 'proprietario', 'bootstrap'),
  ('cirilnatal@gmail.com',       'owner_bootstrap4', 'admin', 'proprietario', 'bootstrap'),
  ('kyriusnatal@gmail.com',      'owner_bootstrap5', 'admin', 'proprietario', 'bootstrap'),
  ('cyrusnatalj@gmail.com',      'owner_bootstrap6', 'admin', 'proprietario', 'bootstrap'),
  ('josecirilosnatal@gmail.com', 'owner_bootstrap7', 'admin', 'proprietario', 'bootstrap')
ON CONFLICT (email) DO NOTHING;
