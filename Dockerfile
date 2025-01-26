# Use the official Node.js 20 image as a base
FROM node:22

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available) to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .
# Ensure swagger.yaml gets copied into the dist directory
COPY ./docs/swagger.yaml /app/dist/docs/swagger.yaml

# Build the application (adjust this based on your build process)
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the application using the built files
CMD ["node", "dist/index.js"]
