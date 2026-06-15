-- Nivya BFF — minimum PostgreSQL schema (v0.1)
-- See HYBRID-E2E-PLAN.md Phase 2

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE kyc_status AS ENUM ('pending', 'in_progress', 'registered', 'rejected');
CREATE TYPE order_type AS ENUM ('purchase', 'redeem', 'switch');
CREATE TYPE order_status AS ENUM (
  'draft', 'payment_pending', 'mandate_pending',
  'submitted_to_exchange', 'accepted', 'rejected',
  'units_allotted', 'completed', 'failed'
);
CREATE TYPE sip_status AS ENUM ('active', 'paused', 'cancelled');
CREATE TYPE mandate_status AS ENUM ('pending', 'active', 'failed', 'cancelled');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(15) NOT NULL UNIQUE,
  email VARCHAR(255),
  kyc_status kyc_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE user_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  pan VARCHAR(10),
  name VARCHAR(255),
  dob DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ifsc VARCHAR(11) NOT NULL,
  account_no VARCHAR(18) NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE kyc_records (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  kra_status VARCHAR(32),
  ckyc_id VARCHAR(32),
  validated_at TIMESTAMPTZ,
  payload JSONB,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE holdings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scheme_code VARCHAR(32) NOT NULL,
  folio VARCHAR(32),
  units NUMERIC(18, 4) NOT NULL DEFAULT 0,
  avg_nav NUMERIC(18, 4) NOT NULL DEFAULT 0,
  synced_at TIMESTAMPTZ,
  UNIQUE (user_id, scheme_code, folio)
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type order_type NOT NULL,
  scheme_code VARCHAR(32) NOT NULL,
  target_scheme_code VARCHAR(32),
  amount NUMERIC(18, 2),
  units NUMERIC(18, 4),
  status order_status NOT NULL DEFAULT 'draft',
  vendor_ref VARCHAR(64),
  arn VARCHAR(16) NOT NULL,
  euin VARCHAR(16) NOT NULL,
  failure_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE sips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scheme_code VARCHAR(32) NOT NULL,
  amount NUMERIC(18, 2) NOT NULL,
  debit_day SMALLINT NOT NULL CHECK (debit_day BETWEEN 1 AND 28),
  mandate_id UUID,
  status sip_status NOT NULL DEFAULT 'active',
  vendor_ref VARCHAR(64),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE mandates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bank_account_id UUID NOT NULL REFERENCES bank_accounts(id),
  umrn VARCHAR(64),
  status mandate_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE sips
  ADD CONSTRAINT sips_mandate_fk FOREIGN KEY (mandate_id) REFERENCES mandates(id);

CREATE TABLE audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  event_type VARCHAR(64) NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scheme_code VARCHAR(32) NOT NULL,
  sid_version VARCHAR(32) NOT NULL,
  consented_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, scheme_code, sid_version)
);

CREATE INDEX idx_orders_user_created ON orders(user_id, created_at DESC);
CREATE INDEX idx_holdings_user ON holdings(user_id);
CREATE INDEX idx_audit_events_user ON audit_events(user_id, created_at DESC);
