# syntax=docker/dockerfile:1

FROM --platform=${BUILDPLATFORM} node:18@sha256:d0bbfdbad0bff8253e6159dcbee42141db4fc309365d5b8bcfce46ed71569078

WORKDIR /app
# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy only the required source files
COPY bin ./bin
COPY config ./config
COPY plugin-management ./plugin-management
COPY src ./src

# Set the default command
CMD ["bin/headlamp-plugin.js", "install", "--config", "config.yaml", "--folderName", "/plugins-dir"]
