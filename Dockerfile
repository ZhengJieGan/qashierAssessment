# Use an official Node.js runtime as a parent image
FROM node:16-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages
RUN npm install

# Expose port 3000 for the app to listen on
EXPOSE 3000

# Run the command to start the app
CMD ["npm", "start"]
