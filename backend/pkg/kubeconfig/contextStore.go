package kubeconfig

import (
	"context"

	"github.com/headlamp-k8s/headlamp/backend/pkg/cache"
)

// ContextStore is an interface for storing and retrieving contexts.
type ContextStore interface {
	AddContext(headlampContext *Context) error
	GetContexts() ([]*Context, error)
	GetContext(name string) (*Context, error)
	RemoveContext(name string) error
}

type contextStore struct {
	cache cache.Cache[*Context]
}

// NewContextStore creates a new ContextStore.
func NewContextStore() ContextStore {
	cache := cache.New[*Context]()

	return &contextStore{
		cache: cache,
	}
}

// AddContext adds a context to the store.
func (c *contextStore) AddContext(headlampContext *Context) error {
	return c.cache.Set(context.Background(), headlampContext.Name, headlampContext)
}

// GetContexts returns all contexts in the store.
func (c *contextStore) GetContexts() ([]*Context, error) {
	contexts := []*Context{}

	contextMap, err := c.cache.GetAll(context.Background(), nil)
	if err != nil {
		return nil, err
	}

	for _, ctx := range contextMap {
		contexts = append(contexts, ctx)
	}

	return contexts, nil
}

// GetContext returns a context from the store.
func (c *contextStore) GetContext(name string) (*Context, error) {
	context, err := c.cache.Get(context.Background(), name)
	if err != nil {
		return nil, err
	}

	return context, nil
}

// RemoveContext removes a context from the store.
func (c *contextStore) RemoveContext(name string) error {
	return c.cache.Delete(context.Background(), name)
}
