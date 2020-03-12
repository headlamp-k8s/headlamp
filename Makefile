GO111MODULE=on
export GO111MODULE

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
