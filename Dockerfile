ARG IMAGE_BASE=alpine:3.11.3
FROM $IMAGE_BASE as base-build

ENV GOPATH=/go \
    GOPROXY=https://proxy.golang.org \
		GO111MODULE=on

RUN apk update && \
	apk add git nodejs npm go ca-certificates make musl-dev bash

COPY ./ /lokodash/

WORKDIR /lokodash

RUN go build -o ./backend/server ./backend/server.go

RUN cd ./frontend && npm run build

FROM $IMAGE_BASE

COPY --from=base-build /lokodash/backend/server /lokodash/server
COPY --from=base-build /lokodash/frontend/build /lokodash/frontend

EXPOSE 4654
ENTRYPOINT ["/lokodash/server", "-html-static-dir", "/lokodash/frontend"]
