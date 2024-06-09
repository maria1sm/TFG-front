# Use Node.js image as base image
FROM node:16-alpine as builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files from the current directory to the container
COPY . .

ARG REACT_APP_CALLBACK
ARG REACT_APP_CLIENT_ID

ENV REACT_APP_CALLBACK $REACT_APP_CALLBACK
ENV REACT_APP_CLIENT_ID $REACT_APP_CLIENT_ID

# Build the React app
RUN npm run build

# Use NGINX as the base image for serving the static files
FROM nginx:alpine

# Copy the built files from the previous stage to NGINX directory
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom nginx.conf to container
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start NGINX server
CMD ["nginx", "-g", "daemon off;"]
