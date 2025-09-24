# Use Node.js 18 base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN npm run build

# Use a smaller image for production
FROM node:18-slim

# Set working directory again
WORKDIR /app

# Copy only necessary files from the build stage
COPY --from=0 /app/package*.json ./
COPY --from=0 /app/node_modules ./node_modules
COPY --from=0 /app/dist ./dist

# Set environment variables if needed
ENV NODE_ENV=production

# Start the application
CMD ["node", "dist/index.js"]