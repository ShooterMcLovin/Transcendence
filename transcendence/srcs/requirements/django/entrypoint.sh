#!/bin/bash
set -e

# Apply Django database migrations
echo "Applying Django database migrations..."
python manage.py migrate

# Start Django development server
echo "Starting Django development server on 127.0.0.1:8000..."
exec python manage.py runserver 127.0.0.1:8000
