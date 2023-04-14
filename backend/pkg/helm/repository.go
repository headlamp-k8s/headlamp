package helm

import (
	"encoding/json"
	"net/http"
	"os"
	"path/filepath"

	zlog "github.com/rs/zerolog/log"
	"helm.sh/helm/v3/pkg/getter"
	"helm.sh/helm/v3/pkg/repo"
)

const (
	defaultNewConfigFileMode   os.FileMode = os.FileMode(0644)
	defaultNewConfigFolderMode os.FileMode = os.FileMode(0770)
)

// add repository

type AddUpdateRepoRequest struct {
	Name string `json:"name"`
	URL  string `json:"url"`
	// TODO: Figure out how to support auth
	// like username, password, certfile etc
	// https://github.com/helm/helm/blob/39ca699ca790e02ba36753dec6ba4177cc68d417/cmd/helm/repo_add.go#L169
}

// Creates a filename if it's not there, including any missing directories.
func createFileIfNotThere(fileName string) error {
	_, err := os.Stat(fileName)
	if os.IsNotExist(err) {
		// create changes
		_, err = createFullPath(fileName)
		return err
	}

	return nil
}

// Adds a repository with name, url to the helm config. Returns error if there is one.
func AddRepositoryToHelm(name string, url string) error {
	err := createFileIfNotThere(settings.RepositoryConfig)
	if err != nil {
		zlog.Error().Err(err).Str("action", "add_repo").Msg("failed to create empty RepositoryConfig file")
	}

	// TODO: Lock repo file

	// read repo file
	repoFile, err := repo.LoadFile(settings.RepositoryConfig)
	if err != nil {
		zlog.Error().Err(err).Str("action", "add_repo").Msg("failed to read repo file")
		return err
	}

	// add repo
	newRepo := &repo.Entry{
		Name: name,
		URL:  url,
	}

	repo, err := repo.NewChartRepository(newRepo, getter.All(settings))
	if err != nil {
		zlog.Error().Err(err).Str("action", "add_repo").Msg("failed to create chart repository")
		return err
	}

	// download chart repo index
	_, err = repo.DownloadIndexFile()
	if err != nil {
		zlog.Error().Err(err).Str("action", "add_repo").Msg("failed to download index file")
		return err
	}

	// write repo file
	repoFile.Update(newRepo)

	err = repoFile.WriteFile(settings.RepositoryConfig, defaultNewConfigFileMode)
	if err != nil {
		zlog.Error().Err(err).Str("action", "add_repo").Msg("failed to write repo file")
		return err
	}

	return nil
}

func (h *Handler) AddRepo(w http.ResponseWriter, r *http.Request) {
	// parse request
	var request AddUpdateRepoRequest

	err := json.NewDecoder(r.Body).Decode(&request)
	if err != nil {
		zlog.Error().Err(err).Str("action", "add_repo").Msg("failed to parse request")
		http.Error(w, err.Error(), http.StatusBadRequest)

		return
	}

	err = AddRepositoryToHelm(request.Name, request.URL)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// respond
	response := map[string]string{
		"message": "success",
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	err = json.NewEncoder(w).Encode(response)
	if err != nil {
		zlog.Error().Err(err).Str("action", "add_repo").Msg("failed to encode response")
		http.Error(w, err.Error(), http.StatusInternalServerError)

		return
	}
}

// List repository.
type repositoryInfo struct {
	Name string `json:"name"`
	URL  string `json:"url"`
}
type ListRepoResponse struct {
	Repositories []repositoryInfo `json:"repositories"`
}

// Create a full path, including directories if it does not exist.
func createFullPath(p string) (*os.File, error) {
	if err := os.MkdirAll(filepath.Dir(p), defaultNewConfigFolderMode); err != nil {
		return nil, err
	}

	return os.Create(p)
}

func (h *Handler) ListRepo(w http.ResponseWriter, r *http.Request) {
	err := createFileIfNotThere(settings.RepositoryConfig)
	if err != nil {
		zlog.Error().Err(err).Str("action", "list_repo").Msg("failed to create empty RepositoryConfig file")
	}

	// read repo file
	repoFile, err := repo.LoadFile(settings.RepositoryConfig)
	if err != nil {
		zlog.Error().Err(err).Str("action", "list_repo").Msg("failed to read repo file")
		http.Error(w, err.Error(), http.StatusInternalServerError)

		return
	}

	// response
	repositories := make([]repositoryInfo, 0, len(repoFile.Repositories))

	for _, repo := range repoFile.Repositories {
		repo := repo

		repositories = append(repositories, repositoryInfo{
			Name: repo.Name,
			URL:  repo.URL,
		})
	}

	response := ListRepoResponse{
		Repositories: repositories,
	}

	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")

	err = json.NewEncoder(w).Encode(response)
	if err != nil {
		zlog.Error().Err(err).Str("action", "list_repo").Msg("failed to encode response")
		http.Error(w, err.Error(), http.StatusInternalServerError)

		return
	}
}

// Remove repository name.
func (h *Handler) RemoveRepo(w http.ResponseWriter, r *http.Request) {
	err := createFileIfNotThere(settings.RepositoryConfig)
	if err != nil {
		zlog.Error().Err(err).Str("action", "remove_repo").Msg("failed to create empty RepositoryConfig file")
	}

	name := r.URL.Query().Get("name")

	repoFile, err := repo.LoadFile(settings.RepositoryConfig)
	if err != nil {
		zlog.Error().Err(err).Str("action", "remove_repo").Msg("failed to read repo file")
		http.Error(w, err.Error(), http.StatusInternalServerError)

		return
	}

	isRemoved := repoFile.Remove(name)
	if !isRemoved {
		zlog.Error().Err(err).Str("action", "remove_repo").Msg("repository not found")
		http.Error(w, "repository not found", http.StatusNotFound)

		return
	}

	// write repo file
	err = repoFile.WriteFile(settings.RepositoryConfig, defaultNewConfigFileMode)
	if err != nil {
		zlog.Error().Err(err).Str("action", "remove_repo").Msg("failed to write repo file")
		http.Error(w, err.Error(), http.StatusInternalServerError)

		return
	}

	w.WriteHeader(http.StatusOK)
}

// Update repository name.
func (h *Handler) UpdateRepository(w http.ResponseWriter, r *http.Request) {
	err := createFileIfNotThere(settings.RepositoryConfig)
	if err != nil {
		zlog.Error().Err(err).Str("action", "update_repository").Msg("failed to create empty RepositoryConfig file")
	}

	// parse request
	var request AddUpdateRepoRequest

	err = json.NewDecoder(r.Body).Decode(&request)
	if err != nil {
		zlog.Error().Err(err).Str("action", "update_repository").Msg("failed to parse request")
		http.Error(w, err.Error(), http.StatusBadRequest)

		return
	}

	repoFile, err := repo.LoadFile(settings.RepositoryConfig)
	if err != nil {
		zlog.Error().Err(err).Str("action", "update_repository").Msg("failed to read repo file")
		http.Error(w, err.Error(), http.StatusInternalServerError)

		return
	}

	repoFile.Update(&repo.Entry{
		Name: request.Name,
		URL:  request.URL,
	})

	err = repoFile.WriteFile(settings.RepositoryConfig, defaultNewConfigFileMode)
	if err != nil {
		zlog.Error().Err(err).Str("action", "update_repository").Msg("failed to write repo file")
		http.Error(w, err.Error(), http.StatusInternalServerError)

		return
	}

	w.WriteHeader(http.StatusOK)
}
