package plugins

import (
	"context"
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/fsnotify/fsnotify"
	"github.com/headlamp-k8s/headlamp/backend/pkg/cache"
	"github.com/headlamp-k8s/headlamp/backend/pkg/utils"
)

const (
	PluginRefreshKey       = "PLUGIN_REFRESH"
	PluginListKey          = "PLUGIN_LIST"
	subFolderWatchInterval = 5 * time.Second
)

// Watch watches the given path for changes and sends the events to the notify channel.
func Watch(path string, notify chan<- string) {
	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		log.Println("watcher init error:", err)
	}
	defer watcher.Close()

	go periodicallyWatchSubfolders(watcher, path, subFolderWatchInterval)

	for {
		select {
		case event := <-watcher.Events:
			notify <- event.Name + ":" + event.Op.String()
		case err := <-watcher.Errors:
			fmt.Println("Plugin watcher Error", err)
		}
	}
}

// periodicallyWatchSubfolders periodically walks the path and adds any new directories to the watcher.
// This is needed because fsnotify doesn't watch subfolders.
func periodicallyWatchSubfolders(watcher *fsnotify.Watcher, path string, interval time.Duration) {
	ticker := time.NewTicker(interval)
	defer ticker.Stop()

	for ; true; <-ticker.C {
		// Walk the path and add any new directories to the watcher.
		_ = filepath.WalkDir(path, func(path string, d fs.DirEntry, err error) error {
			if d != nil && d.IsDir() && !utils.Contains(watcher.WatchList(), path) {
				err := watcher.Add(path)
				if err != nil {
					log.Println("Error adding path to watcher", path, err)
					return err
				}
				// when a folder is added, send events for all the files in the folder
				entries, err := os.ReadDir(path)
				if err != nil {
					log.Println("Error reading dir", path, err)
					return err
				}
				for _, entry := range entries {
					watcher.Events <- fsnotify.Event{Name: filepath.Join(path, entry.Name()), Op: fsnotify.Create}
				}
			}
			return nil
		})
	}
}

// GeneratePluginPaths takes the basePath, staticPluginDir and pluginDir and returns a list of plugin paths.
func GeneratePluginPaths(basePath string, staticPluginDir string, pluginDir string) ([]string, error) {
	var pluginListURLStatic []string

	if staticPluginDir != "" {
		var err error

		pluginListURLStatic, err = pluginBasePathListForDir(staticPluginDir, filepath.Join(basePath, "static-plugins"))
		if err != nil {
			return nil, err
		}
	}

	pluginListURL, err := pluginBasePathListForDir(pluginDir, filepath.Join(basePath, "plugins"))
	if err != nil {
		return nil, err
	}

	// Concatenate the static and user plugin lists.
	if pluginListURLStatic != nil {
		pluginListURL = append(pluginListURLStatic, pluginListURL...)
	}

	return pluginListURL, nil
}

// pluginBasePathListForDir returns a list of valid plugin paths for the given directory.
func pluginBasePathListForDir(pluginDir string, baseURL string) ([]string, error) {
	files, err := os.ReadDir(pluginDir)
	if err != nil && !os.IsNotExist(err) {
		return nil, err
	}

	pluginListURLs := make([]string, 0, len(files))

	for _, f := range files {
		if !f.IsDir() {
			pluginPath := filepath.Join(pluginDir, f.Name())
			log.Printf("Not including plugin path '%s' it is not a folder.\n", pluginPath)

			continue
		}

		pluginPath := filepath.Join(pluginDir, f.Name(), "main.js")

		_, err := os.Stat(pluginPath)
		if err != nil {
			log.Printf("Not including plugin path '%s': %s\n", pluginPath, err)
			continue
		}

		packageJSONPath := filepath.Join(pluginDir, f.Name(), "package.json")

		_, err = os.Stat(packageJSONPath)
		if err != nil {
			log.Printf("Warning, package.json not found at '%s': %s\n", packageJSONPath, err)
			log.Printf("Please run 'headlamp-plugin extract' again with headlamp-plugin >= 0.6.0")
		}

		pluginFileURL := filepath.Join(baseURL, f.Name())
		pluginListURLs = append(pluginListURLs, pluginFileURL)
	}

	return pluginListURLs, nil
}

// HandlePluginEvents handles the plugin events by updating the plugin list
// and plugin refresh key in the cache.
func HandlePluginEvents(basePath, staticPluginDir, pluginDir string,
	notify <-chan string, cache cache.Cache[interface{}],
) {
	for range notify {
		// set the plugin refresh key to true
		err := cache.Set(context.Background(), PluginRefreshKey, true)
		if err != nil {
			log.Println("Error setting plugin refresh key", err)
		}

		// generate the plugin list
		pluginList, err := GeneratePluginPaths(basePath, staticPluginDir, pluginDir)
		if err != nil && !os.IsNotExist(err) {
			log.Println("Error generating plugins path", err)
		}

		err = cache.Set(context.Background(), PluginListKey, pluginList)
		if err != nil {
			log.Println("Error setting plugin list key", err)
		}
	}
}

// PopulatePluginsCache populates the plugin list and plugin refresh key in the cache.
func PopulatePluginsCache(basePath, staticPluginDir, pluginDir string, cache cache.Cache[interface{}]) {
	// set the plugin refresh key to false
	err := cache.Set(context.Background(), PluginRefreshKey, false)
	if err != nil {
		log.Println("Error setting plugin refresh key", err)
	}

	// generate the plugin list
	pluginList, err := GeneratePluginPaths(basePath, staticPluginDir, pluginDir)
	if err != nil && !os.IsNotExist(err) {
		log.Println("Error generating plugins path", err)
	}

	err = cache.Set(context.Background(), PluginListKey, pluginList)
	if err != nil {
		log.Println("Error setting plugin list key", err)
	}
}

// HandlePluginReload checks if the plugin refresh key is set to true
// and sends a signal to the frontend to reload the plugins by setting
// the X-Reload header to reload.
func HandlePluginReload(cache cache.Cache[interface{}], w http.ResponseWriter) {
	value, err := cache.Get(context.Background(), PluginRefreshKey)
	if err != nil {
		log.Println("Error getting plugin refresh key", err)
	}

	valueBool, ok := value.(bool)
	if !ok {
		log.Println("Error converting plugin refresh key to bool")
	}

	if valueBool {
		// We signal back to the frontend through a header.
		// See apiProxy.ts in the frontend for how it handles this.
		log.Println("Sending reload plugins signal to frontend")

		// Allow JavaScript access to X-Reload header. Because denied by default.
		w.Header().Set("Access-Control-Expose-Headers", "X-Reload")
		w.Header().Set("X-Reload", "reload")

		// set the plugin refresh key to false
		err := cache.Set(context.Background(), PluginRefreshKey, false)
		if err != nil {
			log.Println("Error setting plugin refresh key", err)
		}
	}
}

// Delete deletes the plugin from the plugin directory.
func Delete(name string) error {
	return os.RemoveAll(name)
}
