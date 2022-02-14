ARG IMAGE_BASE=alpine:3.15.0
FROM $IMAGE_BASE as base-build

ENV GOPATH=/go \
    GOPROXY=https://proxy.golang.org \
		GO111MODULE=on

RUN apk update && \
	apk add git nodejs npm go ca-certificates make musl-dev bash icu-data

FROM base-build as backend

COPY ./backend /headlamp/backend

WORKDIR /headlamp

RUN cd ./backend && go build -o ./server ./cmd/

FROM base-build as frontend

COPY ./frontend /headlamp/frontend

WORKDIR /headlamp

RUN cd ./frontend && npm install --only=prod && npm run build

# Backwards compatibility, move plugin folder to only copy matching plugins.
RUN mv plugins plugins-old || true

RUN mkdir -p ./plugins

# Backwards compatibility, copy any matching plugins found inside "./plugins-old" into "./plugins".
# They should match plugins-old/MyFolder/main.js, otherwise they are not copied.
RUN for i in $(find ./plugins-old/*/main.js); do plugin_name=$(echo $i|cut -d'/' -f3); mkdir -p plugins/$plugin_name; cp $i plugins/$plugin_name; done

RUN for i in $(find ./.plugins/*/main.js); do plugin_name=$(echo $i|cut -d'/' -f3); mkdir -p plugins/$plugin_name; cp $i plugins/$plugin_name; done

FROM $IMAGE_BASE

COPY --from=backend /headlamp/backend/server /headlamp/server
COPY --from=frontend /headlamp/frontend/build /headlamp/frontend
COPY --from=frontend /headlamp/plugins /headlamp/plugins

EXPOSE 4466
ENTRYPOINT ["/headlamp/server", "-html-static-dir", "/headlamp/frontend"]
