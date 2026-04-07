CREATE TABLE IF NOT EXISTS links (
  id              TEXT PRIMARY KEY,
  creator_address TEXT NOT NULL,
  creator_email   TEXT,
  amount          TEXT NOT NULL,
  token           TEXT NOT NULL,
  note            TEXT,
  expires_at      TIMESTAMPTZ,
  status          TEXT NOT NULL DEFAULT 'pending',
  split_total     INTEGER,
  split_paid      INTEGER DEFAULT 0,
  views           INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
  id              TEXT PRIMARY KEY,
  link_id         TEXT NOT NULL REFERENCES links(id),
  payer_address   TEXT NOT NULL,
  payer_email     TEXT,
  amount_paid     TEXT NOT NULL,
  token_paid      TEXT NOT NULL,
  tx_hash         TEXT NOT NULL UNIQUE,
  paid_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_links_creator ON links(creator_address);
CREATE INDEX IF NOT EXISTS idx_links_status ON links(status);
CREATE INDEX IF NOT EXISTS idx_payments_link ON payments(link_id);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER links_updated_at
  BEFORE UPDATE ON links
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
