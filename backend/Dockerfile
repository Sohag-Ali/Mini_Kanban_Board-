FROM node:20-alpine

# Install OpenSSL for Prisma 7 engine compatibility on Alpine
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package definitions and install dependencies
COPY package*.json ./
RUN npm ci

# Copy TypeScript configuration, Prisma configuration, and schema
COPY tsconfig.json prisma.config.ts ./
COPY prisma ./prisma
COPY src ./src

# Set dummy DATABASE_URL for build-time schema generation (overridden at runtime)
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"

# Ensure output directory parent path exists for Prisma 7 generator
RUN mkdir -p src/generated

# Generate Prisma Client for Prisma 7
RUN npx prisma generate

# Build TypeScript code
RUN npm run build

# Expose application port
EXPOSE 5000

# Default environment setup
ENV NODE_ENV=production
ENV PORT=5000

# Run production server
CMD ["npm", "run", "start"]
