FROM node:20-alpine

WORKDIR /app

# Copy package definitions and install dependencies
COPY package*.json ./
RUN npm ci

# Copy full application code
COPY . .

# Accept API URL build argument for Next.js client bundling
ARG NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Build production Next.js output
RUN npm run build

# Expose Next.js server port
EXPOSE 3000

# Set environment defaults
ENV NODE_ENV=production
ENV PORT=3000

# Start Next.js production server
CMD ["npm", "run", "start"]
