# Use Node.js for building
FROM node:20.12

WORKDIR /app


RUN pwd
RUN ls

# RUN npm install -g pnpm
# Copy package.json and install dependencies
COPY ./package.json ./
RUN cat package.json
# COPY ./pnpm-lock.yaml ./
RUN pnpm install

# Copy the rest of the files
WORKDIR /app
COPY . .

# Build the app using passed environment variables
ARG VITE_API_URL 
ARG VITE_APP_TYPE
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_APP_TYPE=$VITE_APP_TYPE


RUN pnpm run build

# Expose port 4173
EXPOSE 4173

# Start Nginx
CMD ["pnpm", "run", "preview", "--", "--host"]
