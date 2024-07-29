FROM alpine:3.19

# Install NGINX and OpenSSL
RUN apk update && \
    apk add --no-cache nginx openssl

# Create necessary directories
RUN mkdir -p /var/www/html /etc/nginx/ssl /run/nginx

RUN rm /etc/nginx/http.d/default.conf
# Copy NGINX configuration file
COPY conf/nginx.conf /etc/nginx/http.d/default.conf
# COPY ./404.html  /404.html

# Generate SSL certificate and key
RUN openssl req -newkey rsa:4096 -x509 -sha256 -days 365 -nodes \
        -out /etc/nginx/ssl/sslcert.crt \
        -keyout /etc/nginx/ssl/sslcert.key \
        -subj "/C=CA/ST=Quebec/L=42Quebec/O=42School/OU=42Quebec/CN=trans.42.fr"
         

# Start NGINX in the foreground
CMD ["nginx", "-g", "daemon off;"]