CREATE TABLE IF NOT EXISTS leads (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT,
  email       TEXT NOT NULL UNIQUE,
  pack_slug   TEXT,
  subscribed  BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now()
);
