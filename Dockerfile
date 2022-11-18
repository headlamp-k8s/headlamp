ARG IMAGE_BASE=alpine:3.15.6
FROM $IMAGE_BASE as base-build

RUN apk update && \
	apk add git nodejs npm go ca-certificates make musl-dev bash icu-data

FROM golang:1.19 as backend-build

ENV GOPATH=/go \
    GOPROXY=https://proxy.golang.org \
	GO111MODULE=on\
	CGO_ENABLED=0\ 
	GOOS=linux 

COPY ./backend /headlamp/backend

WORKDIR /headlamp

RUN cd ./backend && go build -o ./headlamp-server ./cmd/

# Keep npm install separated so source changes don't trigger install
FROM base-build as frontend-build

# We need .git and app/ in order to get the version and git version for the frontend/.env file
# that's generated when building the frontend.
COPY ./.git /headlamp/.git
COPY app/package.json /headlamp/app/package.json

COPY frontend/package*.json /headlamp/frontend/
COPY frontend/patches/* /headlamp/frontend/patches/
WORKDIR /headlamp
RUN cd ./frontend && npm install --only=prod

FROM frontend-build as frontend
COPY ./frontend /headlamp/frontend

WORKDIR /headlamp

RUN cd ./frontend && npm run build

RUN echo "*** Built Headlamp with version: ***"
RUN cat ./frontend/.env

# Backwards compatibility, move plugin folder to only copy matching plugins.
RUN mv plugins plugins-old || true

RUN mkdir -p ./plugins

# Backwards compatibility, copy any matching plugins found inside "./plugins-old" into "./plugins".
# They should match plugins-old/MyFolder/main.js, otherwise they are not copied.
RUN for i in $(find ./plugins-old/*/main.js); do plugin_name=$(echo $i|cut -d'/' -f3); mkdir -p plugins/$plugin_name; cp $i plugins/$plugin_name; done

RUN for i in $(find ./.plugins/*/main.js); do plugin_name=$(echo $i|cut -d'/' -f3); mkdir -p plugins/$plugin_name; cp $i plugins/$plugin_name; done

# Final container image
FROM $IMAGE_BASE

COPY --from=backend-build /headlamp/backend/headlamp-server /headlamp/headlamp-server
COPY --from=frontend /headlamp/frontend/build /headlamp/frontend
COPY --from=frontend /headlamp/plugins /headlamp/plugins
# Create a symlink so we support any attempts to run "/headlamp/server", from before we
# renamed it as "headlamp-server".
RUN cd /headlamp && ln -s ./headlamp-server ./server

EXPOSE 4466
ENTRYPOINT ["/headlamp/headlamp-server", "-html-static-dir", "/headlamp/frontend"]
