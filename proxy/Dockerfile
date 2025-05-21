FROM node:18

# Create and set the working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application code
COPY . .

# Expose the port the app runs on
EXPOSE 8000

# Start the application
CMD ["node", "index.js"]