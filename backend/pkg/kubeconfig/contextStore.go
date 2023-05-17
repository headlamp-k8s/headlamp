package kubeconfig

import (
	"errors"
	"sync"
)

var ErrNotFound = errors.New("not found")

type ContextStore interface {
	AddContext(headlampContext *Context) error
	GetContexts() ([]*Context, error)
	GetContext(name string) (*Context, error)
	RemoveContext(name string) error
}

type contextStore struct {
	store map[string]*Context
	lock  sync.Mutex
}

func NewContextStore() ContextStore {
	return &contextStore{
		store: make(map[string]*Context),
	}
}

func (c *contextStore) AddContext(headlampContext *Context) error {
	// lock the store
	c.lock.Lock()
	defer c.lock.Unlock()

	c.store[headlampContext.Name] = headlampContext
	return nil
}

func (c *contextStore) GetContexts() ([]*Context, error) {
	var contexts []*Context
	for _, context := range c.store {
		context := context
		contexts = append(contexts, context)
	}
	return contexts, nil
}

func (c *contextStore) GetContext(name string) (*Context, error) {
	context, ok := c.store[name]
	if !ok {
		return nil, ErrNotFound
	}

	return context, nil
}

func (c *contextStore) RemoveContext(name string) error {
	// lock the store
	c.lock.Lock()
	defer c.lock.Unlock()

	delete(c.store, name)
	return nil
}
