#!/bin/bash
set -e

# Ensure we are running as the postgres user
if [ "$(id -u)" = '0' ]; then
    exec gosu postgres "$BASH_SOURCE" "$@"
fi

# Check if the data directory is empty
if [ -z "$(ls -A /var/lib/postgresql/data)" ]; then
    # Initialize the database
    echo "Initializing database..."
    initdb -D /var/lib/postgresql/data

    # Configure pg_hba.conf to allow connections
    echo "Configuring pg_hba.conf..."
    echo "host    all             all             0.0.0.0/0               md5" >> /var/lib/postgresql/data/pg_hba.conf
    echo "host    all             all             ::/0                    md5" >> /var/lib/postgresql/data/pg_hba.conf

    # Start PostgreSQL in the background
    pg_ctl -D /var/lib/postgresql/data -o "-c listen_addresses=''" -w start

    # Create the superuser with the provided credentials
    echo "Creating superuser..."
    psql -v ON_ERROR_STOP=1 --username "postgres" --dbname "postgres" <<-EOSQL
        CREATE USER $POSTGRES_USER WITH SUPERUSER PASSWORD '$POSTGRES_PASSWORD';
        CREATE DATABASE $POSTGRES_DB;
        GRANT ALL PRIVILEGES ON DATABASE $POSTGRES_DB TO $POSTGRES_USER;
EOSQL

    # Stop the PostgreSQL server after the setup
    pg_ctl -D /var/lib/postgresql/data -m fast -w stop
fi

# Start PostgreSQL server
exec postgres
