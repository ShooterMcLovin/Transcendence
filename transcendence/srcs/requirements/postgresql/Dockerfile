FROM postgres:16.3

# Copy custom entrypoint script into the container
COPY docker-entrypoint.sh /usr/local/bin/

# Set execute permissions for the entrypoint script
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Specify the custom entrypoint script
ENTRYPOINT ["docker-entrypoint.sh"]

# Default command to run when the container starts (can be overridden)
CMD ["postgres", "-c", "config_file=/etc/postgresql/postgresql.conf"]
