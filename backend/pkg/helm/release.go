package helm

import (
	"encoding/base64"
	"encoding/json"
	"errors"
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/gorilla/schema"
	zlog "github.com/rs/zerolog/log"
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
		zlog.Error().Err(err).Str("request", "list_releases").Msg("Failed to parse request")
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
		zlog.Error().Err(err).Str("request", "list_releases").Msg("Failed to list releases")
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Return response
	res := ListReleaseResponse{
		Releases: releases,
	}
	err = json.NewEncoder(w).Encode(res)
	if err != nil {
		zlog.Error().Err(err).Str("request", "list_releases").Msg("Failed to encode response")
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
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
		zlog.Error().Err(err).Str("request", "get_release").Msg("failed to parse request")
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// check if release exists
	_, err = h.Configuration.Releases.Deployed(req.Name)
	if err == driver.ErrReleaseNotFound {
		zlog.Error().Err(err).Str("releaseName", req.Name).
			Str("request", "get_release").Msg("release not found")
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	getClient := action.NewGet(h.Configuration)
	result, err := getClient.Run(req.Name)
	if err != nil {
		zlog.Error().Err(err).Str("request", "get_release").Str("releaseName", req.Name).Msg("failed to get release")
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	err = json.NewEncoder(w).Encode(result)
	if err != nil {
		zlog.Error().Err(err).Str("request", "get_release").Str("releaseName", req.Name).Msg("failed to encode response")
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
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
		zlog.Error().Err(err).Str("request", "get_release_history").Msg("error decoding request")
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// check if release exists
	_, err = h.Configuration.Releases.Deployed(req.Name)
	if err == driver.ErrReleaseNotFound {
		zlog.Error().Err(err).Str("releaseName", req.Name).
			Str("request", "get_release_history").Msg("release not found")
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	getClient := action.NewHistory(h.Configuration)
	result, err := getClient.Run(req.Name)
	if err != nil {
		zlog.Error().Err(err).Str("request", "get_release_history").Str("releaseName", req.Name).Msg("failed to get release history")
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	resp := GetReleaseHistoryResponse{
		Releases: result,
	}
	w.WriteHeader(http.StatusOK)
	err = json.NewEncoder(w).Encode(resp)
	if err != nil {
		zlog.Error().Err(err).Str("request", "get_release_history").Str("releaseName", req.Name).Msg("failed to encode response")
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
}

type UninstallReleaseRequest struct {
	Name      string `json:"name"`
	Namespace string `json:"namespace"`
}

func (h *HelmHandler) UninstallRelease(w http.ResponseWriter, r *http.Request) {

	// Parse request
	var req UninstallReleaseRequest

	var decoder = schema.NewDecoder()
	err := decoder.Decode(&req, r.URL.Query())
	if err != nil {
		zlog.Error().Err(err).Str("action", "uninstall").Msg("failed to parse request")
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// check if release exists
	_, err = h.Configuration.Releases.Deployed(req.Name)
	if err == driver.ErrReleaseNotFound {
		zlog.Error().Err(err).Str("releaseName", req.Name).
			Str("action", "uninstall").Msg("release not found")
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	go func(h *HelmHandler) {
		actionState.SetStatus("uninstall", req.Name, "processing", nil)
		h.uninstallRelease(req)
	}(h)

	response := map[string]string{
		"message": "uninstall request accepted",
	}
	w.WriteHeader(http.StatusAccepted)
	err = json.NewEncoder(w).Encode(response)
	if err != nil {
		zlog.Error().Err(err).Str("action", "uninstall").Msg("failed to encode response")
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
}

func (h *HelmHandler) uninstallRelease(req UninstallReleaseRequest) {

	// Get uninstall client
	uninstallClient := action.NewUninstall(h.Configuration)
	_, err := uninstallClient.Run(req.Name)
	if err != nil {
		zlog.Error().Err(err).Str("releaseName", req.Name).Str("namespace", req.Namespace).Msg("failed to uninstall release")
		actionState.SetStatus("uninstall", req.Name, "failed", err)
		return
	}
	actionState.SetStatus("uninstall", req.Name, "success", err)
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
		zlog.Error().Err(err).Str("action", "rollback").Msg("failed to parse request body")
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err = req.Validate()
	if err != nil {
		zlog.Error().Err(err).Str("action", "rollback").Msg("failed to validate request body")
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// check if release exists
	_, err = h.Configuration.Releases.Deployed(req.Name)
	if err == driver.ErrReleaseNotFound {
		zlog.Error().Err(err).Str("releaseName", req.Name).
			Str("action", "rollback").Msg("release not found")
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	go func(h *HelmHandler) {
		actionState.SetStatus("rollback", req.Name, "processing", nil)
		h.rollbackRelease(req)
	}(h)

	response := map[string]string{
		"message": "rollback request accepted",
	}
	w.WriteHeader(http.StatusAccepted)
	err = json.NewEncoder(w).Encode(response)
	if err != nil {
		zlog.Error().Err(err).Str("action", "rollback").Msg("failed to encode response")
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
}

func (h *HelmHandler) rollbackRelease(req RollbackReleaseRequest) {
	rollbackClient := action.NewRollback(h.Configuration)
	rollbackClient.Version = req.Revision

	err := rollbackClient.Run(req.Name)
	if err != nil {
		zlog.Error().Err(err).Str("release", req.Name).Msg("failed to rollback release")
		actionState.SetStatus("rollback", req.Name, "failed", err)
		return
	}
	actionState.SetStatus("rollback", req.Name, "success", nil)
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
		zlog.Error().Err(err).Str("action", "install").Msg("failed to parse request body")
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	go func(h *HelmHandler) {
		actionState.SetStatus("install", req.Name, "processing", nil)
		h.installRelease(req)
	}(h)

	// Return response
	var response = map[string]string{
		"message": "install request accepted",
	}
	w.WriteHeader(http.StatusAccepted)
	err = json.NewEncoder(w).Encode(response)
	if err != nil {
		zlog.Error().Err(err).Str("releaseName", req.Name).
			Str("action", "install").Str("chart", req.Chart).Str("action", "install").Msg("failed to encode response")
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
}

func (h *HelmHandler) installRelease(req InstallRequest) {
	// Get install client
	installClient := action.NewInstall(h.Configuration)
	installClient.ReleaseName = req.Name
	installClient.Namespace = req.Namespace
	installClient.Description = req.Description
	installClient.CreateNamespace = req.CreateNamespace

	// locate chart
	chartPath, err := installClient.ChartPathOptions.LocateChart(req.Chart, settings)
	if err != nil {
		zlog.Error().Err(err).Str("chart", req.Chart).
			Str("action", "install").Str("releaseName", req.Name).Msg("failed to locate chart")
		actionState.SetStatus("install", req.Name, "failed", err)
		return
	}

	// load chart
	chart, err := loader.Load(chartPath)
	if err != nil {
		zlog.Error().Err(err).Str("chart", req.Chart).
			Str("action", "install").Str("releaseName", req.Name).Msg("failed to load chart")
		actionState.SetStatus("install", req.Name, "failed", err)
		return
	}

	// chart is installable only if it is of type application or empty
	if chart.Metadata.Type != "" && chart.Metadata.Type != "application" {
		zlog.Error().Str("chart", req.Chart).
			Str("action", "install").Str("releaseName", req.Name).Msg("chart is not installable")
		actionState.SetStatus("install", req.Name, "failed", err)
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
				zlog.Error().Err(err).Str("chart", req.Chart).
					Str("action", "install").Str("releaseName", req.Name).
					Msg("failed to update dependencies")
				actionState.SetStatus("install", req.Name, "failed", err)
				return
			}
		}
	}

	values := make(map[string]interface{})
	valuesStr, err := base64.StdEncoding.DecodeString(req.Values)
	if err != nil {
		zlog.Error().Err(err).Str("chart", req.Chart).
			Str("action", "install").Str("releaseName", req.Name).
			Msg("failed to decode values")
		actionState.SetStatus("install", req.Name, "failed", err)
		return
	}
	err = yaml.Unmarshal([]byte(valuesStr), &values)
	if err != nil {
		zlog.Error().Err(err).Str("chart", req.Chart).
			Str("action", "install").Str("releaseName", req.Name).
			Msg("failed to unmarshal values")
		actionState.SetStatus("install", req.Name, "failed", err)
		return
	}

	// Install chart
	_, err = installClient.Run(chart, values)
	if err != nil {
		zlog.Error().Err(err).Str("chart", req.Chart).
			Str("action", "install").Str("releaseName", req.Name).
			Msg("failed to install chart")
		actionState.SetStatus("install", req.Name, "failed", err)
		return
	}

	zlog.Info().Str("chart", req.Chart).Str("action", "install").
		Str("releaseName", req.Name).Msg("chart installed successfully")

	actionState.SetStatus("install", req.Name, "success", nil)
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
		zlog.Error().Err(err).Str("releaseName", req.Name).
			Str("action", "upgrade").Msg("failed to parse request for upgrade release")
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err = req.Validate()
	if err != nil {
		zlog.Error().Err(err).Str("releaseName", req.Name).
			Str("action", "upgrade").Msg("failed to validate request for upgrade release")
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// check if release exists
	_, err = h.Configuration.Releases.Deployed(req.Name)
	if err == driver.ErrReleaseNotFound {
		zlog.Error().Err(err).Str("releaseName", req.Name).
			Str("action", "upgrade").Str("chart", req.Chart).Msg("release not found")
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	go func(h *HelmHandler) {
		actionState.SetStatus("upgrade", req.Name, "processing", nil)
		h.upgradeRelease(req)
	}(h)

	// Return response
	var response = map[string]string{
		"message": "upgrade request accepted",
	}
	w.WriteHeader(http.StatusAccepted)
	err = json.NewEncoder(w).Encode(response)
	if err != nil {
		zlog.Error().Err(err).Str("releaseName", req.Name).
			Str("action", "upgrade").Str("chart", req.Chart).Msg("failed to encode response")
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
}

func (h *HelmHandler) upgradeRelease(req UpgradeReleaseRequest) {

	// find chart
	upgradeClient := action.NewUpgrade(h.Configuration)

	chartPath, err := upgradeClient.ChartPathOptions.LocateChart(req.Chart, settings)
	if err != nil {
		zlog.Error().Err(err).Str("chart", req.Chart).
			Str("action", "upgrade").Str("releaseName", req.Name).
			Msg("failed to locate chart")
		actionState.SetStatus("upgrade", req.Name, "failed", err)
		return
	}

	// load chart
	chart, err := loader.Load(chartPath)
	if err != nil {
		zlog.Error().Err(err).Str("chart", req.Chart).
			Str("action", "upgrade").Str("releaseName", req.Name).
			Msg("failed to load chart")
		actionState.SetStatus("upgrade", req.Name, "failed", err)
		return
	}

	// chart is installable only if it is of type application or empty
	if chart.Metadata.Type != "" && chart.Metadata.Type != "application" {
		zlog.Error().Str("chart", req.Chart).
			Str("action", "upgrade").Str("releaseName", req.Name).
			Msg("chart is not upgradeable")
		actionState.SetStatus("upgrade", req.Name, "failed", err)
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
				zlog.Error().Str("chart", req.Chart).
					Str("action", "upgrade").Str("releaseName", req.Name).
					Msg("chart dependencies update failed")
				actionState.SetStatus("upgrade", req.Name, "failed", err)
				return
			}
		}
	}

	values := make(map[string]interface{})
	valuesStr, err := base64.StdEncoding.DecodeString(req.Values)
	if err != nil {
		zlog.Error().Str("chart", req.Chart).
			Str("action", "upgrade").Str("releaseName", req.Name).
			Msg("values decoding failed")
		actionState.SetStatus("upgrade", req.Name, "failed", err)
		return
	}
	err = yaml.Unmarshal([]byte(valuesStr), &values)
	if err != nil {
		zlog.Error().Str("chart", req.Chart).
			Str("action", "upgrade").Str("releaseName", req.Name).
			Msg("values unmarshalling failed")
		actionState.SetStatus("upgrade", req.Name, "failed", err)
		return
	}

	// Upgrade chart
	_, err = upgradeClient.Run(req.Name, chart, values)
	if err != nil {
		zlog.Error().Str("chart", req.Chart).
			Str("action", "upgrade").Str("releaseName", req.Name).
			Msg("chart upgrade failed")
		actionState.SetStatus("upgrade", req.Name, "failed", err)
		return
	}
	zlog.Info().Str("chart", req.Chart).
		Str("action", "upgrade").Str("releaseName", req.Name).
		Msg("chart upgradeable is successful")

	actionState.SetStatus("upgrade", req.Name, "success", nil)
}

type ActionStatusRequest struct {
	Name   string `json:"name" validate:"required"`
	Action string `json:"action" validate:"required"`
}

func (a *ActionStatusRequest) Validate() error {
	validate := validator.New()
	err := validate.Struct(a)
	if err != nil {
		return err
	}
	if a.Action != "install" && a.Action != "upgrade" && a.Action != "uninstall" && a.Action != "rollback" {
		return errors.New("invalid action")
	}
	return nil
}

func (h *HelmHandler) GetActionStatus(w http.ResponseWriter, r *http.Request) {

	var request ActionStatusRequest

	err := schema.NewDecoder().Decode(&request, r.URL.Query())
	if err != nil {
		zlog.Error().Err(err).Msg("failed to parse request for status")
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err = request.Validate()
	if err != nil {
		zlog.Error().Err(err).Msg("failed to validate request for status")
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	status, err := actionState.GetStatus(request.Action, request.Name)

	var response = map[string]string{
		"status": status,
	}

	if status == "success" {
		response["message"] = "action completed successfully"
	}

	if status == "failed" {
		response["message"] = "action failed with error: " + err.Error()
	}

	w.WriteHeader(http.StatusAccepted)
	err = json.NewEncoder(w).Encode(response)
	if err != nil {
		zlog.Error().Err(err).Msg("failed to encode response")
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
}
