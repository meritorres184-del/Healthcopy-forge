-- 001_initial.sql
-- Initial schema for HealthCopy Forge: content packs, customers, purchases,
-- memberships, downloadable content files, and email subscribers.

CREATE TABLE IF NOT EXISTS content_packs (
  id              SERIAL PRIMARY KEY,
  slug            TEXT UNIQUE NOT NULL,          -- URL-friendly identifier
  title           TEXT NOT NULL,
  description     TEXT NOT NULL,
  price_cents     INTEGER NOT NULL,              -- Stripe-compatible (e.g. 4700 = $47)
  category        TEXT NOT NULL,                 -- "Supplements", "Fitness", "Natural Health"
  coming_soon     BOOLEAN DEFAULT false,
  includes        TEXT[] NOT NULL,               -- ["5 SEO-optimized articles", ...]
  stripe_price_id TEXT,                          -- set after Stripe product creation
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS customers (
  id                 SERIAL PRIMARY KEY,
  email              TEXT UNIQUE NOT NULL,
  name               TEXT,
  stripe_customer_id TEXT,
  created_at         TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS purchases (
  id               SERIAL PRIMARY KEY,
  customer_id      INTEGER REFERENCES customers(id),
  content_pack_id  INTEGER REFERENCES content_packs(id),
  stripe_session_id TEXT,
  amount_cents     INTEGER NOT NULL,
  status           TEXT DEFAULT 'completed',     -- completed, refunded
  created_at       TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS memberships (
  id                    SERIAL PRIMARY KEY,
  customer_id           INTEGER REFERENCES customers(id),
  stripe_subscription_id TEXT,
  status                TEXT DEFAULT 'active',   -- active, canceled, expired
  price_tier            TEXT NOT NULL,           -- 'standard' ($39) or 'premium' ($59)
  started_at            TIMESTAMPTZ DEFAULT now(),
  canceled_at           TIMESTAMPTZ,
  current_period_end    TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS content_files (
  id              SERIAL PRIMARY KEY,
  content_pack_id INTEGER REFERENCES content_packs(id),
  filename        TEXT NOT NULL,
  file_type       TEXT NOT NULL,                 -- 'article', 'email_sequence', 'social_posts', 'lead_magnet'
  storage_path    TEXT NOT NULL,                 -- S3/cloud path or relative path
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS email_subscribers (
  id            SERIAL PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  source        TEXT,                            -- which lead magnet they opted in from
  subscribed_at TIMESTAMPTZ DEFAULT now(),
  unsubscribed  BOOLEAN DEFAULT false
);
