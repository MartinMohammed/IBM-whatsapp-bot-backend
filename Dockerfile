# Use the Node.js 16-alpine base image
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json file to the working directory
COPY ./package.json .

# Install the dependencies
RUN npm install

# Copy all remaining files to the working directory
COPY ./ .

# Create a new user inside the container
RUN addgroup -S myuser && adduser -S -G myuser myuser

# Set the ownership of the working directory to the new user
RUN chown -R myuser:myuser /app

# Switch to the new user
USER myuser

# Set the command to build and start the application in development mode
CMD npm run start