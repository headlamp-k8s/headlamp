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

# Create a plugins folder if none exists so we copy whatever exists to the
# image.
RUN mkdir -p ./plugins

FROM $IMAGE_BASE

COPY --from=base-build /headlamp/backend/server /headlamp/server
COPY --from=base-build /headlamp/frontend/build /headlamp/frontend
COPY --from=base-build /headlamp/plugins /headlamp/plugins

EXPOSE 4466
ENTRYPOINT ["/headlamp/server", "-html-static-dir", "/headlamp/frontend"]
