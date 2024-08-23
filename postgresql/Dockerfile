# Use the official PostgreSQL image
FROM postgres:15

# Install gosu
RUN apt-get update && apt-get install -y \
    gosu 

RUN mkdir -p /var/lib/postgresql/data && \
chmod 0750 /var/lib/postgresql/data  && \
chown -R postgres:postgres /var/lib/postgresql


# Copy setup script and make it executable
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Set entrypoint and default command
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["postgres"]
