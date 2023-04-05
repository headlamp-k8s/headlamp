package helm

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/gorilla/schema"
	"gopkg.in/yaml.v2"
	"helm.sh/helm/v3/pkg/action"
	"helm.sh/helm/v3/pkg/chart/loader"
	"helm.sh/helm/v3/pkg/downloader"
	"helm.sh/helm/v3/pkg/getter"
	"helm.sh/helm/v3/pkg/release"
	"helm.sh/helm/v3/pkg/storage/driver"
)

type ListReleaseRequest struct {
	AllNamespaces *bool   `json:"allNamespaces,omitempty"`
	Namespace     *string `json:"namespace,omitempty"`
	All           *bool   `json:"all,omitempty"`
	ByDate        *bool   `json:"byDate,omitempty"`
	Limit         *int    `json:"limit,omitempty"`
	Offset        *int    `json:"offset,omitempty"`
	Filter        *string `json:"filter,omitempty"`
	Uninstalled   *bool   `json:"uninstalled,omitempty"`
	Superseded    *bool   `json:"superseded,omitempty"`
	Uninstalling  *bool   `json:"uninstalling,omitempty"`
	Deployed      *bool   `json:"deployed,omitempty"`
	Failed        *bool   `json:"failed,omitempty"`
	Pending       *bool   `json:"pending,omitempty"`
}

type ListReleaseResponse struct {
	Releases []*release.Release `json:"releases"`
}

func (h *HelmHandler) ListRelease(w http.ResponseWriter, r *http.Request) {

	// Parse request
	var req ListReleaseRequest

	var decoder = schema.NewDecoder()
	err := decoder.Decode(&req, r.URL.Query())
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Get list client
	listClient := action.NewList(h.Configuration)
	if req.AllNamespaces != nil && *req.AllNamespaces {
		listClient.AllNamespaces = *req.AllNamespaces
	}
	if req.All != nil && *req.All {
		listClient.All = *req.All
	}
	if req.ByDate != nil && *req.ByDate {
		listClient.ByDate = *req.ByDate
	}
	if req.Limit != nil && *req.Limit > 0 {
		listClient.Limit = *req.Limit
	}
	if req.Offset != nil && *req.Offset > 0 {
		listClient.Offset = *req.Offset
	}
	if req.Filter != nil && *req.Filter != "" {
		listClient.Filter = *req.Filter
	}
	if req.Uninstalled != nil && *req.Uninstalled {
		listClient.Uninstalled = *req.Uninstalled
	}
	if req.Superseded != nil && *req.Superseded {
		listClient.Superseded = *req.Superseded
	}
	if req.Uninstalling != nil && *req.Uninstalling {
		listClient.Uninstalling = *req.Uninstalling
	}
	if req.Deployed != nil && *req.Deployed {
		listClient.Deployed = *req.Deployed
	}
	if req.Failed != nil && *req.Failed {
		listClient.Failed = *req.Failed
	}
	if req.Pending != nil && *req.Pending {
		listClient.Pending = *req.Pending
	}
	listClient.Short = true
	listClient.SetStateMask()

	releases, err := listClient.Run()
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Return response
	res := ListReleaseResponse{
		Releases: releases,
	}
	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(res)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

type GetReleaseRequest struct {
	Name      string `json:"name" validate:"required"`
	Namespace string `json:"namespace" validate:"required"`
}

func (h *HelmHandler) GetRelease(w http.ResponseWriter, r *http.Request) {

	// Parse request
	var req GetReleaseRequest
	var decoder = schema.NewDecoder()
	err := decoder.Decode(&req, r.URL.Query())
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	getClient := action.NewGet(h.Configuration)
	result, err := getClient.Run(req.Name)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	err = json.NewEncoder(w).Encode(result)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

type GetReleaseHistoryRequest struct {
	Name      string `json:"name" validate:"required"`
	Namespace string `json:"namespace" validate:"required"`
}

type GetReleaseHistoryResponse struct {
	Releases []*release.Release `json:"releases"`
}

func (h *HelmHandler) GetReleaseHistory(w http.ResponseWriter, r *http.Request) {

	// Parse request
	var req GetReleaseHistoryRequest
	var decoder = schema.NewDecoder()
	err := decoder.Decode(&req, r.URL.Query())
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	getClient := action.NewHistory(h.Configuration)
	result, err := getClient.Run(req.Name)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	resp := GetReleaseHistoryResponse{
		Releases: result,
	}
	err = json.NewEncoder(w).Encode(resp)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

type UninstallReleaseRequest struct {
	Name      string `json:"name"`
	Namespace string `json:"namespace"`
}

func (h *HelmHandler) UninstallRelease(w http.ResponseWriter, r *http.Request) {

	log.Println("uninstall release")
	// Parse request
	var req UninstallReleaseRequest

	var decoder = schema.NewDecoder()
	err := decoder.Decode(&req, r.URL.Query())
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Get uninstall client
	uninstallClient := action.NewUninstall(h.Configuration)
	_, err = uninstallClient.Run(req.Name)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Return response
	w.WriteHeader(http.StatusOK)
}

type RollbackReleaseRequest struct {
	Name      string `json:"name" validate:"required"`
	Namespace string `json:"namespace" validate:"required"`
	Revision  int    `json:"revision" validate:"required"`
}

func (req *RollbackReleaseRequest) Validate() error {
	validate := validator.New()
	return validate.Struct(req)
}

func (h *HelmHandler) RollbackRelease(w http.ResponseWriter, r *http.Request) {

	// Parse request and validate
	var req RollbackReleaseRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	err = req.Validate()
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	rollbackClient := action.NewRollback(h.Configuration)
	rollbackClient.Version = req.Revision

	err = rollbackClient.Run(req.Name)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")

	response := map[string]string{
		"message": "rollback successful",
	}
	err = json.NewEncoder(w).Encode(response)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

type CommonInstallUpdateRequest struct {
	Name        string `json:"name" validate:"required"`
	Namespace   string `json:"namespace" validate:"required"`
	Description string `json:"description" validate:"required"`
	Values      string `json:"values" validate:"required"`
	Chart       string `json:"chart" validate:"required"`
}

type InstallRequest struct {
	CommonInstallUpdateRequest
	CreateNamespace  bool `json:"createNamespace"`
	DependencyUpdate bool `json:"dependencyUpdate"`
}

func (h *HelmHandler) InstallRelease(w http.ResponseWriter, r *http.Request) {

	// parse request
	var req InstallRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Get install client
	installClient := action.NewInstall(h.Configuration)
	installClient.ReleaseName = req.Name
	installClient.Namespace = req.Namespace
	installClient.Description = req.Description
	installClient.CreateNamespace = req.CreateNamespace

	// locate chart
	chartPath, err := installClient.ChartPathOptions.LocateChart(req.Chart, settings)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// load chart
	chart, err := loader.Load(chartPath)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// chart is installable only if it is of type application or empty
	if chart.Metadata.Type != "" && chart.Metadata.Type != "application" {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Update chart dependencies
	if chart.Metadata.Dependencies != nil && req.DependencyUpdate {
		err = action.CheckDependencies(chart, chart.Metadata.Dependencies)
		if err != nil {
			manager := &downloader.Manager{
				ChartPath:        chartPath,
				Keyring:          installClient.ChartPathOptions.Keyring,
				SkipUpdate:       false,
				Getters:          getter.All(settings),
				RepositoryConfig: settings.RepositoryConfig,
				RepositoryCache:  settings.RepositoryCache,
			}
			err = manager.Update()
			if err != nil {
				log.Println(err)
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
		}
	}

	values := make(map[string]interface{})
	valuesStr, err := base64.StdEncoding.DecodeString(req.Values)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	err = yaml.Unmarshal([]byte(valuesStr), &values)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Install chart
	result, err := installClient.Run(chart, values)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	fmt.Println(result)
	// Return response
	w.WriteHeader(http.StatusOK)
}

type UpgradeReleaseRequest struct {
	CommonInstallUpdateRequest
	Install *bool `json:"install"`
}

func (req *UpgradeReleaseRequest) Validate() error {
	validate := validator.New()
	return validate.Struct(req)
}

func (h *HelmHandler) UpgradeRelease(w http.ResponseWriter, r *http.Request) {
	// Parse request and validate
	var req UpgradeReleaseRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	err = req.Validate()
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// check if release exists
	_, err = h.Configuration.Releases.Deployed(req.Name)
	if err == driver.ErrReleaseNotFound {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	// find chart
	upgradeClient := action.NewUpgrade(h.Configuration)

	chartPath, err := upgradeClient.ChartPathOptions.LocateChart(req.Chart, settings)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// load chart
	chart, err := loader.Load(chartPath)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// chart is installable only if it is of type application or empty
	if chart.Metadata.Type != "" && chart.Metadata.Type != "application" {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Update chart dependencies
	if chart.Metadata.Dependencies != nil {
		err = action.CheckDependencies(chart, chart.Metadata.Dependencies)
		if err != nil {
			manager := &downloader.Manager{
				ChartPath:        chartPath,
				Keyring:          upgradeClient.ChartPathOptions.Keyring,
				SkipUpdate:       false,
				Getters:          getter.All(settings),
				RepositoryConfig: settings.RepositoryConfig,
				RepositoryCache:  settings.RepositoryCache,
			}
			err = manager.Update()
			if err != nil {
				log.Println(err)
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
		}
	}

	values := make(map[string]interface{})
	valuesStr, err := base64.StdEncoding.DecodeString(req.Values)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	err = yaml.Unmarshal([]byte(valuesStr), &values)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Upgrade chart
	result, err := upgradeClient.Run(req.Name, chart, values)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	fmt.Println(result)

	// Return response
	w.WriteHeader(http.StatusOK)
}
