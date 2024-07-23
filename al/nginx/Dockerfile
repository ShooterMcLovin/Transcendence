# Use the official Nginx image from Docker Hub
FROM nginx:latest

# (Optional) Copy custom configuration files
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80 (HTTP) and 443 (HTTPS)
EXPOSE 80
EXPOSE 443

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]