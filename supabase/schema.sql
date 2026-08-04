-- Extension lagao pehle
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CHAT HISTORY
CREATE TABLE IF NOT EXISTS chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  messages JSONB NOT NULL DEFAULT '[]',
  provider_used TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_chat_user_id ON chat_history(user_id);

-- FIRST USER = SUPER ADMIN
CREATE OR REPLACE FUNCTION set_first_user_admin()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM users) = 1 THEN
    NEW.role := 'super_admin';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_first_user_admin_trigger ON users;
CREATE TRIGGER set_first_user_admin_trigger
BEFORE INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION set_first_user_admin();

-- RLS FIX - Custom Auth ke liye RLS hatana padega
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own data" ON users;
DROP POLICY IF EXISTS "Users can manage their own chat history" ON chat_history;

-- Service role (NextAuth server) ko full access do
CREATE POLICY "Allow service_role full access" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow service_role full access chat" ON chat_history FOR ALL USING (true) WITH CHECK (true);
