package helm

import (
	"encoding/json"
	"log"
	"net/http"

	"helm.sh/helm/v3/pkg/getter"
	"helm.sh/helm/v3/pkg/repo"
)

// add repository

type AddUpdateRepoRequest struct {
	Name string `json:"name"`
	URL  string `json:"url"`
	// TODO: Figure out how to support auth
	// like username, password, certfile etc
	// https://github.com/helm/helm/blob/39ca699ca790e02ba36753dec6ba4177cc68d417/cmd/helm/repo_add.go#L169
}

func (h *HelmHandler) AddRepo(w http.ResponseWriter, r *http.Request) {

	// parse request
	var request AddUpdateRepoRequest
	err := json.NewDecoder(r.Body).Decode(&request)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// TODO: Lock repo file

	// read repo file
	repoFile, err := repo.LoadFile(settings.RepositoryConfig)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// add repo
	newRepo := &repo.Entry{
		Name: request.Name,
		URL:  request.URL,
	}

	repo, err := repo.NewChartRepository(newRepo, getter.All(settings))
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// download chart repo index
	_, err = repo.DownloadIndexFile()
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// write repo file
	repoFile.Update(newRepo)
	err = repoFile.WriteFile(settings.RepositoryConfig, 0644)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

// list repository
type repositoryInfo struct {
	Name string `json:"name"`
	URL  string `json:"url"`
}
type ListRepoResponse struct {
	Repositories []repositoryInfo `json:"repositories"`
}

func (h *HelmHandler) ListRepo(w http.ResponseWriter, r *http.Request) {
	// read repo file
	repoFile, err := repo.LoadFile(settings.RepositoryConfig)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// response
	var repositories []repositoryInfo
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
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

// remove repository
func (h *HelmHandler) RemoveRepo(w http.ResponseWriter, r *http.Request) {

	name := r.URL.Query().Get("name")
	repoFile, err := repo.LoadFile(settings.RepositoryConfig)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	isRemoved := repoFile.Remove(name)
	if !isRemoved {
		log.Println("repository not found")
		http.Error(w, "repository not found", http.StatusNotFound)
		return
	}

	// write repo file
	err = repoFile.WriteFile(settings.RepositoryConfig, 0644)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

// update repository
func (h *HelmHandler) UpdateRepository(w http.ResponseWriter, r *http.Request) {

	// parse request
	var request AddUpdateRepoRequest
	err := json.NewDecoder(r.Body).Decode(&request)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	repoFile, err := repo.LoadFile(settings.RepositoryConfig)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	repoFile.Update(&repo.Entry{
		Name: request.Name,
		URL:  request.URL,
	})

	err = repoFile.WriteFile(settings.RepositoryConfig, 0644)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}
