package kubeconfig

import (
	"log"
	"os"
	"path/filepath"
	"time"

	"github.com/fsnotify/fsnotify"
	"k8s.io/utils/strings/slices"
)

const watchInterval = 10 * time.Second

func WatchAndLoadKubeConfigFile(paths string, kubeConfigStore ContextStore) {
	// create ticker
	ticker := time.NewTicker(watchInterval)

	// create watcher
	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		log.Println("Error watching for kube config changes:", err)
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
				log.Println("watcher: re-adding missing files")
				addFilesToWatcher(watcher, kubeConfigPaths)

				err := LoadAndStoreKubeConfigs(kubeConfigStore, paths)
				if err != nil {
					log.Println("watcher: error loading kubeconfig files", err)
				}
			}

		case event := <-watcher.Events:
			triggers := []fsnotify.Op{fsnotify.Create, fsnotify.Write, fsnotify.Remove, fsnotify.Rename}
			for _, trigger := range triggers {
				trigger := trigger
				if event.Op.Has(trigger) {
					log.Println("watcher: kubeconfig file changed, reloading contexts")

					err := LoadAndStoreKubeConfigs(kubeConfigStore, paths)
					if err != nil {
						log.Println("watcher: error loading kubeconfig files", err)
					}
				}
			}

		case err := <-watcher.Errors:
			log.Println("watcher: error watching kubeconfig files", err)
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
				log.Printf("Couldn't get absolute path for %s: %v ,so it is not added to watcher", path, err)
				continue
			}

			path = absPath
		}

		// check if path exists
		if _, err := os.Stat(path); os.IsNotExist(err) {
			log.Printf("Path %s does not exist, so it is not added to watcher", path)
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
			log.Printf("Couldn't add %s to watcher: %v", path, err)
		}
	}
}
