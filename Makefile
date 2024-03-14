GO111MODULE=on
export GO111MODULE

SERVER_EXE_EXT ?=
DOCKER_CMD ?= docker
DOCKER_REPO ?= ghcr.io/headlamp-k8s
DOCKER_EXT_REPO ?= docker.io/headlamp
DOCKER_IMAGE_NAME ?= headlamp
DOCKER_PLUGINS_IMAGE_NAME ?= plugins
DOCKER_IMAGE_VERSION ?= $(shell git describe --tags --always --dirty)
DOCKER_PLATFORM ?= local

ifeq ($(OS), Windows_NT)
	SERVER_EXE_EXT = .exe
endif
all: backend frontend

tools/golangci-lint: backend/go.mod backend/go.sum
	GOBIN=`pwd`/backend/tools go install github.com/golangci/golangci-lint/cmd/golangci-lint@v1.54

backend-lint: tools/golangci-lint
	cd backend && ./tools/golangci-lint run

frontend/build:
	make frontend

.PHONY: app
app-build: frontend/build
	cd app && npm install && node ./scripts/setup-plugins.js && npm run build
app: app-build
	cd app && npm run package -- --win --linux --mac
app-win: app-build
	cd app && npm run package -- --win
app-win-msi: app-build
	cd app && npm run package-msi
app-linux: app-build
	cd app && npm run package -- --linux
app-mac: app-build
	cd app && npm run package -- --mac

.PHONY: backend
backend:
	cd backend && go build -o ./headlamp-server${SERVER_EXE_EXT} ./cmd

.PHONY: backend-test
backend-test:
	cd backend && go test -v -p 1 ./...

.PHONY: backend-format
backend-format:
	cd backend && go fmt ./cmd/ ./pkg/**

frontend-install:
	cd frontend && npm install

frontend-install-ci:
	cd frontend && npm ci

.PHONY: frontend
frontend: frontend-install
	cd frontend && npm run build

.PHONY: frontend-build
frontend-build:
	cd frontend && npm run build

.PHONY: frontend-build-storybook
frontend-build-storybook:
	cd frontend && npm run build-storybook

run-backend:
	@echo "**** Warning: Running with Helm and dynamic-clusters endpoints enabled. ****"
	@echo
	HEADLAMP_BACKEND_TOKEN=headlamp HEADLAMP_CONFIG_ENABLE_HELM=true HEADLAMP_CONFIG_ENABLE_DYNAMIC_CLUSTERS=true ./backend/headlamp-server -dev

run-frontend:
	cd frontend && REACT_APP_HEADLAMP_BACKEND_TOKEN=headlamp npm start

frontend-lint:
	cd frontend && npm run lint -- --max-warnings 0 && npm run format-check

frontend-fixlint:
	cd frontend && npm run lint -- --fix && npm run format

.PHONY: frontend-tsc
frontend-tsc:
	cd frontend && npm run tsc

frontend-test:
	cd frontend && npm run test -- --coverage

plugins-test:
	cd plugins/headlamp-plugin && npm install && ./test-headlamp-plugin.js
	cd plugins/headlamp-plugin && ./test-plugins-examples.sh

# IMAGE_BASE can be used to specify a base final image.
#   IMAGE_BASE=debian:latest make image
image:
	@if [ -n "${IMAGE_BASE}" ]; then \
		BUILD_ARG="--build-arg IMAGE_BASE=${IMAGE_BASE}"; \
	else \
		BUILD_ARG=""; \
	fi; \
	$(DOCKER_CMD) buildx build \
	--pull \
	--platform=$(DOCKER_PLATFORM) \
	$$BUILD_ARG \
	-t $(DOCKER_REPO)/$(DOCKER_IMAGE_NAME):$(DOCKER_IMAGE_VERSION) -f \
	Dockerfile \
	.

.PHONY: build-plugins-container
build-plugins-container:
	$(DOCKER_CMD) buildx build \
	--pull \
	--platform=linux/amd64 \
	-t $(DOCKER_REPO)/$(DOCKER_PLUGINS_IMAGE_NAME):$(DOCKER_IMAGE_VERSION) -f \
	Dockerfile.plugins \
	.

docker-ext:
	$(eval LATEST_TAG=$(shell git tag --list --sort=version:refname 'v*' | tail -1 | sed 's/^.//'))
	$(DOCKER_CMD) buildx build \
	--platform=linux/amd64,linux/arm64 \
	--push \
	-t $(DOCKER_EXT_REPO)/$(DOCKER_IMAGE_NAME)-docker-extension:${LATEST_TAG} \
	-t $(DOCKER_EXT_REPO)/$(DOCKER_IMAGE_NAME)-docker-extension:latest -f \
	./docker-extension/Dockerfile \
	./docker-extension

.PHONY: docs
docs:
	cd frontend && npm install && npm run build-typedoc

.PHONY: storybook
storybook:
	cd frontend && npm install && npm run storybook

i18n:
	cd app && npm run i18n
	cd frontend && npm run i18n
