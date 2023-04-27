//go:build integration
// +build integration

package helm

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestListChart(t *testing.T) {
	// add headlmap repo
	err := AddRepository("headlamp", "https://headlamp-k8s.github.io/headlamp/", settings)
	require.NoError(t, err)

	// list charts without filter term
	charts, err := listCharts("", settings)
	require.NoError(t, err)
	require.NotNil(t, charts)
	require.NotEqual(t, 0, len(charts))

	// list charts with a filter term that doesnt exist
	charts, err = listCharts("non-existing-chart", settings)
	assert.NoError(t, err)
	assert.Equal(t, 0, len(charts))
}
