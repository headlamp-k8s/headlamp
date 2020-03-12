GO111MODULE=on
export GO111MODULE

all: backend frontend

.PHONY: backend
backend:
	go build -o ./backend/server ./backend/server.go

frontend-install:
	cd frontend && npm install

.PHONY: frontend
frontend: frontend-install
	cd frontend && npm run build

run-backend:
	./backend/server -dev

run-frontend:
	cd frontend && npm start
