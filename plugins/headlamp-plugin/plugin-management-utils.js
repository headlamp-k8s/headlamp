const { table, getBorderCharacters } = require('table');
const tar = require('tar');
const zlib = require('zlib');
const envPaths = require('env-paths');
const fs = require('fs-extra');
const path = require('path');
const fetch = require('node-fetch').default;
const crypto = require('crypto');
const stream = require('stream');
const semver = require('semver');

/**
 * Returns the default directory where Headlamp plugins are installed.
 * If the data path exists, it is used as the base directory.
 * Otherwise, the config path is used as the base directory.
 * The 'plugins' subdirectory of the base directory is returned.
 *
 * @returns {string} The path to the default plugins directory.
 */
function defaultPluginsDir() {
  const paths = envPaths('Headlamp', { suffix: '' });
  const configDir = fs.existsSync(paths.data) ? paths.data : paths.config;
  return path.join(configDir, 'plugins');
}

/**
 * Checks if a given folder is a valid Headlamp plugin folder.
 * A valid plugin folder must exist, contain 'main.js' and 'package.json' files,
 * and the 'package.json' file must have 'isManagedByHeadlampPlugin' set to true.
 *
 * @param {string} folder - The path to the folder to check.
 * @returns {boolean} True if the folder is a valid Headlamp plugin folder, false otherwise.
 */
function checkValidPluginFolder(folder) {
  if (!fs.existsSync(folder)) {
    return false;
  }
  // Check if the folder contains main.js and package.json
  const mainJsPath = path.join(folder, 'main.js');
  const packageJsonPath = path.join(folder, 'package.json');
  if (!fs.existsSync(mainJsPath) || !fs.existsSync(packageJsonPath)) {
    return false;
  }

  // Read package.json and check isManagedByHeadlampPlugin is set to true
  const packageJSON = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  if (packageJSON.isManagedByHeadlampPlugin) {
    return true;
  }
  return false;
}

/**
 * Lists all valid plugins in a given folder.
 * The function returns an array of objects, each representing a plugin.
 * Each object contains the plugin name, version, folder name, Artifact Hub URL, repository name, and Artifact Hub version.
 *
 * @param {string} folder - The path to the folder to list plugins from.
 * @returns {Array} An array of objects, each representing a valid plugin in the given folder.
 */
function listPlugins(folder) {
  const pluginsData = [];

  // Read all entries in the specified folder
  const entries = fs.readdirSync(folder, { withFileTypes: true });

  // Filter out directories (plugins)
  const pluginFolders = entries.filter(entry => entry.isDirectory());

  // Iterate through each plugin folder
  for (const pluginFolder of pluginFolders) {
    const pluginDir = path.join(folder, pluginFolder.name);

    if (checkValidPluginFolder(pluginDir)) {
      // Read package.json to get the plugin name and version
      const packageJsonPath = path.join(pluginDir, 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const pluginName = packageJson.name || pluginFolder.name;
      const pluginTitle = packageJson.artifacthub.title;
      const pluginVersion = packageJson.version || null;
      const artifacthubURL = packageJson.artifacthub ? packageJson.artifacthub.url : null;
      const repoName = packageJson.artifacthub ? packageJson.artifacthub.repoName : null;
      const artifacthubVersion = packageJson.artifacthub ? packageJson.artifacthub.version : null;
      // Store plugin data (folder name and plugin name)
      pluginsData.push({
        pluginName,
        pluginTitle,
        pluginVersion,
        folderName: pluginFolder.name,
        artifacthubURL: artifacthubURL,
        repoName: repoName,
        artifacthubVersion: artifacthubVersion,
      });
    }
  }

  return pluginsData;
}

/**
 * Handles the list command for plugins.
 * It lists all valid plugins in a given folder and outputs them either in JSON format or as a formatted table.
 * The function prints an array of objects, each representing a plugin.
 * Each object contains the plugin name, version, folder name, and Artifact Hub URL.
 *
 * @param {string} folder - The path to the folder to list plugins from.
 * @param {boolean} jsonOutput - If true, the output will be in JSON format. If false, the output will be a formatted table.
 */
function handleListCommand(folder, jsonOutput = false) {
  const pluginsData = listPlugins(folder);

  if (jsonOutput) {
    console.log(JSON.stringify(pluginsData, null, 2));
  } else {
    const formattedTable = table(
      [
        ['Name', 'Title','Version', 'Folder Name', 'ArtifaceHub URL'],
        ...pluginsData.map(plugin => [
          plugin.pluginName,
          plugin.pluginTitle,
          plugin.pluginVersion || 'N/A',
          plugin.folderName,
          plugin.artifacthubURL || 'N/A',
        ]),
      ],
      {
        border: getBorderCharacters('void'),
      }
    );
    console.log(formattedTable);
  }
}

/**
 * Downloads a tarball from a given URL, verifies its checksum, and extracts it to a target path.
 * The function throws an error if the download fails, if the content type of the response is not 'application/octet-stream',
 * or if the checksum of the downloaded tarball does not match the expected checksum.
 *
 * @param {string} url - The URL to download the tarball from.
 * @param {string} expectedChecksum - The expected SHA256 checksum of the tarball.
 * @param {string} targetPath - The path to extract the tarball to.
 * @throws {Error} If the download fails, if the content type of the response is not 'application/octet-stream',
 * or if the checksum of the downloaded tarball does not match the expected checksum.
 * @returns {Promise} A promise that resolves when the tarball has been downloaded and extracted, or rejects if an error occurs.
 */
async function downloadTarball(url, expectedChecksum, targetPath) {
  // create target folder if it doesn't exist
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
  }

  const response = await fetch(url, { redirect: 'follow' });
  if (!response.ok) {
    throw new Error(`Failed to download tarball. Status code: ${response.status}`);
  }

  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/octet-stream')) {
    throw new Error(`Unexpected content type: ${contentType}`);
  }

  const chunks = [];
  let bufferLength = 0;

  for await (const chunk of response.body) {
    chunks.push(chunk);
    bufferLength += chunk.length;
  }

  const buffer = Buffer.concat(chunks, bufferLength);

  // Check the checksum
  const actualChecksum = crypto.createHash('sha256').update(buffer).digest('hex');
  if (actualChecksum !== expectedChecksum) {
    throw new Error('Checksum mismatch');
  }

  const bufferStream = new stream.PassThrough();
  bufferStream.end(buffer);

  const respStream = bufferStream
    .pipe(zlib.createGunzip())
    .pipe(tar.x({ C: targetPath, strip: 1, sync: true }));

  await new Promise((resolve, reject) => {
    respStream.on('finish', resolve);
    respStream.on('error', reject);
  });
}

/**
 * Downloads and installs a plugin.
 * The function downloads a tarball from a given URL, verifies its checksum, and extracts it to a target path.
 * It also checks if the Headlamp version is compatible with the plugin version.
 * If the download fails, if the content type of the response is not 'application/octet-stream',
 * or if the checksum of the downloaded tarball does not match the expected checksum, an error is thrown.
 * After the tarball is extracted, the function updates the 'package.json' file of the plugin with metadata.
 *
 * @param {Object} pluginData - The data of the plugin to download and install.
 * @param {string} headlampVersion - The version of Headlamp.
 * @param {string} folder - The path to the folder to install the plugin to.
 * @param {boolean} jsonOutput - If true, the output will be in JSON format. If false, the output will be a formatted table.
 * @throws {Error} If the download fails, if the content type of the response is not 'application/octet-stream',
 * or if the checksum of the downloaded tarball does not match the expected checksum.
 * @returns {Promise} A promise that resolves when the plugin has been downloaded and installed, or rejects if an error occurs.
 */
async function downloadAndInstall(pluginData, headlampVersion, folder, jsonOutput) {
  const pluginName = pluginData.name;
  const archiveURL = pluginData.data['headlamp/plugin/archive-url'];
  let checksum = pluginData.data['headlamp/plugin/archive-checksum'];
  if (!archiveURL || !checksum) {
    throw new Error('Invalid plugin metadata. Please check the plugin details.');
  }
  if (checksum.startsWith('sha256:') || checksum.startsWith('SHA256:')) {
    checksum = checksum.replace('sha256:', '');
    checksum = checksum.replace('SHA256:', '');
  }

  // If headlampVersion is provided, check compatibility
  if (headlampVersion) {
    if (jsonOutput) {
      console.log(
        JSON.stringify({
          status: 'info',
          message: 'Checking headlamp version compatibility',
        })
      );
    }
    if (semver.satisfies(headlampVersion, pluginData.data['headlamp/plugin/version-compat'])) {
      if (jsonOutput) {
        console.log(
          JSON.stringify({
            status: 'info',
            message: 'Headlamp version is compatible with the plugin',
          })
        );
      } else {
        console.log('Headlamp version is compatible with the plugin');
      }
    } else {
      throw new Error('Headlamp version is not compatible with the plugin');
    }
  }

  try {
    // Create the target folder if it doesn't exist
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    // Download the tarball and extract it to the specified folder
    const pluginDir = path.join(folder, pluginName);

    if (jsonOutput) {
      console.log(
        JSON.stringify({
          status: 'info',
          message: 'Downloading plugin tarball',
        })
      );
    }

    await downloadTarball(archiveURL, checksum, pluginDir);
  } catch (err) {
    throw new Error(`Failed to download and extract the plugin tarball,${err}`);
  }

  if (jsonOutput) {
    console.log(
      JSON.stringify({
        status: 'info',
        message: 'Updating package.json with metadata',
      })
    );
  }
  // Add artifacthub metadata to the plugins package.json
  const packageJsonPath = path.join(folder, pluginName, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  packageJson.artifacthub = {
    name: pluginName,
    title: pluginData.display_name,
    url: `https://artifacthub.io/packages/headlamp/${pluginData.repository.name}/${pluginName}`,
    version: pluginData.version,
    repoName: pluginData.repository.name,
  };
  packageJson.isManagedByHeadlampPlugin = true;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

/**
 * Fetches the metadata of a plugin from Artifact Hub.
 *
 * @param {string} url - The URL of the plugin on Artifact Hub.
 * @throws {Error} If the response is not OK.
 * @returns {Promise<Object>} A promise that resolves to the metadata of the plugin as a JSON object.
 */
async function fetchPluginMetadata(url) {
  const apiURL = url.replace(
    'https://artifacthub.io/packages/headlamp/',
    'https://artifacthub.io/api/v1/packages/headlamp/'
  );
  const response = await fetch(apiURL);
  if (!response.ok) {
    throw new Error(`Failed to fetch plugin metadata. Status code: ${response.status}`);
  }
  return await response.json();
}

/**
 * Handles the install command for plugins.
 * The function checks if the given URL is a valid ArtifactHub URL, fetches the plugin metadata from the URL,
 * and downloads and installs the plugin.
 * If the URL is not valid, or if an error occurs during the fetching, downloading, or installing of the plugin, an error is thrown.
 * The function outputs the status and messages of the operation in either JSON format or as plain text, depending on the jsonOutput argument.
 *
 * @param {Object} argv - The arguments passed to the command.
 * @param {string} argv.URL - The URL of the plugin on ArtifactHub.
 * @param {string} argv.folder - The path to the folder to install the plugin to.
 * @param {boolean} argv.json - If true, the output will be in JSON format. If false, the output will be plain text.
 * @param {string} argv.headlampVersion - The version of Headlamp.
 * @throws {Error} If the URL is not valid, or if an error occurs during the fetching, downloading, or installing of the plugin.
 */
async function handleInstallCommand(argv) {
  const URL = argv.URL;
  const folder = argv.folder;
  const jsonOutput = argv.json;

  try {
    // check if the URL is a valid artifacthub URL
    if (!URL.startsWith('https://artifacthub.io/packages/headlamp/')) {
      throw new Error('Invalid URL. Please provide a valid URL from ArtifactHub.');
    }

    // fetch the plugin metadata from the URL
    if (jsonOutput) {
      console.log(
        JSON.stringify({
          status: 'info',
          message: 'Fetching plugin metadata',
        })
      );
    }
    const pluginData = await fetchPluginMetadata(URL);

    await downloadAndInstall(pluginData, argv.headlampVersion, folder, jsonOutput);

    if (jsonOutput) {
      console.log(
        JSON.stringify({
          status: 'success',
          message: 'Plugin installed successfully',
        })
      );
    } else {
      console.log('Plugin installed successfully');
    }
    process.exitCode = 0;
  } catch (err) {
    if (jsonOutput) {
      console.log(
        JSON.stringify({
          status: 'error',
          message: err.message,
        })
      );
    } else {
      console.error('Error:', err.message);
    }
    process.exitCode = 1;
  }
}

/**
 * Handles the uninstall command for plugins.
 * The function finds the plugin by name in the given folder, checks if the plugin is valid, and deletes the plugin folder.
 * If the plugin is not found, or if the plugin is not valid, an error is thrown.
 * The function outputs the status and messages of the operation in either JSON format or as plain text, depending on the jsonOutput argument.
 *
 * @param {Object} argv - The arguments passed to the command.
 * @param {string} argv.name - The name of the plugin to uninstall.
 * @param {string} argv.folder - The path to the folder to uninstall the plugin from.
 * @param {boolean} argv.json - If true, the output will be in JSON format. If false, the output will be plain text.
 * @throws {Error} If the plugin is not found, or if the plugin is not valid.
 * @returns {number} Returns 1 if an error occurred, otherwise nothing.
 */
function handleUninstallCommand(argv) {
  // find the plugin folder name by plugin name
  const name = argv.name;
  const folder = argv.folder;
  try {
    const pluginsData = listPlugins(folder);
    const pluginInfo = pluginsData.find(plugin => plugin.pluginName === name);
    if (!pluginInfo) {
      throw new Error(`The plugin '${name}' is not installed in the folder '${folder}'.`);
    }

    const pluginDir = path.join(folder, pluginInfo.folderName);
    if (checkValidPluginFolder(pluginDir)) {
      // Delete the plugin folder
      fs.rmSync(pluginDir, {
        recursive: true,
        force: true,
      });
      if (argv.json) {
        console.log(
          JSON.stringify({
            status: 'success',
            message: `The plugin '${name}' has been uninstalled successfully`,
          })
        );
      } else {
        console.log(`The plugin '${name}' has been uninstalled successfully`);
      }
    } else {
      throw new Error(`The ${folder}/${name} is not a plugin".`);
    }
  } catch (err) {
    if (argv.json) {
      console.log(
        JSON.stringify({
          status: 'error',
          message: err.message,
        })
      );
    } else {
      console.error('Error:', err.message);
    }
    return 1;
  }
}

/**
 * Handles the update command for plugins.
 * The function finds the plugin by name in the given folder, checks if the plugin is valid, and updates the plugin if a newer version is available.
 * If the plugin is not found, or if the plugin is not valid, or if the plugin is already up to date, an error is thrown.
 * The function outputs the status and messages of the operation in either JSON format or as plain text, depending on the jsonOutput argument.
 *
 * @param {Object} argv - The arguments passed to the command.
 * @param {string} argv.name - The name of the plugin to update.
 * @param {string} argv.folder - The path to the folder to update the plugin in.
 * @param {boolean} argv.json - If true, the output will be in JSON format. If false, the output will be plain text.
 * @param {string} argv.headlampVersion - The version of Headlamp.
 * @throws {Error} If the plugin is not found, or if the plugin is not valid, or if the plugin is already up to date.
 * @returns {Promise<number>} A promise that resolves to 0 if the plugin was updated successfully, or 1 if an error occurred.
 */
async function handleUpdateCommand(argv) {
  const name = argv.name;
  const folder = argv.folder;
  try {
    const pluginsList = listPlugins(folder);
    const pluginInfo = pluginsList.find(plugin => plugin.pluginName === name);
    if (!pluginInfo) {
      throw new Error(`The plugin "${name}" is not installed in the folder "${folder}".`);
    }

    // read the package.json of the plugin
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(folder, pluginInfo.folderName, 'package.json'), 'utf8')
    );

    const pluginData = await fetchPluginMetadata(packageJson.artifacthub.url);

    const latestPluginVersion = pluginData.version;
    const currentPluginVersion = packageJson.artifacthub.version;

    // semver comparison
    if (semver.lte(latestPluginVersion, currentPluginVersion)) {
      throw new Error(`The plugin "${name}" is already up to date.`);
    }

    await downloadAndInstall(pluginData, argv.headlampVersion, folder, argv.json);
    if (argv.json) {
      console.log(
        JSON.stringify({
          status: 'success',
          message: `The plugin "${name}" has been updated successfully`,
        })
      );
    } else {
      console.log(`The plugin "${name}" has been updated successfully`);
    }
    return 0;
  } catch (err) {
    if (argv.json) {
      console.log(
        JSON.stringify({
          status: 'error',
          message: err.message,
        })
      );
    } else {
      console.error('Error:', err.message);
    }
    return 1;
  }
}

const commands = [
  {
    type: 'list',
    description: 'List all installed plugins',
    handler: argv => {
      process.exitCode = handleListCommand(argv.folder, argv.json);
    },
    options: {
      folder: {
        describe: 'Folder to list the plugins',
        type: 'string',
        default: defaultPluginsDir(),
      },
      json: {
        alias: 'j',
        describe: 'Output as JSON',
        type: 'boolean',
        default: false,
      },
    },
  },
  {
    type: 'install [URL]',
    description: 'Install a plugin from artifacthub URL',
    handler: argv => {
      handleInstallCommand(argv).catch(() => {
        process.exitCode = 1;
      });
    },
    positional: {
      URL: {
        describe: 'Artifacthub URL of the plugin to install',
        type: 'string',
      },
    },
    options: {
      folder: {
        describe: 'Folder to install the plugin',
        type: 'string',
        default: defaultPluginsDir(),
      },
      json: {
        alias: 'j',
        describe: 'Output as JSON',
        type: 'boolean',
        default: false,
      },
      headlampVersion: {
        describe: 'Headlamp version to check compatibility',
        type: 'string',
      },
    },
  },
  {
    type: 'uninstall [name]',
    description: 'Uninstall a plugin by name',
    handler: argv => {
      process.exitCode = handleUninstallCommand(argv);
    },
    positional: {
      name: {
        describe: 'Name of the plugin to uninstall',
        type: 'string',
      },
    },
    options: {
      folder: {
        describe: 'Folder to uninstall the plugin',
        type: 'string',
        default: defaultPluginsDir(),
      },
      json: {
        alias: 'j',
        describe: 'Output as JSON',
        type: 'boolean',
        default: false,
      },
    },
  },
  {
    type: 'update [name]',
    description: 'Update a plugin by name',
    handler: argv => {
      process.exitCode = handleUpdateCommand(argv);
    },
    positional: {
      name: {
        describe: 'Name of the plugin to update',
        type: 'string',
      },
    },
    options: {
      folder: {
        describe: 'Folder to update the plugin',
        type: 'string',
        default: defaultPluginsDir(),
      },
      json: {
        alias: 'j',
        describe: 'Output as JSON',
        type: 'boolean',
        default: false,
      },
      headlampVersion: {
        describe: 'Headlamp version to check compatibility',
        type: 'string',
      },
    },
  },
];

/**
 * Adds commands to a yargs instance.
 * The function iterates over an array of commands, and for each command, it adds the command to the yargs instance,
 * adds any positional arguments and options to the command, and sets the command's handler function.
 *
 * @param {Object} yargsInstance - The yargs instance to add commands to.
 */
function addCommands(yargsInstance) {
  commands.forEach(command => {
    yargsInstance.command(
      command.type,
      command.description,
      yargs => {
        // Add positional arguments
        if (command.positional) {
          Object.keys(command.positional).forEach(positionalArg => {
            yargs.positional(positionalArg, command.positional[positionalArg]);
          });
        }
        // Add options
        Object.keys(command.options).forEach(option => {
          yargs.option(option, command.options[option]);
        });
      },
      command.handler
    );
  });
}

module.exports = { addCommands };
