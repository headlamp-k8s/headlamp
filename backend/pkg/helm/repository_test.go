//go:build integration
// +build integration

package helm

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func checkRepoExists(t *testing.T, repoName string) bool {
	t.Helper()

	repos, err := listRepositories(settings)
	require.NoError(t, err)

	for _, repo := range repos {
		repo := repo
		if repo.Name == repoName {
			return true
		}
	}

	return false
}

// TestAddRepositoryToHelm.
func TestAddRepository(t *testing.T) {
	// valid repository
	err := AddRepository("headlamp_test_repo", "https://headlamp-k8s.github.io/headlamp/", settings)
	require.NoError(t, err)

	// check if repository exists in list
	require.True(t, checkRepoExists(t, "headlamp_test_repo"))

	// invalid repository
	err = AddRepository("headlamp_test_repo", "https://headlamp-k8s-invalid-url.github.io/headlamp", settings)
	require.Error(t, err)
}

// TestRemoveRepository.
func TestRemoveRepository(t *testing.T) {
	// add repository
	err := AddRepository("headlamp_test_repo", "https://headlamp-k8s.github.io/headlamp/", settings)
	require.NoError(t, err)

	// check if repository exists in list
	require.True(t, checkRepoExists(t, "headlamp_test_repo"))

	// remove repository
	err = RemoveRepository("headlamp_test_repo", settings)
	require.NoError(t, err)

	// check if repository exists in list
	require.False(t, checkRepoExists(t, "headlamp_test_repo"))
}

// TestUpdateRepository.
func TestUpdateRepository(t *testing.T) {
	// add repository
	err := AddRepository("headlamp_test_repo", "https://headlamp-k8s.github.io/headlamp/", settings)
	require.NoError(t, err)

	// check if repository exists in list
	require.True(t, checkRepoExists(t, "headlamp_test_repo"))

	// update repository
	err = UpdateRepository("headlamp_test_repo",
		"https://headlamp-k8s-update-url.github.io/headlamp/", settings)
	require.NoError(t, err)

	// check if repo url is updated
	repos, err := listRepositories(settings)
	require.NoError(t, err)

	for _, repo := range repos {
		repo := repo
		if repo.Name == "headlamp_test_repo" {
			require.Equal(t, "https://headlamp-k8s-update-url.github.io/headlamp/", repo.URL)
		}
	}
}

// TestListRepositories.
func TestListRepositories(t *testing.T) {
	// add repository
	err := AddRepository("headlamp_test_repo", "https://headlamp-k8s.github.io/headlamp/", settings)
	require.NoError(t, err)

	// check if repository exists in list
	assert.True(t, checkRepoExists(t, "headlamp_test_repo"))

	// list repositories
	repos, err := listRepositories(settings)
	assert.NoError(t, err)
	assert.NotNil(t, repos)
	assert.NotEqual(t, 0, len(repos))

	// check for random repo
	assert.False(t, checkRepoExists(t, "random_repo"))
}
