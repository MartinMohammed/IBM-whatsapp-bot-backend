# Use the Node.js 16-alpine base image
FROM node:16-alpine
ENV NODE_ENV=production

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json file to the working directory
COPY ./package.json .

# Install the dependencies
RUN npm install

# Copy all remaining files to the working directory
COPY ./ .

# Search for and remove all "test" directories within the project.
RUN find /app/dist -type d -name "test" -prune -exec rm -rf {} \;

# Remove the demoData folder 
RUN rm -rf /app/dist/demoData


# Create a new user inside the container
RUN addgroup -S myuser && adduser -S -G myuser myuser

# Set the ownership of the working directory to the new user
RUN chown -R myuser:myuser /app

# Switch to the new user
USER myuser

# Indicate that port 3000 will be opened in this application.
EXPOSE 3000

# Set the command to build and start the application in
CMD [ "npm", "run", "start" ]