package main

import (
	"log"
	"os"
	"path"
)

// folderExists(path) returns true if the folder exists.
func folderExists(path string) bool {
	info, err := os.Stat(path)
	if os.IsNotExist(err) {
		return false
	}

	return info.IsDir()
}

func defaultPluginDir(pluginDir string) string {
	if pluginDir != "" {
		return pluginDir
	}

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
