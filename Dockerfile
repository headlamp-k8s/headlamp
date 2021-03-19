ARG IMAGE_BASE=alpine:3.11.3
FROM $IMAGE_BASE as base-build

ENV GOPATH=/go \
    GOPROXY=https://proxy.golang.org \
		GO111MODULE=on

RUN apk update && \
	apk add git nodejs npm go ca-certificates make musl-dev bash

COPY ./ /headlamp/

WORKDIR /headlamp

RUN cd ./backend && go build -o ./server ./cmd/

RUN cd ./frontend && npm install && npm run build

# Backwards compatibility, move plugin folder to only copy matching plugins.
RUN mv plugins plugins-old

RUN mkdir -p ./plugins

# Backwards compatibility, copy any matching plugins found inside "./plugins-old" into "./plugins".
# They should match plugins-old/MyFolder/main.js, otherwise they are not copied.
RUN find plugins-old -mindepth 2 -maxdepth 2 -type f  | grep -i main.js$ | xargs -i dirname {} | xargs -i cp -a {} ./plugins/

RUN find .plugins -mindepth 2 -maxdepth 2 -type f  | grep -i main.js$ | xargs -i dirname {} | xargs -i cp -a {} ./plugins/

FROM $IMAGE_BASE

COPY --from=base-build /headlamp/backend/server /headlamp/server
COPY --from=base-build /headlamp/frontend/build /headlamp/frontend
COPY --from=base-build /headlamp/plugins /headlamp/plugins

EXPOSE 4466
ENTRYPOINT ["/headlamp/server", "-html-static-dir", "/headlamp/frontend"]
