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

// defaultPluginsDir returns the default folder in which Headlamp plugins are installed.
function defaultPluginsDir() {
  const paths = envPaths('Headlamp', { suffix: '' });
  const configDir = fs.existsSync(paths.data) ? paths.data : paths.config;
  return path.join(configDir, 'plugins');
}

//
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
      const pluginVersion = packageJson.version || null;
      const artifacthubURL = packageJson.artifacthub ? packageJson.artifacthub.url : null;
      const repoName = packageJson.artifacthub ? packageJson.artifacthub.repoName : null;
      const artifacthubVersion = packageJson.artifacthub ? packageJson.artifacthub.version : null;
      // Store plugin data (folder name and plugin name)
      pluginsData.push({
        pluginName,
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

function handleListCommand(folder, jsonOutput = false) {
  const pluginsData = listPlugins(folder);

  if (jsonOutput) {
    console.log(JSON.stringify(pluginsData, null, 2));
  } else {
    const formattedTable = table(
      [
        ['Plugin Name', 'Version', 'Folder Name', 'ArtifaceHub URL'],
        ...pluginsData.map(plugin => [
          plugin.pluginName,
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
    url: `https://artifacthub.io/packages/headlamp/${pluginData.repository.name}/${pluginName}`,
    version: pluginData.version,
    repoName: pluginData.repository.name,
  };
  packageJson.isManagedByHeadlampPlugin = true;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

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

async function handleInstallCommand(argv) {
  console.log('Fetch is', fetch);
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
