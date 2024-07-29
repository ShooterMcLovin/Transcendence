#!/bin/bash
set -e

# Variables from environment or defaults
POSTGRES_USER=${POSTGRES_USER:-postgres}
POSTGRES_DB=${POSTGRES_DB:-postgres_db}
POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-password}
POSTGRES_ROLE=${POSTGRES_ROLE:-db_user}
POSTGRES_ROLE_PASSWORD=${POSTGRES_ROLE_PASSWORD:-password}

# Function to create PostgreSQL role
create_role() {
    echo "Creating PostgreSQL role: $POSTGRES_ROLE"
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
        CREATE ROLE $POSTGRES_ROLE WITH LOGIN PASSWORD '$POSTGRES_ROLE_PASSWORD';
        ALTER ROLE $POSTGRES_ROLE CREATEDB;
EOSQL
}

# Function to create PostgreSQL database
create_database() {
    echo "Creating PostgreSQL database: $POSTGRES_DB"
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
        CREATE DATABASE $POSTGRES_DB;
EOSQL
}

# Initialize PostgreSQL data directory if not already initialized
if [ ! -s "/var/lib/postgresql/data/PG_VERSION" ]; then
    echo "Initializing PostgreSQL data directory"
    gosu postgres initdb --username="$POSTGRES_USER" --encoding=unicode \
        --auth-local=trust --auth-host=trust
fi

# Modify pg_hba.conf to allow connections from specific hosts
echo "Configuring pg_hba.conf"
cat >> /var/lib/postgresql/data/pg_hba.conf <<EOL
host    all             all             172.18.0.0/16            trust
host    all             all             127.0.0.1/32            trust
host    all             all             ::1/128                  trust
EOL

# Start PostgreSQL
echo "Starting PostgreSQL..."
gosu postgres pg_ctl -D "/var/lib/postgresql/data" -o "-c listen_addresses='*'" -w start

# Wait for PostgreSQL to start
echo "Waiting for PostgreSQL to start..."
sleep 5

# Create role if it doesn't exist
if ! psql -U "$POSTGRES_USER" -d postgres -tAc "SELECT 1 FROM pg_roles WHERE rolname='$POSTGRES_ROLE'" | grep -q 1; then
    create_role
fi

# Create database if it doesn't exist
if ! psql -U "$POSTGRES_USER" -d postgres -lqt | cut -d \| -f 1 | grep -qw "$POSTGRES_DB"; then
    create_database
fi

# Stop PostgreSQL to apply changes (optional)
gosu postgres pg_ctl -D "/var/lib/postgresql/data" -m fast -w stop

# Start PostgreSQL
echo "Starting PostgreSQL...."
exec gosu postgres postgres -D "/var/lib/postgresql/data"
