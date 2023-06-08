package cache_test

import (
	"context"
	"testing"
	"time"

	"github.com/headlamp-k8s/headlamp/backend/pkg/cache"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func testCache(ch cache.Cache[interface{}], t *testing.T) {
	t.Helper()

	// set value
	err := ch.Set(context.Background(), "key1", "value1")
	require.NoError(t, err)

	// get value
	value, err := ch.Get(context.Background(), "key1")
	assert.NoError(t, err)
	assert.Equal(t, "value1", value)

	// get a value that doesn't exists
	value, err = ch.Get(context.Background(), "key2")
	assert.Error(t, err)
	assert.Nil(t, value)

	// delete value
	err = ch.Delete(context.Background(), "key1")
	assert.NoError(t, err)

	// set value with ttl
	err = ch.SetWithTTL(context.Background(), "ttlkey1", "value1", time.Second)
	require.NoError(t, err)

	time.Sleep(3 * time.Second)

	// get value with ttl
	value, err = ch.Get(context.Background(), "ttlkey1")
	assert.Equal(t, cache.ErrNotFound, err)
	assert.Error(t, err)
	assert.Nil(t, value)
}

func TestCache(t *testing.T) {
	// create cache
	ch := cache.New[interface{}]()
	testCache(ch, t)
}
