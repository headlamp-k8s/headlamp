package main

import (
	"github.com/gorilla/websocket"
	"sync"
)

type WSConnLock struct {
	conn *websocket.Conn
	// writeMu is a mutex to synchronize access to the write operations.
	writeMu sync.Mutex
}

func NewWSConnLock(conn *websocket.Conn) *WSConnLock {
	return &WSConnLock{
		conn:    conn,
		writeMu: sync.Mutex{},
	}
}

func (conn *WSConnLock) WriteJSON(v interface{}) error {
	conn.writeMu.Lock()
	defer conn.writeMu.Unlock()
	return conn.conn.WriteJSON(v)
}

func (conn *WSConnLock) ReadJSON(v interface{}) error {
	return conn.conn.ReadJSON(v)
}
