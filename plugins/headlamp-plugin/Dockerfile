# syntax=docker/dockerfile:1

FROM --platform=${BUILDPLATFORM} alpine:3.20.6@sha256:de4fe7064d8f98419ea6b49190df1abbf43450c1702eeb864fe9ced453c1cc5f

# Install Node.js using Alpine package manager
RUN apk add --no-cache nodejs npm

WORKDIR /app

COPY package*.json ./
# Install all dependencies including those needed for the CLI
RUN npm ci --omit=dev --no-audit --no-fund \
    && npm cache clean --force
# Copy source files to a single directory
COPY ./bin ./bin/
COPY ./config ./config/
COPY ./plugin-management ./plugin-management/
COPY ./src ./src/

# Set the default command
ENTRYPOINT ["bin/headlamp-plugin.js"]
