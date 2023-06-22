package cache

import (
	"context"
	"errors"
	"sync"
	"time"
)

// Cache is an interface for a cache
// that can be used to store and retrieve values.
type Cache interface {
	Set(ctx context.Context, key string, value interface{}) error
	SetWithTTL(ctx context.Context, key string, value interface{}, ttl time.Duration) error
	Delete(ctx context.Context, key string) error
	Get(ctx context.Context, key string) (interface{}, error)
}

var (
	ErrNotFound     = errors.New("key not found")
	cleanUpInterval = 10 * time.Second
)

type cacheValue struct {
	value     interface{}
	expiresAt time.Time
}
type cache struct {
	store           map[string]cacheValue
	lock            sync.RWMutex
	cleanUpInterval time.Duration
}

// New creates a new cache.
func New() Cache {
	cache := &cache{
		store:           make(map[string]cacheValue),
		cleanUpInterval: cleanUpInterval,
	}

	go cache.cleanUp()

	return cache
}

// Set stores a value in the cache.
func (c *cache) Set(ctx context.Context, key string, value interface{}) error {
	return c.SetWithTTL(ctx, key, value, 0)
}

// SetWithTTL stores a value in the cache with a TTL.
func (c *cache) SetWithTTL(ctx context.Context, key string, value interface{}, ttl time.Duration) error {
	c.lock.Lock()
	defer c.lock.Unlock()

	expiresAt := time.Time{}
	if ttl != 0 {
		expiresAt = time.Now().Add(ttl)
	}

	c.store[key] = cacheValue{
		value:     value,
		expiresAt: expiresAt,
	}

	return nil
}

// Delete removes a value from the cache.
func (c *cache) Delete(ctx context.Context, key string) error {
	c.lock.Lock()
	defer c.lock.Unlock()

	delete(c.store, key)

	return nil
}

// Get retrieves a value from the cache.
func (c *cache) Get(ctx context.Context, key string) (interface{}, error) {
	c.lock.RLock()
	defer c.lock.RUnlock()

	value, ok := c.store[key]
	if !ok {
		return nil, ErrNotFound
	}

	if value.expiresAt.IsZero() || value.expiresAt.After(time.Now()) {
		return value.value, nil
	}

	return nil, ErrNotFound
}

// cleanUp removes expired values from the cache.
func (c *cache) cleanUp() {
	ticker := time.NewTicker(c.cleanUpInterval)
	defer ticker.Stop()

	for {
		<-ticker.C

		for key, value := range c.store {
			if !value.expiresAt.IsZero() && value.expiresAt.Before(time.Now()) {
				c.lock.Lock()
				delete(c.store, key)
				c.lock.Unlock()
			}
		}
	}
}
