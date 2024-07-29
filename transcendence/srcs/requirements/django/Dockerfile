# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR /code

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       gcc \
       netcat-openbsd \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt /code/
RUN pip install --upgrade pip \
    && pip install -r requirements.txt

# Copy the Django project code into the container
COPY . /code/

# Collect static files
RUN python manage.py collectstatic --noinput

# Copy entrypoint and PostgreSQL wait script
COPY entrypoint.sh /code/entrypoint.sh

RUN chmod +x /code/entrypoint.sh

# Expose port 8000 (used by Gunicorn/Daphne)
EXPOSE 8000

# Set entrypoint to run the entrypoint script
ENTRYPOINT ["/code/entrypoint.sh"]
