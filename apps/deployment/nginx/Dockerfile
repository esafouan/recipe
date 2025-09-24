FROM nginx:stable-alpine

# Install necessary packages
RUN apk add --no-cache \
    openssl \
    curl \
    tzdata

# Create necessary directories
RUN mkdir -p /etc/nginx/ssl \
    /usr/share/nginx/logs \
    /var/cache/nginx

# Generate self-signed certificates for development
RUN openssl req -x509 -nodes -days 365 -newkey rsa:4096 \
    -keyout /etc/nginx/ssl/recipe-blog.key \
    -out /etc/nginx/ssl/recipe-blog.crt \
    -subj "/C=US/ST=State/L=City/O=Recipe Blog/OU=IT/CN=localhost" \
    -addext "subjectAltName=DNS:localhost,DNS:*.localhost,IP:127.0.0.1"

# Generate DH parameters for better security
RUN openssl dhparam -out /etc/nginx/ssl/dhparam.pem 2048

# Remove default nginx files
RUN rm -rf /usr/share/nginx/html/* \
    /etc/nginx/conf.d/default.conf

# Copy optimized nginx configuration
COPY apps/deployment/nginx/nginx.conf /etc/nginx/nginx.conf
COPY apps/deployment/nginx/security-headers.conf /etc/nginx/conf.d/security-headers.conf

# Set proper permissions
RUN chown -R nginx:nginx /var/cache/nginx \
    && chmod -R 755 /var/cache/nginx

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]