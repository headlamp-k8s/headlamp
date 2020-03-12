GO111MODULE=on
export GO111MODULE

DOCKER_CMD ?= docker
DOCKER_REPO ?= docker.io/joaquim
DOCKER_IMAGE_NAME ?= lokodash
DOCKER_IMAGE_VERSION ?= $(shell git describe --tags --always --dirty)
DOCKER_IMAGE_BASE ?= alpine:3.11.3

all: backend frontend

.PHONY: backend
backend:
	go build -o ./backend/server ./backend/server.go

.PHONY: frontend
frontend:
	pushd frontend; npm install && npm run build; popd;

run-backend:
	./backend/server -dev

run-frontend:
	pushd frontend; npm start; popd;

image:
	$(DOCKER_CMD) build \
	--no-cache \
	--build-arg IMAGE_BASE=$(DOCKER_IMAGE_BASE) \
	-t $(DOCKER_REPO)/$(DOCKER_IMAGE_NAME):$(DOCKER_IMAGE_VERSION) -f \
	Dockerfile
