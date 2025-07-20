FROM node:18-slim

WORKDIR /app

# We'll mount the project root, so we can access everything
# No need to copy files since we're using volumes

# Install dependencies when container starts  
CMD ["sh", "-c", "npm install && node services/payouts-service/payouts.service.js"]