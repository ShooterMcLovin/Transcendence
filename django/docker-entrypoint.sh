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
User = get_user_model()
if not User.objects.filter(username='IA').exists():
    User.objects.create_superuser(
        nickname='$DJANGO_SUPERUSER_NICKNAME',
        username='$DJANGO_SUPERUSER_USERNAME',
        email='$DJANGO_SUPERUSER_EMAIL',
        password='$DJANGO_SUPERUSER_PASSWORD'
    )
EOF

# Create a default user if one does not already exist
echo "Creating default user..."
python manage.py shell <<EOF
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='Guest').exists():
    User.objects.create_user(
        nickname='$DJANGO_GUEST_NICKNAME',
        username='$DJANGO_GUEST_USERNAME',
        email='$DJANGO_GUEST_EMAIL',
        password='$DJANGO_GUEST_PASSWORD'
    )
EOF


# Start Gunicorn server
echo "Starting Gunicorn server on 0.0.0.0:8000..."
exec gunicorn trans.wsgi:application --bind 0.0.0.0:8000
