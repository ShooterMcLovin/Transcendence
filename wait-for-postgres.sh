#!/bin/sh

# Check if host and port are provided
if [ $# -lt 2 ]; then
  echo "Usage: $0 host port command"
  exit 1
fi

# Variables
host="$1"
port="$2"
shift 2

cmd="$@"

echo "Waiting for PostgreSQL..."

# Wait until PostgreSQL is available
until nc -z "$host" "$port"; do
  >&2 echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

>&2 echo "PostgreSQL is up - executing command"
exec $cmd
