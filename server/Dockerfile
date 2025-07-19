# Use Node.js LTS version image
FROM node:18

# Set the working directory in container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all backend files
COPY . .

# Expose the port your Express server runs on (adjust if needed)
EXPOSE 5000

# Command to run your app
CMD ["npm", "start"]
