# Stage 1: Builder
FROM alpine:latest AS builder

# Install required packages
RUN apk add --no-cache openssl python3 py3-pip py3-virtualenv

# Create necessary directories
RUN mkdir -p /etc/prometheus/certs /etc/prometheus/auth

# Copy the password generation script
COPY gen-pass.py /gen-pass.py

# Generate SSL certificates
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/prometheus/certs/server.key\
    -out /etc/prometheus/certs/server.crt \
    -subj "/C=CA/ST=Quebec/L=42Quebec/O=42School/OU=42Quebec/CN=localhost"


# Set permissions for the certificates
RUN chmod 666 /etc/prometheus/certs/*

# Install Python virtual environment and dependencies
RUN python3 -m venv /venv && . /venv/bin/activate && pip install bcrypt

# Define a build argument for the password
ARG PROMETHEUS_PASSWORD

# Generate hashed password using the build argument
RUN . /venv/bin/activate && \
    python3 /gen-pass.py ${PROMETHEUS_PASSWORD} > /etc/prometheus/auth/hashed_password

# Stage 2: Final image
FROM prom/prometheus:latest

# Copy files from the builder stage
COPY --from=builder /etc/prometheus/certs /etc/prometheus/certs
COPY --from=builder /etc/prometheus/auth /etc/prometheus/auth

# Copy Prometheus configuration files
COPY prometheus.yml /etc/prometheus/prometheus.yml
COPY web.yml /etc/prometheus/web.yml
COPY alert_rules.yml /etc/prometheus/alert_rules.yml

# Update web.yml with the hashed password
RUN HASHED_PASSWORD=$(cat /etc/prometheus/auth/hashed_password) && \
    sed -i 's|hashed_password|'"$HASHED_PASSWORD"'|g' /etc/prometheus/web.yml

# Set the command to start Prometheus
CMD ["--config.file=/etc/prometheus/prometheus.yml", \
     "--web.listen-address=:9090", \
     "--web.external-url=https://localhost:8000", \
     "--web.config.file=/etc/prometheus/web.yml"]
