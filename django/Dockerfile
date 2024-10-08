# Use the official Python image from the Docker Hub
FROM python:3.9-slim

# Set environment variables to prevent Python from writing .pyc files and buffering stdout/stderr
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory inside the container
WORKDIR /code
RUN mkdir -p /code/static
RUN mkdir -p /code/media

# Copy the requirements.txt file into the container
COPY requirements.txt /code/
COPY static /code/static
COPY media /code/media

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt
RUN apt-get update && \
    apt-get install -y curl && \
    apt-get install -y --no-install-recommends openssl

# Install Node.js
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get install -y nodejs

# Install Three.js and other necessary packages via npm
RUN npm install -g three

RUN chmod 755 /code/static/
RUN chmod 755 /code/media/

# Copy the rest of the application code into the container
COPY . /code/

# Expose port 8000 for the application
EXPOSE 8000 8001
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Set the default command to run when the container starts
ENTRYPOINT ["./docker-entrypoint.sh"]
