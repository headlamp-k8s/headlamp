FROM ghcr.io/kinvolk/headlamp:v0.12.1 as headlamp

FROM scratch 

LABEL org.opencontainers.image.title="Headlamp" \
    org.opencontainers.image.description="An easy-to-use and extensible web UI for Kubernetes." \
    org.opencontainers.image.vendor="kinvolk" \
    com.docker.desktop.extension.api.version=">= 0.2.0" \
    com.docker.desktop.extension.icon="https://raw.githubusercontent.com/kinvolk/headlamp/main/frontend/public/apple-touch-icon.png" \
    com.docker.extension.additional-urls=[{"title":"Repository","url":"https://github.com/kinvolk/headlamp"},{"title":"Documentation","url":"https://kinvolk.github.io/headlamp/docs/latest/"}]

COPY headlamp.svg .
COPY metadata.json .
COPY docker-compose.yml .

COPY --from=headlamp /headlamp/frontend /ui
