# NGINX Capabilities in Action

This project demonstrates various NGINX capabilities with a NodeJS, ExpressJS and TypeScript application.

## Features Demonstrated

1. **Web Server**

   - Serves static content from the `public` directory
   - Handles compression and caching headers

2. **Reverse Proxy**

   - Forwards requests to Node.js backend services
   - Handles WebSocket upgrades

3. **Load Balancer**

   - Distributes traffic across multiple Node.js instances
   - Uses least connections algorithm
   - Includes health checks

4. **API Gateway**

   - Routes different API endpoints
   - Implements rate limiting
   - Handles request/response transformation

5. **Caching Server**

   - Implements both client-side and server-side caching
   - Uses Redis for distributed caching
   - Includes fallback to local cache

6. **SSL/TLS Termination**

   - Handles HTTPS traffic
   - Implements modern SSL configuration
   - Includes HSTS

7. **CDN-like Features**
   - Static file serving with appropriate cache headers
   - Compression for text-based content
   - Cache control headers

<br />

## Security Notes

- Update SSL certificates with your own
- Modify rate limiting rules based on your needs
- Review and adjust cache settings for your use case
- Consider implementing additional security headers

<br />

## SSL/TLS Configuration

For SSL/HTTPS support, you'll need to:

1. Generate SSL certificates
2. Uncomment the SSL volume mount in docker-compose.yml
3. Update the certificate paths in the NGINX configuration

<br />

## Configuration Files

We do need both ` nginx.conf` and `default.conf` files because they serve different purposes:

**1. nginx.conf:**

- This is the main configuration file that sets up global settings
- Defines core behaviors like worker processes, logging, and basic HTTP settings
- Sets up global features like gzip compression and cache paths
- Includes other configuration files

**2. default.conf:**

- This is a virtual host configuration file
- Defines specific server blocks and how to handle different domains/routes
- Contains load balancing configuration
- Sets up SSL/TLS settings
- Configures proxy rules and caching for specific locations

<br />

**The relationship between these files is hierarchical:**

- nginx.conf loads first and sets up the environment
- It then includes all .conf files from /etc/nginx/conf.d/ directory
- default.conf (in the conf.d directory) provides the specific server configurations

<br />

**This separation provides several benefits:**

1. **Modularity:** Easier to manage multiple virtual hosts
2. **Security:** Keeps SSL certificates and sensitive configurations separate
3. **Maintenance:** Can modify virtual host settings without touching global configuration
4. **Scalability:** Can add new virtual hosts by adding new .conf files without modifying nginx.conf
