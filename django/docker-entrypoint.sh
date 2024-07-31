#!/bin/bash
set -e

# Apply Django database migrations
echo "Applying Django database migrations..."
python manage.py makemigrations myapp
python manage.py migrate

# Collect static files (if needed)
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Start Gunicorn server
echo "Starting Gunicorn server on 0.0.0.0:8000..."
exec gunicorn trans.wsgi:application --bind 0.0.0.0:8000
