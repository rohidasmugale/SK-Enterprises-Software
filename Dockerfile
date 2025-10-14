# ------------------------------
# Stage 1 — Build React + Vite app
# ------------------------------
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --silent

# Copy all source files
COPY . .

# Build the app for production
RUN npm run build

# ------------------------------
# Stage 2 — Serve with Nginx
# ------------------------------
FROM nginx:stable-alpine

# Remove default Nginx static content
RUN rm -rf /usr/share/nginx/html/*

# Copy built frontend from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 for container
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

