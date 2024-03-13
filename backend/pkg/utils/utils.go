package utils

import (
	"net/http"

	"github.com/headlamp-k8s/headlamp/backend/pkg/logger"
)

// Contains returns true if the slice contains the value.
func Contains[T comparable](elems []T, v T) bool {
	for _, s := range elems {
		if v == s {
			return true
		}
	}

	return false
}

func HandleError(w http.ResponseWriter, releaseName string, err error, message string, status int) {
	logger.Log(logger.LevelError, map[string]string{"releaseName": releaseName}, err, message)
	http.Error(w, err.Error(), status)
}
