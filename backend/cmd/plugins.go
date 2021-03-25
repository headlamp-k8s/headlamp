package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"path"
	"path/filepath"
	"time"

	"github.com/fsnotify/fsnotify"
)

// folderExists(path) returns true if the folder exists.
func folderExists(path string) bool {
	info, err := os.Stat(path)
	if os.IsNotExist(err) {
		return false
	}

	return info.IsDir()
}

// Gets the default plugins-dir depending on platform.
func defaultPluginDir() string {
	// These are the folders we use for the default plugin-dir.
	//  - the passed in pluginDir if it's not empty.
	//  - "./.plugins" if it exists.
	//  - ~/.config/Headlamp/plugins exists or it can be made
	//  - "./.plugins" if the ~/.config/Headlamp/plugins can't be made.
	pluginDirDefault := "./.plugins"

	if folderExists(pluginDirDefault) {
		return pluginDirDefault
	}

	userConfigDir, err := os.UserConfigDir()
	if err != nil {
		log.Printf("error getting user config dir: %s\n", err)

		return pluginDirDefault
	}

	pluginsConfigDir := path.Join(userConfigDir, "Headlamp", "plugins")

	err = os.MkdirAll(pluginsConfigDir, 0755)

	if err != nil {
		log.Printf("error creating plugins directory: %s\n", err)

		return pluginDirDefault
	}

	return pluginsConfigDir
}

var watcher *fsnotify.Watcher

var changeHappened = false

// pluginsChanged asks if we should reload.
func pluginsChanged() bool {
	changed := changeHappened
	changeHappened = false

	return changed
}

// watchForChanges(path) looks for changes in the path, and signals that a change has happened.
func watchForChanges(path string) {
	watcher, _ = fsnotify.NewWatcher()
	defer watcher.Close()

	go watchSubfolders(path)

	done := make(chan bool)

	go func() {
		for {
			select {
			case event := <-watcher.Events:
				fmt.Printf("Plugin event! %#v\n", event)

				changeHappened = true

				// If there is an event, we rewatch the path.
				// Probably only need to do this on subfolder create events.
				if err := filepath.Walk(path, watchDir); err != nil {
					fmt.Println(err)
				}
			case err := <-watcher.Errors:
				fmt.Println("Plugin watcher Error", err)
			}
		}
	}()

	<-done
}

// watchDir searches for directories to add watchers to.
func watchDir(path string, fi os.FileInfo, err error) error {
	if fi == nil {
		return nil
	}

	// Only need to watch folders, because files are already handled.
	if fi.Mode().IsDir() {
		return watcher.Add(path)
	}

	return nil
}

// watchSubfolders watches the path for sub folder changes.
// Even if the path does not exist when first calls it eventually notices it.
// Also handles subfolders, which fsnotify doesn't do by default.
func watchSubfolders(path string) {
	done := make(chan struct{})

	go func() {
		done <- struct{}{}
	}()

	tickSeconds := 5
	ticker := time.NewTicker(time.Duration(tickSeconds) * time.Second)

	defer ticker.Stop()

	for ; ; <-ticker.C {
		<-done

		if err := filepath.Walk(path, watchDir); err != nil {
			fmt.Println(err)
		}

		go func() {
			done <- struct{}{}
		}()
	}
}

// getPluginListURLs gets a list of plugin URLs from the configured plugins folder.
// Returns pluginListURLs, nil if there is no problem.
// returns nil, err if there's an error.
func (c *HeadlampConfig) getPluginListURLs() ([]string, error) {
	files, err := ioutil.ReadDir(c.pluginDir)
	if err != nil && !os.IsNotExist(err) {
		return nil, err
	}

	pluginListURLs := make([]string, 0, len(files))

	for _, f := range files {
		if !f.IsDir() {
			pluginPath := filepath.Join(c.pluginDir, f.Name())
			log.Printf("Not including plugin path '%s' it is not a folder.\n", pluginPath)

			continue
		}

		pluginPath := filepath.Join(c.pluginDir, f.Name(), "main.js")

		_, err := os.Stat(pluginPath)
		if err != nil {
			log.Printf("Not including plugin path '%s': %s\n", pluginPath, err)
			continue
		}

		pluginFileURL := filepath.Join(c.baseURL, "plugins", f.Name(), "main.js")
		pluginListURLs = append(pluginListURLs, pluginFileURL)
	}

	return pluginListURLs, nil
}
