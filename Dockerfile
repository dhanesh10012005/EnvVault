# Use Node.js image
FROM node:22-alpine

# Set working directory
WORKDIR /usr/envvault-client

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the port React dev server runs on
EXPOSE 5173

# Start React in development mode (supports hot reload)
CMD ["npm", "run", "dev"]
