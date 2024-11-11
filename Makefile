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
EMBED_BINARY_NAME := headlamp_app

# embed build flags
EMBED_BUILD_FLAGS := -trimpath -ldflags="-s -w" -tags embed

ifeq ($(OS), Windows_NT)
	SERVER_EXE_EXT = .exe
endif

ifeq ($(OS), Windows_NT)
	UNIXSHELL = false
	ifdef BASH_VERSION
		UNIXSHELL = true
	endif
	ifdef BASH_VERSION
		UNIXSHELL = true
	endif
else
	UNIXSHELL = true
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


.PHONY: backend-embed
backend-embed: frontend backend-embed-prepare
	cd backend && go build $(EMBED_BUILD_FLAGS) -o ./headlamp-server${SERVER_EXE_EXT} ./cmd

# New multi-platform build targets
.PHONY: backend-embed-all
backend-embed-all: frontend backend-embed-prepare backend-embed-clean
	@echo "Building all platforms with version: $(VERSION)"
	$(MAKE) backend-embed-windows VERSION=$(VERSION)
	$(MAKE) backend-embed-darwin VERSION=$(VERSION)
	$(MAKE) backend-embed-linux VERSION=$(VERSION)
	@echo "All builds completed successfully for version $(VERSION)!"

.PHONY: backend-embed-all-compressed
backend-embed-all-compressed: backend-embed-all
	@echo "Compressing all binaries with version: $(VERSION)..."
	cd backend/dist && for file in *; do \
		if [ -f "$$file" ] && [[ ! "$$file" == *.tar.gz ]]; then \
			tar -czf "$$file.tar.gz" "$$file" && \
			rm "$$file"; \
		fi \
	done
	@echo "✓ All binaries compressed successfully for version $(VERSION)!"

.PHONY: backend-embed-prepare
backend-embed-prepare:
	@echo "Preparing static files for embedding..."
	@if [ -d backend/cmd/static ]; then rm -rf backend/cmd/static; fi
	@mkdir -p backend/cmd/static
ifeq ($(OS),Windows_NT)
	@echo "Copying frontend dist to backend/static..."
	# /E: Copies directories and subdirectories, including empty ones
	# /I: Assumes destination is a directory if copying multiple files
	# /Y: Suppresses prompting to confirm overwriting existing files	
	@xcopy /E /I /Y frontend\build backend\cmd\static
else
	@echo "Copying frontend dist to backend/static..."
	@cp -R frontend/build/* backend/cmd/static/
endif


.PHONY: backend-embed-clean
backend-embed-clean:
	@cd backend && rm -rf dist
	@mkdir -p backend/dist

# Windows builds
.PHONY: backend-embed-windows
backend-embed-windows: 
	@echo "Building all Windows architectures with version $(VERSION)..."
	$(MAKE) backend-embed-windows-arm64 VERSION=$(VERSION)
	$(MAKE) backend-embed-windows-amd64 VERSION=$(VERSION)
	$(MAKE) backend-embed-windows-386 VERSION=$(VERSION)
	@echo "✓ Completed all Windows builds for version $(VERSION)"

backend-embed-windows-arm64:
	@echo "Building for windows/arm64 with version $(VERSION)..."
	cd backend && CGO_ENABLED=0 GOOS=windows GOARCH=arm64 go build $(EMBED_BUILD_FLAGS) -o dist/$(EMBED_BINARY_NAME)_$(VERSION)_windows_arm64.exe ./cmd
	@echo "✓ Built: $(EMBED_BINARY_NAME)_$(VERSION)_windows_arm64.exe"

backend-embed-windows-amd64:
	@echo "Building for windows/amd64 with version $(VERSION)..."
	cd backend && CGO_ENABLED=0 GOOS=windows GOARCH=amd64 go build $(EMBED_BUILD_FLAGS) -o dist/$(EMBED_BINARY_NAME)_$(VERSION)_windows_amd64.exe ./cmd
	@echo "✓ Built: $(EMBED_BINARY_NAME)_$(VERSION)_windows_amd64.exe"

backend-embed-windows-386:
	@echo "Building for windows/386 with version $(VERSION)..."
	cd backend && CGO_ENABLED=0 GOOS=windows GOARCH=386 go build $(EMBED_BUILD_FLAGS) -o dist/$(EMBED_BINARY_NAME)_$(VERSION)_windows_386.exe ./cmd
	@echo "✓ Built: $(EMBED_BINARY_NAME)_$(VERSION)_windows_386.exe"

# macOS(darwin) builds
.PHONY: backend-embed-darwin
backend-embed-darwin:
	@echo "Building all Darwin architectures with version $(VERSION)..."
	$(MAKE) backend-embed-darwin-amd64 VERSION=$(VERSION)
	$(MAKE) backend-embed-darwin-arm64 VERSION=$(VERSION)
	@echo "✓ Completed all Darwin builds for version $(VERSION)"

backend-embed-darwin-amd64:
	@echo "Building for darwin/amd64 with version $(VERSION)..."
	cd backend && CGO_ENABLED=0 GOOS=darwin GOARCH=amd64 go build $(EMBED_BUILD_FLAGS) -o dist/$(EMBED_BINARY_NAME)_$(VERSION)_darwin_amd64 ./cmd
	@echo "✓ Built: $(EMBED_BINARY_NAME)_$(VERSION)_darwin_amd64"

backend-embed-darwin-arm64:
	@echo "Building for darwin/arm64 with version $(VERSION)..."
	cd backend && CGO_ENABLED=0 GOOS=darwin GOARCH=arm64 go build $(EMBED_BUILD_FLAGS) -o dist/$(EMBED_BINARY_NAME)_$(VERSION)_darwin_arm64 ./cmd
	@echo "✓ Built: $(EMBED_BINARY_NAME)_$(VERSION)_darwin_arm64"

# Linux builds
.PHONY: backend-embed-linux
backend-embed-linux:
	@echo "Building all Linux architectures with version $(VERSION)..."
	$(MAKE) backend-embed-linux-amd64 VERSION=$(VERSION)
	$(MAKE) backend-embed-linux-arm64 VERSION=$(VERSION)
	$(MAKE) backend-embed-linux-386 VERSION=$(VERSION)
	@echo "✓ Completed all Linux builds for version $(VERSION)"

backend-embed-linux-amd64:
	@echo "Building for linux/amd64 with version $(VERSION)..."
	cd backend && CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build $(EMBED_BUILD_FLAGS) -o dist/$(EMBED_BINARY_NAME)_$(VERSION)_linux_amd64 ./cmd
	@echo "✓ Built: $(EMBED_BINARY_NAME)_$(VERSION)_linux_amd64"

backend-embed-linux-arm64:
	@echo "Building for linux/arm64 with version $(VERSION)..."
	cd backend && CGO_ENABLED=0 GOOS=linux GOARCH=arm64 go build $(EMBED_BUILD_FLAGS) -o dist/$(EMBED_BINARY_NAME)_$(VERSION)_linux_arm64 ./cmd
	@echo "✓ Built: $(EMBED_BINARY_NAME)_$(VERSION)_linux_arm64"

backend-embed-linux-386:
	@echo "Building for linux/386 with version $(VERSION)..."
	cd backend && CGO_ENABLED=0 GOOS=linux GOARCH=386 go build $(EMBED_BUILD_FLAGS) -o dist/$(EMBED_BINARY_NAME)_$(VERSION)_linux_386 ./cmd
	@echo "✓ Built: $(EMBED_BINARY_NAME)_$(VERSION)_linux_386"

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

ifeq ($(UNIXSHELL),true)
	HEADLAMP_BACKEND_TOKEN=headlamp HEADLAMP_CONFIG_ENABLE_HELM=true HEADLAMP_CONFIG_ENABLE_DYNAMIC_CLUSTERS=true ./backend/headlamp-server -dev -proxy-urls https://artifacthub.io/* -enable-dynamic-clusters
else
	@echo "**** Running on Windows without bash or zsh. ****"
	@cmd /c "set HEADLAMP_BACKEND_TOKEN=headlamp&& set HEADLAMP_CONFIG_ENABLE_HELM=true&& set HEADLAMP_CONFIG_ENABLE_DYNAMIC_CLUSTERS=true&& backend\headlamp-server -dev -proxy-urls https://artifacthub.io/*" -enable-dynamic-clusters
endif

run-frontend:
ifeq ($(UNIXSHELL),true)
	cd frontend && nice -16 npm start
else
	cd frontend && npm start
endif

frontend-lint:
	cd frontend && npm run lint -- --max-warnings 0 && npm run format-check

frontend-fixlint:
	cd frontend && npm run lint -- --fix && npm run format

.PHONY: frontend-tsc
frontend-tsc:
	cd frontend && npm run tsc

.PHONY: frontend-i18n-check
frontend-i18n-check:
	@echo "Checking translations. If this fails use: 'npm run i18n'"
	cd frontend && npm run i18n -- --fail-on-update

frontend-test:
	cd frontend && npm run test -- --coverage

plugins-test:
	cd plugins/headlamp-plugin && npm install && ./test-headlamp-plugin.js
	cd plugins/headlamp-plugin && ./test-plugins-examples.sh
	cd plugins/headlamp-plugin/plugin-management && node ./plugin-management.e2e.js
	cd plugins/headlamp-plugin/plugin-management && npx jest ./plugin-management.test.js

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

.PHONY: helm-template-test
helm-template-test:
	charts/headlamp/tests/test.sh