package kubeconfig

import (
	"os"
	"path/filepath"
	"time"

	"github.com/fsnotify/fsnotify"
	"github.com/headlamp-k8s/headlamp/backend/pkg/logger"
	"k8s.io/utils/strings/slices"
)

const watchInterval = 10 * time.Second

// LoadAndWatchFiles loads kubeconfig files and watches them for changes.
func LoadAndWatchFiles(kubeConfigStore ContextStore, paths string, source int) {
	// create ticker
	ticker := time.NewTicker(watchInterval)

	// create watcher
	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		logger.Log(logger.LevelError, nil, err, "creating watcher")

		return
	}

	defer watcher.Close()

	kubeConfigPaths := splitKubeConfigPath(paths)

	// add files to watcher
	addFilesToWatcher(watcher, kubeConfigPaths)

	for {
		select {
		case <-ticker.C:
			if len(watcher.WatchList()) != len(kubeConfigPaths) {
				logger.Log(logger.LevelInfo, nil, nil, "watcher: re-adding missing files")
				addFilesToWatcher(watcher, kubeConfigPaths)

				err := LoadAndStoreKubeConfigs(kubeConfigStore, paths, source)
				if err != nil {
					logger.Log(logger.LevelError, nil, err, "watcher: error loading kubeconfig files")
				}
			}

		case event := <-watcher.Events:
			triggers := []fsnotify.Op{fsnotify.Create, fsnotify.Write, fsnotify.Remove, fsnotify.Rename}
			for _, trigger := range triggers {
				trigger := trigger
				if event.Op.Has(trigger) {
					logger.Log(logger.LevelInfo, map[string]string{"event": event.Name},
						nil, "watcher: kubeconfig file changed, reloading contexts")

					err := LoadAndStoreKubeConfigs(kubeConfigStore, paths, source)
					if err != nil {
						logger.Log(logger.LevelError, nil, err, "watcher: error loading kubeconfig files")
					}
				}
			}

		case err := <-watcher.Errors:
			logger.Log(logger.LevelError, nil, err, "watcher: error watching kubeconfig files")
		}
	}
}

func addFilesToWatcher(watcher *fsnotify.Watcher, paths []string) {
	for _, path := range paths {
		path := path

		// if path is relative, make it absolute
		if !filepath.IsAbs(path) {
			absPath, err := filepath.Abs(path)
			if err != nil {
				logger.Log(logger.LevelError, map[string]string{"path": path},
					err, "getting absolute path")

				continue
			}

			path = absPath
		}

		// check if path exists
		if _, err := os.Stat(path); os.IsNotExist(err) {
			logger.Log(logger.LevelError, map[string]string{"path": path},
				err, "Path does not exist")

			continue
		}

		// check if path is already being watched
		// if it is, continue
		filesBeingWatched := watcher.WatchList()
		if slices.Contains(filesBeingWatched, path) {
			continue
		}

		// if it isn't, add it to the watcher
		err := watcher.Add(path)
		if err != nil {
			logger.Log(logger.LevelError, map[string]string{"path": path},
				err, "adding path to watcher")
		}
	}
}
