#!/usr/bin/env node

'use strict';

const webpack = require('webpack');
const config = require('../config/webpack.config');
const fs = require('fs-extra');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const envPaths = require('env-paths');
const path = require('path');
const child_process = require('child_process');
const validate = require('validate-npm-package-name');
const yargs = require('yargs/yargs');
const headlampPluginPkg = require('../package.json');

/**
 * Creates a new plugin folder.
 *
 * Copies the files within template, and modifies a couple.
 * Then runs npm install inside of the folder.
 *
 * @param {string} name - name of package and output folder.
 * @param {bool} link - if we link @kinvolk/headlamp-plugin for testing
 * @returns {0 | 1 | 2 | 3} Exit code, where 0 is success, 1, 2, and 3 are failures.
 */
function create(name, link) {
  const dstFolder = name;
  const templateFolder = path.resolve(__dirname, '..', 'template');
  const indexPath = path.join(dstFolder, 'src', 'index.tsx');
  const packagePath = path.join(dstFolder, 'package.json');

  if (fs.existsSync(name)) {
    console.error(`"${name}" already exists, not initializing`);
    return 1;
  }

  const nameValid = validate(name);
  if (!nameValid.validForNewPackages) {
    console.error(`Invalid package name:"${name}":, not initializing`);
    console.error(nameValid.errors);
    return 2;
  }

  console.log(`Creating folder :${dstFolder}:`);

  fs.copySync(templateFolder, dstFolder, { errorOnExist: true, overwrite: false });

  function replaceFileVariables(path) {
    fs.writeFileSync(
      path,
      fs
        .readFileSync(path, 'utf8')
        .split('$${name}')
        .join(name)
        .split('$${headlamp-plugin-version}')
        .join(headlampPluginPkg.version)
    );
  }

  replaceFileVariables(packagePath);
  replaceFileVariables(indexPath);

  // This can be used to make testing locally easier.
  if (link) {
    console.log('Linking @kinvolk/headlamp-plugin');
    child_process.spawnSync('npm', ['link', '@kinvolk/headlamp-plugin'], { cwd: dstFolder });
  }

  console.log('Installing dependencies...');
  // Run npm install.
  try {
    child_process.execSync('npm install', {
      stdio: 'inherit',
      cwd: dstFolder,
      encoding: 'utf8',
    });
  } catch (e) {
    console.error(`Problem running npm install inside of "${dstFolder}"`);
    return 3;
  }

  // This can be used to make testing locally easier.
  if (link) {
    // Seems to require linking again with npm 7+
    console.log('Linking @kinvolk/headlamp-plugin');
    child_process.spawnSync('npm', ['link', '@kinvolk/headlamp-plugin'], { cwd: dstFolder });
  }

  console.log(`"${dstFolder}" created.`);
  console.log(`1) Run the Headlamp app (so the plugin can be used).`);
  console.log(`2) Open ${dstFolder}/src/index.tsx in your editor.`);
  console.log(`3) Start development server of the plugin watching for plugin changes.`);
  console.log(`  cd "${dstFolder}"\n  npm run start`);
  console.log(`4) See the plugin inside Headlamp.`);

  return 0;
}

/**
 * Copies the built plugin to the app config folder ~/.config/Headlamp/plugins/
 */
function copyToPluginsFolder(config) {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

  // @todo: should the whole package name be used here,
  //    and the load be fixed to use? What about namespace packages?
  const packageName = packageJson.name.split('/').splice(-1)[0];
  const paths = envPaths('Headlamp', { suffix: '' });
  const configDir = fs.existsSync(paths.data) ? paths.data : paths.config;

  config.plugins = [
    new FileManagerPlugin({
      events: {
        onEnd: {
          copy: [
            {
              source: './dist/*',
              destination: path.join(configDir, 'plugins', packageName),
            },
          ],
        },
      },
    }),
  ];
}

/**
 * Compile and show any warnings + errors
 */
function compile(err, stats) {
  if (err && err.message) {
    console.log(err);
    return;
  }
  if (stats && stats.compilation) {
    const printList = {
      Warnings: stats.compilation.warnings,
      Errors: stats.compilation.errors,
    };

    Object.entries(printList).forEach(([key, value]) => {
      if (value.length === 0) {
        return;
      }

      console.log(`${key}:\n`);
      for (const item of value) {
        console.log(item);
        console.log('\n');
      }
    });
  }
}

/**
 * extract copies folders of packages in the form:
 *   packageName/dist/main.js to packageName/main.js
 *
 * @param {string} pluginPackagesPath - can be a package or a folder of packages.
 * @param {string} outputPlugins - folder where the plugins are placed.
 * @returns {0 | 1} Exit code, where 0 is success, 1 is failure.
 */
function extract(pluginPackagesPath, outputPlugins) {
  if (!fs.existsSync(pluginPackagesPath)) {
    console.error(`"${pluginPackagesPath}" does not exist. Not extracting.`);
    return 1;
  }
  if (!fs.existsSync(outputPlugins)) {
    console.log(`"${outputPlugins}" did not exist, making folder.`);
    fs.mkdirSync(outputPlugins);
  }

  function copyFiles(plugName, inputMainJs, mainjs) {
    if (!fs.existsSync(plugName)) {
      console.log(`Making output folder "${plugName}".`);
      fs.mkdirSync(plugName, true);
    }

    console.log(`Copying "${inputMainJs}" to "${mainjs}".`);
    fs.copyFileSync(inputMainJs, mainjs);
  }

  /**
   * pluginPackagesPath is a package folder, not a folder of packages.
   */
  function extractPackage() {
    if (fs.existsSync(path.join(pluginPackagesPath, 'dist', 'main.js'))) {
      const trimmedPath =
        pluginPackagesPath.slice(-1) === path.sep
          ? pluginPackagesPath.slice(0, -1)
          : pluginPackagesPath;
      const folderName = trimmedPath.split(path.sep).splice(-1)[0];
      const plugName = path.join(outputPlugins, folderName);
      const mainjs = path.join(plugName, 'main.js');
      const inputMainJs = path.join(pluginPackagesPath, 'dist', 'main.js');
      copyFiles(plugName, inputMainJs, mainjs);
      return true;
    }
    return false;
  }

  function extractFolderOfPackages() {
    const folders = fs.readdirSync(pluginPackagesPath, { withFileTypes: true }).filter(fileName => {
      return (
        fileName.isDirectory() &&
        fs.existsSync(path.join(pluginPackagesPath, fileName.name, 'dist', 'main.js'))
      );
    });

    folders.forEach(folder => {
      const plugName = path.join(outputPlugins, folder.name);
      const mainjs = path.join(plugName, 'main.js');
      const inputMainJs = path.join(pluginPackagesPath, folder.name, 'dist', 'main.js');
      copyFiles(plugName, inputMainJs, mainjs);
    });
    return folders.length !== 0;
  }

  if (!(extractPackage() || extractFolderOfPackages())) {
    console.error(`"${pluginPackagesPath}" does not contain packages. Not extracting.`);
  }

  return 0;
}

/**
 * Start watching for changes, and build again if there are changes.
 * @returns {0} Exit code, where 0 is success.
 */
function start() {
  console.log('Watching for changes to plugin...');
  config.watch = true;
  config.mode = 'development';
  process.env['BABEL_ENV'] = 'development';
  copyToPluginsFolder(config);
  webpack(config, compile);

  return 0;
}

/**
 * Build the plugin package or folder of packages for production.
 *
 * @param packageFolder {string} - folder where the package, or folder of packages is.
 * @returns {0 | 1} Exit code, where 0 is success, 1 is failure.
 */
function build(packageFolder) {
  if (!fs.existsSync(packageFolder)) {
    console.error(`"${packageFolder}" does not exist. Not building.`);
    return 1;
  }

  const oldCwd = process.cwd();
  const oldBabelEnv = process.env['BABEL_ENV'];
  process.env['BABEL_ENV'] = 'production';

  function buildPackage(folder) {
    if (!fs.existsSync(path.join(folder, 'package.json'))) {
      return false;
    }

    process.chdir(folder);
    console.log(`Building "${folder}" for production...`);
    webpack(config, compile);
    console.log(`Done building: "${folder}".`);
    process.chdir(oldCwd);
    return true;
  }

  function buildFolderOfPackages() {
    const folders = fs.readdirSync(packageFolder, { withFileTypes: true }).filter(fileName => {
      return (
        fileName.isDirectory() &&
        fs.existsSync(path.join(packageFolder, fileName.name, 'package.json'))
      );
    });

    folders.forEach(folder => {
      const folderToBuild = path.join(packageFolder, folder.name);
      if (!buildPackage(folderToBuild)) {
        console.error(`"${folderToBuild}" does not contain a package. Not building.`);
      }
    });
    return folders.length !== 0;
  }

  if (!(buildPackage(packageFolder) || buildFolderOfPackages())) {
    console.error(`"${packageFolder}" does not contain a package or packages. Not building.`);
  }

  process.env['BABEL_ENV'] = oldBabelEnv;

  return 0;
}

/**
 * Format code with prettier.
 *
 * @param packageFolder {string} - folder where the package is.
 * @returns {0 | 1} Exit code, where 0 is success, 1 is failure.
 */
function format(packageFolder) {
  try {
    child_process.execSync('prettier --config package.json --write src', {
      stdio: 'inherit',
      cwd: packageFolder,
      encoding: 'utf8',
    });
  } catch (e) {
    console.error(`Problem running prettier inside of "${packageFolder}"`);
    return 1;
  }

  return 0;
}

/**
 * Lint code with eslint.
 *
 * @param packageFolder {string} - folder where the package is.
 * @param fix {boolean} - automatically fix problems.
 * @returns {0 | 1} Exit code, where 0 is success, 1 is failure.
 */
function lint(packageFolder, fix) {
  try {
    const extra = fix ? ' --fix' : '';
    child_process.execSync('eslint -c package.json --ext .js,.ts,.tsx src/' + extra, {
      stdio: 'inherit',
      cwd: packageFolder,
      encoding: 'utf8',
    });
  } catch (e) {
    console.error(`Problem running eslint inside of "${packageFolder}"`);
    return 1;
  }

  return 0;
}

yargs(process.argv.slice(2))
  .command(
    'build [package]',
    'Build the plugin, or folder of plugins. ' + '<package> defaults to current working directory.',
    yargs => {
      yargs.positional('package', {
        describe: 'Package or folder of packages to build',
        type: 'string',
        default: '.',
      });
    },
    argv => {
      process.exitCode = build(argv.package);
    }
  )
  .command('start', 'Watch for changes and build plugin', {}, () => {
    process.exitCode = start();
  })
  .command(
    'create <name>',
    'Create a new plugin folder',
    yargs => {
      yargs
        .positional('name', {
          describe: 'Name of package',
          type: 'string',
        })
        .option('link', {
          describe:
            'For development of headlamp-plugin itself, so it uses npm link @kinvolk/headlamp-plugin.',
          type: 'boolean',
        });
    },
    argv => {
      process.exitCode = create(argv.name, argv.link);
    }
  )
  .command(
    'extract <pluginPackages> <outputPlugins>',
    'Copies folders of packages from pluginPackages/packageName/dist/main.js ' +
      'to outputPlugins/packageName/main.js',
    yargs => {
      yargs.positional('pluginPackages', {
        describe:
          'A folder of plugin packages that have been built with dist/main.js in them.' +
          'Can also be a single package folder.',
        type: 'string',
      });
      yargs.positional('outputPlugins', {
        describe:
          'A plugins folder (eg. ".plugins") to extract plugins to. ' +
          'The output is a series of packageName/main.js. ' +
          'Creates this folder if it does not exist.',
        type: 'string',
      });
    },
    argv => {
      process.exitCode = extract(argv.pluginPackages, argv.outputPlugins);
    }
  )
  .command(
    'format [package]',
    'format the plugin code with prettier. ' + '<package> defaults to current working directory.',
    yargs => {
      yargs.positional('package', {
        describe: 'Package to code format',
        type: 'string',
        default: '.',
      });
    },
    argv => {
      process.exitCode = format(argv.package);
    }
  )
  .command(
    'lint [package]',
    'Lint the plugin for coding issues with eslint. ' +
      '<package> defaults to current working directory.',
    yargs => {
      yargs
        .positional('package', {
          describe: 'Package to lint',
          type: 'string',
          default: '.',
        })
        .option('fix', {
          describe: 'Automatically fix problems',
          type: 'boolean',
        });
    },
    argv => {
      process.exitCode = lint(argv.package);
    }
  )
  .demandCommand(1, '')
  .strict()
  .help().argv;
