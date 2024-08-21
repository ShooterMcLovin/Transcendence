#!/bin/bash
set -e

# Apply Django database migrations
echo "Applying Django database migrations..."
python manage.py makemigrations
python manage.py migrate

# Collect static files (if needed)
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Create a Django superuser if one does not already exist
echo "Creating superuser..."
python manage.py shell <<EOF
from django.contrib.auth import get_user_model
from django.core.management.utils import get_random_secret_key
import os

User = get_user_model()

username = os.getenv('DJANGO_SUPERUSER_USERNAME')
email = os.getenv('DJANGO_SUPERUSER_EMAIL')
password = os.getenv('DJANGO_SUPERUSER_PASSWORD')

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(
        username=username,
        email=email,
        password=password
    )
EOF

# Create a default user if one does not already exist
echo "Creating default user..."
python manage.py shell <<EOF
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='Guest').exists():
    User.objects.create_user(
        username='Guest',
        nickname='guest',
        email='guest@example.com',
        password='password'
    )
EOF


# Start Gunicorn server
echo "Starting Gunicorn server on 0.0.0.0:8000..."
exec gunicorn trans.wsgi:application --bind 0.0.0.0:8000
