# Use the Node.js 16-alpine base image
FROM node:20-alpine3.17 AS builder

# Set the working directory inside the container
WORKDIR /app

# Make sure a dir is created for logs
RUN mkdir logs

# Copy the package.json and package-lock.json files to the working directory
COPY package.json package-lock.json ./

# Update npm && Install all dependencies
RUN npm ci

# Copy all remaining files to the working directory
COPY . .

# Build the project and run tests
RUN npm run build && npm run minify

# Second stage for the final image
FROM node:20-alpine3.17

# Set the working directory inside the container
WORKDIR /app

# Copy the built project from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

# Create a new user inside the container
RUN addgroup -S myuser && adduser -S -G myuser myuser
# Set the environment to production.
ENV NODE_ENV="production"

# # Search for and remove all "test" directories within the project.
# RUN find /app/dist -type d -name "test" -prune -exec rm -rf {} \;

# Remove testing utilities
RUN rm -rf /app/dist/testing

# Remove tsconfig.tsbuildinfo - for incremental compliation in ts.
RUN rm -rf /app/dist/tsconfig.tsbuildinfo

# Set the ownership of the working directory to the new user
RUN chown -R myuser:myuser /app

# Switch to the new user
USER myuser

# Install only production dependencies
RUN npm ci --omit=dev

# Indicate that port 3000 will be opened in this application
EXPOSE 3000

# Set the command to build and start the application
CMD [ "npm", "start" ]
