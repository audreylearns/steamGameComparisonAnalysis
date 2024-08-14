# Build Stage
FROM node:latest as build-stage

WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files to the working directory
COPY . .

# Build the React application
RUN npm run build

# Expose the port that your Flask app listens on
EXPOSE 3000

# Start the React App
CMD ["npm", "run", "dev"]