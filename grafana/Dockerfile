FROM alpine:3.18 AS builder

RUN apk add --no-cache openssl

RUN mkdir -p /etc/grafana/certs && \
    mkdir -p /etc/grafana/provisioning/

RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/grafana/certs/server.key \
    -out /etc/grafana/certs/server.crt \
    -subj "/C=CA/ST=Quebec/L=42Quebec/O=42School/OU=42Quebec/CN=localhost"

# Set more secure permissions
RUN chmod 666 /etc/grafana/certs/server.crt \
    && chmod 666 /etc/grafana/certs/server.key && \ 
    chmod 666 /etc/grafana/provisioning/ 

FROM grafana/grafana:latest

COPY --from=builder /etc/grafana/certs /etc/grafana/certs
COPY --from=builder /etc/grafana/provisioning /etc/grafana/provisioning

COPY grafana.ini /etc/grafana/grafana.ini
COPY provisioning /etc/grafana/provisioning

# Make sure you expose the correct port
EXPOSE 3000

CMD ["grafana-server", "--config=/etc/grafana/grafana.ini"]
