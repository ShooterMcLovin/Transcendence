# Use the official Nginx image as a base
FROM nginx:latest

# Install OpenSSL (needed to generate self-signed certificates)
RUN apt-get update && \
    apt-get install -y --no-install-recommends openssl && \
    rm -rf /var/lib/apt/lists/*
# Create necessary directories for SSL certificates
RUN rm -rf /etc/nginx/ssl
RUN mkdir -p /etc/nginx/ssl

# Generate self-signed SSL certificates
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/selfsigned.key \
    -out /etc/nginx/ssl/selfsigned.crt \
    -subj "/C=CA/ST=Quebec/L=42Quebec/O=42School/OU=42Quebec/CN=localhost"

# Copy Nginx configuration files to the correct directory
COPY default.conf /etc/nginx/conf.d/default.conf

# Expose ports for HTTP and HTTPS
EXPOSE 80 443
