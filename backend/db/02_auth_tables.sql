-- Source-File AI Declaration
-- AI contribution: 50% or more AI-generated
-- Issue #39: users, restaurant memberships, invites and EULA acceptances.
-- Undo with: python -m app.core.database down (from backend/)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Accounts & Access
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- one account per email, regardless of capitals (John@ and john@ are the same)
CREATE UNIQUE INDEX IF NOT EXISTS uq_users_email_lower ON users (lower(email));

CREATE TABLE IF NOT EXISTS restaurant_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('owner', 'kitchen_manager')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, restaurant_id)
);

CREATE TABLE IF NOT EXISTS invites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('owner', 'kitchen_manager')),
    token_hash VARCHAR(255) NOT NULL UNIQUE,  -- only the hash; the raw token is never stored
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    revoked_at TIMESTAMP WITH TIME ZONE,      -- NULL while the invite is still valid
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS eula_acceptances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    eula_version VARCHAR(50) NOT NULL,
    accepted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, eula_version)
);

CREATE INDEX IF NOT EXISTS idx_memberships_restaurant_id ON restaurant_memberships(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_invites_restaurant_id ON invites(restaurant_id);
