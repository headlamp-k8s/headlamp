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

FROM $IMAGE_BASE

COPY --from=base-build /headlamp/backend/server /headlamp/server
COPY --from=base-build /headlamp/frontend/build /headlamp/frontend

# Default plugins (may be empty)
COPY --from=base-build /headlamp/backend/plugins /headlamp/plugins

EXPOSE 4654
ENTRYPOINT ["/headlamp/server", "-html-static-dir", "/headlamp/frontend"]
