package plugins_test

import (
	"context"
	"encoding/json"
	"net/http/httptest"
	"os"
	"path"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/headlamp-k8s/headlamp/backend/pkg/cache"
	"github.com/headlamp-k8s/headlamp/backend/pkg/plugins"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestWatch(t *testing.T) { //nolint:funlen
	t.Parallel()

	// Create a temporary directory if it doesn't exist
	_, err := os.Stat("/tmp/")
	if os.IsNotExist(err) {
		err = os.Mkdir("/tmp/", 0o755)
		require.NoError(t, err)
	}

	// create a new directory in /tmp
	dirName := path.Join("/tmp", uuid.NewString())
	err = os.Mkdir(dirName, 0o755)
	require.NoError(t, err)

	// create channel to receive events
	events := make(chan string)

	// start watching the directory
	go plugins.Watch(dirName, events)

	// wait for the watcher to be setup
	<-time.After(5 * time.Second)
	t.Log("watcher setup", "create a new file in the new directory")
	// create a new file in the new directory
	fileName := path.Join(dirName, uuid.NewString())
	_, err = os.Create(fileName)
	require.NoError(t, err)

	// wait for the watcher to pick up the new directory
	event := <-events
	require.Equal(t, fileName+":CREATE", event)
	t.Log("Got create file event in the new directory")

	// create a new file in a subdirectory
	subDirName := path.Join(dirName, uuid.NewString())
	err = os.Mkdir(subDirName, 0o755)
	require.NoError(t, err)

	// wait for the watcher to pick up the new file
	event = <-events
	require.Equal(t, subDirName+":CREATE", event)
	t.Log("Got create folder event in the directory")

	subFileName := path.Join(subDirName, uuid.NewString())
	_, err = os.Create(subFileName)
	require.NoError(t, err)

	// wait for the watcher to pick up the new file
	event = <-events
	require.Equal(t, subFileName+":CREATE", event)
	t.Log("Got create file event in the sub directory")

	// delete the file
	err = os.Remove(subFileName)
	require.NoError(t, err)

	// wait for the watcher to pick up the delete event
	event = <-events
	require.Equal(t, subFileName+":REMOVE", event)
	t.Log("Got delete file event in the sub directory")

	// clean up
	err = os.RemoveAll(dirName)
	require.NoError(t, err)
}

func TestGeneratePluginPaths(t *testing.T) { //nolint:funlen
	// Create a temporary directory if it doesn't exist
	_, err := os.Stat("/tmp/")
	if os.IsNotExist(err) {
		err = os.Mkdir("/tmp/", 0o755)
		require.NoError(t, err)
	}

	// create a new directory in /tmp
	testDirName := path.Join("/tmp", uuid.NewString())
	err = os.Mkdir(testDirName, 0o755)
	require.NoError(t, err)

	t.Run("PluginPaths", func(t *testing.T) {
		// create a new directory in dirName
		subDirName := uuid.NewString()
		subDir := path.Join(testDirName, subDirName)
		err = os.Mkdir(subDir, 0o755)
		require.NoError(t, err)

		// create main.js and package.json in the sub directory
		pluginPath := path.Join(subDir, "main.js")
		_, err = os.Create(pluginPath)
		require.NoError(t, err)

		packageJSONPath := path.Join(subDir, "package.json")
		_, err = createTempPackageJSON("0.8.0-alpha.10", packageJSONPath)
		require.NoError(t, err)

		// test without basePath
		pathList, err := plugins.GeneratePluginPaths("", "", testDirName)
		require.NoError(t, err)
		require.Contains(t, pathList, "plugins/"+subDirName)

		// test with basePath
		pathList, err = plugins.GeneratePluginPaths("/test", "", testDirName)
		require.NoError(t, err)
		require.Contains(t, pathList, "/test/plugins/"+subDirName)

		// delete the sub directory
		err = os.RemoveAll(subDir)
		require.NoError(t, err)

		// test without any valid plugin
		pathList, err = plugins.GeneratePluginPaths("", "", testDirName)
		require.NoError(t, err)
		require.Empty(t, pathList)
	})

	t.Run("StaticPluginPaths", func(t *testing.T) {
		// create a new directory in dirName
		subDirName := uuid.NewString()
		subDir := path.Join(testDirName, subDirName)
		err = os.Mkdir(subDir, 0o755)
		require.NoError(t, err)

		// create main.js and package.json in the sub directory
		pluginPath := path.Join(subDir, "main.js")
		_, err = os.Create(pluginPath)
		require.NoError(t, err)

		packageJSONPath := path.Join(subDir, "package.json")
		_, err = createTempPackageJSON("0.8.0-alpha.10", packageJSONPath)
		require.NoError(t, err)

		// test without basePath
		pathList, err := plugins.GeneratePluginPaths("", testDirName, "")
		require.NoError(t, err)
		require.Contains(t, pathList, "static-plugins/"+subDirName)

		// test with basePath
		pathList, err = plugins.GeneratePluginPaths("/test", testDirName, "")
		require.NoError(t, err)
		require.Contains(t, pathList, "/test/static-plugins/"+subDirName)

		// delete the sub directory
		err = os.RemoveAll(subDir)
		require.NoError(t, err)

		// test without any valid plugin
		pathList, err = plugins.GeneratePluginPaths("", testDirName, "")
		require.NoError(t, err)
		require.Empty(t, pathList)
	})

	t.Run("InvalidPluginPaths", func(t *testing.T) {
		// create a new directory in test dir
		subDirName := uuid.NewString()
		subDir := path.Join(testDirName, subDirName)
		err = os.Mkdir(subDir, 0o755)
		require.NoError(t, err)

		// create random file in the sub directory
		fileName := path.Join(subDir, uuid.NewString())
		_, err = os.Create(fileName)
		require.NoError(t, err)

		// test with file as plugin Dir
		pathList, err := plugins.GeneratePluginPaths("", fileName, "")
		assert.Error(t, err)
		assert.Nil(t, pathList)
	})

	// clean up
	err = os.RemoveAll(testDirName)
	require.NoError(t, err)
}

func TestHandlePluginEvents(t *testing.T) { //nolint:funlen
	// Create a temporary directory if it doesn't exist
	_, err := os.Stat("/tmp/")
	if os.IsNotExist(err) {
		err = os.Mkdir("/tmp/", 0o755)
		require.NoError(t, err)
	}

	// create a new directory in /tmp
	testDirName := uuid.NewString()
	testDirPath := path.Join("/tmp", testDirName)
	err = os.Mkdir(testDirPath, 0o755)
	require.NoError(t, err)

	// create a new directory for plugin
	pluginDirName := uuid.NewString()
	pluginDirPath := path.Join(testDirPath, pluginDirName)
	err = os.Mkdir(pluginDirPath, 0o755)
	require.NoError(t, err)

	// create main.js and package.json in the sub directory
	pluginPath := path.Join(pluginDirPath, "main.js")
	_, err = os.Create(pluginPath)
	require.NoError(t, err)

	packageJSONPath := path.Join(pluginDirPath, "package.json")
	_, err = createTempPackageJSON("0.8.0-alpha.10", packageJSONPath)
	require.NoError(t, err)

	// create channel to receive events
	events := make(chan string)

	// create cache
	ch := cache.New[interface{}]()

	go plugins.HandlePluginEvents("", "", testDirPath, events, ch)

	// plugin list key should be empty
	pluginList, err := ch.Get(context.Background(), plugins.PluginListKey)
	require.EqualError(t, err, cache.ErrNotFound.Error())
	require.Nil(t, pluginList)

	// plugin refresh key should be empty
	pluginRefresh, err := ch.Get(context.Background(), plugins.PluginRefreshKey)
	require.EqualError(t, err, cache.ErrNotFound.Error())
	require.Nil(t, pluginRefresh)

	// send event
	events <- "test"

	// wait for the plugin list and refresh keys to be set
	for {
		_, err = ch.Get(context.Background(), plugins.PluginListKey)
		if err == nil {
			break
		}
	}

	// check if the plugin refresh key is set
	pluginRefresh, err = ch.Get(context.Background(), plugins.PluginRefreshKey)
	require.NoError(t, err)
	require.NotNil(t, pluginRefresh)

	pluginRefreshBool, ok := pluginRefresh.(bool)
	require.True(t, ok)
	require.True(t, pluginRefreshBool)

	// check if the plugin list key is set
	pluginList, err = ch.Get(context.Background(), plugins.PluginListKey)
	require.NoError(t, err)
	require.NotNil(t, pluginList)

	pluginListArr, ok := pluginList.([]string)
	require.True(t, ok)
	require.Contains(t, pluginListArr, "plugins/"+pluginDirName)

	// clean up
	err = os.RemoveAll(testDirPath)
	require.NoError(t, err)
}

func TestHandlePluginReload(t *testing.T) {
	// create cache
	ch := cache.New[interface{}]()
	w := httptest.NewRecorder()

	// set plugin refresh key to true
	err := ch.Set(context.Background(), plugins.PluginRefreshKey, true)
	require.NoError(t, err)

	// call HandlePluginReload
	plugins.HandlePluginReload(ch, w)

	// check if the header X-RELOAD is set to true
	assert.Equal(t, "reload", w.Header().Get("X-RELOAD"))

	// create new recorder
	w = httptest.NewRecorder()

	// call HandlePluginReload again
	plugins.HandlePluginReload(ch, w)

	// X-RELOAD header should not be set
	assert.Empty(t, w.Header().Get("X-RELOAD"))
}

func TestPopulatePluginsCache(t *testing.T) {
	// create cache
	ch := cache.New[interface{}]()

	// call PopulatePluginsCache
	plugins.PopulatePluginsCache("", "", "", ch)

	// check if the plugin refresh key is set to false
	pluginRefresh, err := ch.Get(context.Background(), plugins.PluginRefreshKey)
	require.NoError(t, err)

	pluginRefreshBool, ok := pluginRefresh.(bool)
	require.True(t, ok)
	require.False(t, pluginRefreshBool)

	// check if the plugin list key is set
	pluginList, err := ch.Get(context.Background(), plugins.PluginListKey)
	require.NoError(t, err)

	pluginListArr, ok := pluginList.([]string)
	require.True(t, ok)
	require.Empty(t, pluginListArr)
}

func TestCheckHeadlampPluginVersion(t *testing.T) {
	cases := []struct {
		Version         string
		RequiredVersion string
		ShouldExit      bool
	}{
		{"0.7.0", "0.8.0-alpha.10", true},
		{"0.9.0", "0.8.0-alpha.10", false},
		{"0.9.1-alpha.10", "0.8.0-alpha.10", false},
		{"0.8.0", "0.8.0-alpha.10", false},
		{"0.8.0-alpha.10", "0.8.0-alpha.10", false},
	}

	for _, tc := range cases {
		tc := tc // Capture range variable
		t.Run(tc.Version, func(t *testing.T) {
			tempFile, err := createTempPackageJSON(tc.Version, "")
			if err != nil {
				t.Fatalf("could not create temp file: %v", err)
			}
			defer os.Remove(tempFile.Name())

			err = plugins.CheckHeadlampPluginVersion(tempFile.Name(), tc.RequiredVersion)

			if (err != nil && !tc.ShouldExit) || (err == nil && tc.ShouldExit) {
				t.Errorf("for version %s and required version %s, expected exit: %v, got error: %v",
					tc.Version,
					tc.RequiredVersion,
					tc.ShouldExit,
					err)
			}
		})
	}
}

// Helper function to create temporary package.json files.
func createTempPackageJSON(version string, packageJSONPath string) (*os.File, error) {
	content := map[string]interface{}{
		"devDependencies": map[string]string{
			"@kinvolk/headlamp-plugin": version,
		},
	}

	var file *os.File

	var err error

	if packageJSONPath == "" {
		file, err = os.CreateTemp("", "package.json")
		if err != nil {
			return nil, err
		}
	} else {
		file, err = os.Create(packageJSONPath)
		if err != nil {
			return nil, err
		}
	}

	data, err := json.Marshal(content)
	if err != nil {
		return nil, err
	}

	if _, err := file.Write(data); err != nil {
		return nil, err
	}

	if err := file.Close(); err != nil {
		return nil, err
	}

	return file, nil
}
