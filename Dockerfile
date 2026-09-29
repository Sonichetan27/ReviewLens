# Multi-stage build for production deployment
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy server files
COPY server/ ./server/

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy dependencies and server files from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/server ./server

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "server/server.js"]