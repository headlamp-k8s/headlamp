package helm

import (
	"encoding/base64"
	"encoding/json"
	"errors"
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/gorilla/schema"

	"github.com/rs/zerolog"
	zlog "github.com/rs/zerolog/log"
	"helm.sh/helm/v3/pkg/action"
	"helm.sh/helm/v3/pkg/chart"
	"helm.sh/helm/v3/pkg/chart/loader"
	"helm.sh/helm/v3/pkg/downloader"
	"helm.sh/helm/v3/pkg/getter"
	"helm.sh/helm/v3/pkg/release"
	"helm.sh/helm/v3/pkg/storage/driver"
	"sigs.k8s.io/yaml"
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

// Returns (releases, error) given the request and helm configuration.
//
//nolint:gocognit
func getReleases(req ListReleaseRequest, config *action.Configuration) ([]*release.Release, error) {
	// Get list client
	listClient := action.NewList(config)

	// Removing all these if assignments is not possible, so we disable gocognit linter
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

	return listClient.Run()
}

func (h *Handler) ListRelease(w http.ResponseWriter, r *http.Request) {
	// Parse request
	var req ListReleaseRequest

	decoder := schema.NewDecoder()

	err := decoder.Decode(&req, r.URL.Query())
	if err != nil {
		zlog.Error().Err(err).Str("request", "list_releases").Msg("Failed to parse request")
		http.Error(w, err.Error(), http.StatusBadRequest)

		return
	}

	releases, err := getReleases(req, h.Configuration)
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

func (h *Handler) GetRelease(w http.ResponseWriter, r *http.Request) {
	// Parse request
	var req GetReleaseRequest

	decoder := schema.NewDecoder()

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

func (h *Handler) GetReleaseHistory(w http.ResponseWriter, r *http.Request) {
	// Parse request
	var req GetReleaseHistoryRequest

	decoder := schema.NewDecoder()

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
		zlog.
			Error().
			Err(err).
			Str("request", "get_release_history").
			Str("releaseName", req.Name).
			Msg("failed to get release history")
		http.Error(w, err.Error(), http.StatusInternalServerError)

		return
	}

	resp := GetReleaseHistoryResponse{
		Releases: result,
	}

	w.WriteHeader(http.StatusOK)

	err = json.NewEncoder(w).Encode(resp)

	if err != nil {
		zlog.
			Error().
			Err(err).
			Str("request", "get_release_history").
			Str("releaseName", req.Name).
			Msg("failed to encode response")
		http.Error(w, err.Error(), http.StatusInternalServerError)

		return
	}

	w.Header().Set("Content-Type", "application/json")
}

type UninstallReleaseRequest struct {
	Name      string `json:"name"`
	Namespace string `json:"namespace"`
}

func (h *Handler) UninstallRelease(w http.ResponseWriter, r *http.Request) {
	// Parse request
	var req UninstallReleaseRequest

	decoder := schema.NewDecoder()

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

	go func(h *Handler) {
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

func (h *Handler) uninstallRelease(req UninstallReleaseRequest) {
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

func (h *Handler) RollbackRelease(w http.ResponseWriter, r *http.Request) {
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

	go func(h *Handler) {
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

func (h *Handler) rollbackRelease(req RollbackReleaseRequest) {
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

func (h *Handler) InstallRelease(w http.ResponseWriter, r *http.Request) {
	// parse request
	var req InstallRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		zlog.Error().Err(err).Str("action", "install").Msg("failed to parse request body")
		http.Error(w, err.Error(), http.StatusBadRequest)

		return
	}

	go func(h *Handler) {
		actionState.SetStatus("install", req.Name, "processing", nil)
		h.installRelease(req)
	}(h)

	// Return response
	response := map[string]string{
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

// Returns the chart, and err, and if dependencyUpdate is true then we also update the chart dependencies.
func getChart(
	actionName string,
	reqChart string,
	reqName string,
	chartPathOptions action.ChartPathOptions,
	dependencyUpdate bool,
) (*chart.Chart, error) {
	// locate chart
	chartPath, err := chartPathOptions.LocateChart(reqChart, settings)
	if err != nil {
		logActionState(zlog.Error(), err, actionName, reqChart, reqName, "failed", "failed to locate chart")
		return nil, err
	}

	// load chart
	chart, err := loader.Load(chartPath)
	if err != nil {
		logActionState(zlog.Error(), err, actionName, reqChart, reqName, "failed", "failed to load chart")
		return nil, err
	}

	// chart is installable only if it is of type application or empty
	if chart.Metadata.Type != "" && chart.Metadata.Type != "application" {
		logActionState(zlog.Error(), err, actionName, reqChart, reqName, "failed", "chart is not installable")
		return nil, err
	}

	// Update chart dependencies
	if chart.Metadata.Dependencies != nil && dependencyUpdate {
		err = action.CheckDependencies(chart, chart.Metadata.Dependencies)
		if err != nil {
			manager := &downloader.Manager{
				ChartPath:        chartPath,
				Keyring:          chartPathOptions.Keyring,
				SkipUpdate:       false,
				Getters:          getter.All(settings),
				RepositoryConfig: settings.RepositoryConfig,
				RepositoryCache:  settings.RepositoryCache,
			}

			err = manager.Update()
			if err != nil {
				logActionState(zlog.Error(), err, actionName, reqChart, reqName, "failed", "failed to update dependencies")
				return nil, err
			}
		}
	}

	return chart, nil
}

//nolint:funlen
func (h *Handler) installRelease(req InstallRequest) {
	// Get install client
	installClient := action.NewInstall(h.Configuration)
	installClient.ReleaseName = req.Name
	installClient.Namespace = req.Namespace
	installClient.Description = req.Description
	installClient.CreateNamespace = req.CreateNamespace

	chart, err := getChart("install", req.Chart, req.Name, installClient.ChartPathOptions, req.DependencyUpdate)
	if err != nil {
		return
	}

	values := make(map[string]interface{})

	if err != nil {
		zlog.Error().Err(err).Str("chart", req.Chart).
			Str("action", "install").Str("releaseName", req.Name).
			Msg("failed to decode values")
		actionState.SetStatus("install", req.Name, "failed", err)

		return
	}

	decodedBytes, err := base64.StdEncoding.DecodeString(req.Values)
	if err != nil {
		zlog.Error().Err(err).Str("chart", req.Chart).
			Str("action", "install").Str("releaseName", req.Name).
			Msg("failed to decode values")
		actionState.SetStatus("install", req.Name, "failed", err)

		return
	}

	err = yaml.Unmarshal(decodedBytes, &values)

	if err != nil {
		zlog.Error().Err(err).Str("chart", req.Chart).
			Str("action", "install").Str("releaseName", req.Name).
			Msg("failed to unmarshal values")
		actionState.SetStatus("install", req.Name, "failed", err)

		return
	}

	// Set annotations for the release
	values["dev.headlamp.metadata"] = map[string]string{
		"chartName": req.Chart,
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

func (h *Handler) UpgradeRelease(w http.ResponseWriter, r *http.Request) {
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

	go func(h *Handler) {
		actionState.SetStatus("upgrade", req.Name, "processing", nil)
		h.upgradeRelease(req)
	}(h)

	// Return response
	response := map[string]string{
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

func logActionState(log *zerolog.Event,
	err error,
	action string,
	chart string,
	releaseName string,
	status string,
	message string,
) {
	log.Str("chart", chart).
		Str("action", action).Str("releaseName", releaseName).
		Msg(message)

	actionState.SetStatus("upgrade", releaseName, status, err)
}

func (h *Handler) upgradeRelease(req UpgradeReleaseRequest) {
	// find chart
	upgradeClient := action.NewUpgrade(h.Configuration)

	chart, err := getChart("upgrade", req.Chart, req.Name, upgradeClient.ChartPathOptions, true)
	if err != nil {
		return
	}

	values := make(map[string]interface{})

	valuesStr, err := base64.StdEncoding.DecodeString(req.Values)
	if err != nil {
		logActionState(zlog.Error(), err, "upgrade", req.Chart, req.Name, "failed", "values decoding failed")
		return
	}

	err = yaml.Unmarshal(valuesStr, &values)
	if err != nil {
		logActionState(zlog.Error(), err, "upgrade", req.Chart, req.Name, "failed", "values un-marshalling failed")
		return
	}
	// add headlamp chart metadata
	values["dev.headlamp.metadata"] = map[string]string{
		"chartName": req.Chart,
	}
	// Upgrade chart
	_, err = upgradeClient.Run(req.Name, chart, values)
	if err != nil {
		logActionState(zlog.Error(), err, "upgrade", req.Chart, req.Name, "failed", "chart upgrade failed")
		return
	}

	logActionState(zlog.Info(), nil, "upgrade", req.Chart, req.Name, "success", "chart upgradeable is successful")
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

func (h *Handler) GetActionStatus(w http.ResponseWriter, r *http.Request) {
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

	response := map[string]string{
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
