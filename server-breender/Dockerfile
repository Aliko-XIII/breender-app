# This Dockerfile allows to build a Docker image of the NestJS application
# and based on a NodeJS 20 image. 

#Create image based uses a lightweight Node.js image
FROM node:20-alpine as build

# Set the working directory 
WORKDIR /app

# Copy dependency definitions (package.json and package-lock.json)
COPY package*.json ./

# Install production dependencies (excluding dev dependencies)
# RUN npm install --only=production

# Install dependencies 
RUN npm install 

# Get all the code needed to run the app
COPY . .

# Build the Nest.js application
RUN npm run build

FROM node:20-alpine as prod

# Set environment variables
# ENV MONGO_USERNAME=nodejsteam5 \
#     MONGO_PASSWORD=nodejsteam5 \
#     MONGO_DB=aliasChat3 \
#     APP_PORT=8080 \
#     NODE_ENV=development

COPY --from=build /app/dist ./app/dist
COPY --from=build /app/node_modules ./app/node_modules
# COPY .env ./app/.env

# Expose the port the app runs in
EXPOSE 8080

# Start the application (for development environment)
# CMD ["npm", "run", "start:prod"]

# Start the application (for production-ready application)
CMD ["node", "app/dist/main.js"]