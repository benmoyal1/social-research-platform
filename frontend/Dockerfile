FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (use legacy-peer-deps for TypeScript 5.x compatibility)
RUN npm install --legacy-peer-deps

# Copy application files
COPY . .

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
