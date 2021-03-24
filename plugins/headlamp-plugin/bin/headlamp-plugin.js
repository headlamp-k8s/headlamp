#!/usr/bin/env node

'use strict';

const webpack = require('webpack');
const config = require('../config/webpack.config');
const fs = require('fs-extra');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const envPaths = require('env-paths');
const path = require('path');
const child_process = require('child_process');
const validate = require("validate-npm-package-name");
const yargs = require('yargs/yargs');

/**
 * Initializes a new plugin folder.
 *
 * Copies the files within template, and modifies a couple.
 * Then runs npm install inside of the folder.
 * 
 * @param {string} name - name of package and output folder.
 */
function init(name) {
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


  fs.copySync(templateFolder, dstFolder, {errorOnExist: true, overwrite: false});

  function replaceFileVariables(path) {
    fs.writeFileSync(
      path,
      fs.readFileSync(path, 'utf8').split('$${name}').join(name)
    )
  }

  replaceFileVariables(packagePath);
  replaceFileVariables(indexPath);

  // This can be used to make testing locally easier.
  // const proc1 = child_process.spawnSync('npm', ['link', '@kinvolk/headlamp-plugin'], {cwd: dstFolder});

  // Run npm install.
  const proc = child_process.spawnSync('npm', ['install'], {cwd: dstFolder});
  process.stdout.write(proc.stdout);
  process.stderr.write(proc.stderr);
  if (proc.status !== 0) {
    console.error(`Problem running npm install inside of "${dstFolder}"`);
    return 3;
  }

  console.log(`"${dstFolder}" created. Run the Headlamp app and:`);
  console.log(`cd "${dstFolder}" ; npm run start`);

  return 0;
}

/**
 * Copies the built plugin to the app config folder ~/.config/Headlamp/plugins/
 */
function copyToPluginsFolder(config) {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))

  // @todo: should the whole package name be used here, 
  //    and the load be fixed to use? What about namespace packages?
  const packageName = packageJson.name.split('/').splice(-1)[0];
  const paths = envPaths('Headlamp', {suffix: ''});

  config.plugins = [
    new FileManagerPlugin({
      events: {
        onEnd: {
          copy: [{
            source: './dist/*',
            destination: `${paths.config}/plugins/${packageName}/`,
          }],
        },
      }
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
      'Warnings': stats.compilation.warnings,
      'Errors': stats.compilation.errors,
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
};

/**
 * Copies folders of packages in the form: packageName/dist/main.js to packageName/main.js
 * 
 * @returns exit code 0 on success, 1 or 2 on failure.
 */
function extract(pluginPackagesPath, outputPlugins) {
  if (!fs.existsSync(pluginPackagesPath)) {
    console.error(`"${pluginPackagesPath}" does not exist. Not extracting.`);
    return 1;
  }
  if (!fs.existsSync(outputPlugins)) {
    console.log(`"${outputPlugins}" did not exist.`);
    fs.mkdirSync(outputPlugins);
  }

  function copyFiles(plugName, inputMainJs, mainjs) {
    if(!fs.existsSync(plugName)) {
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
      const trimmedPath = (
        pluginPackagesPath.slice(-1) == path.sep ? 
        pluginPackagesPath.slice(0,-1) :
        pluginPackagesPath
      );
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
    const folders = fs.readdirSync(pluginPackagesPath, { withFileTypes: true })
      .filter(fileName => {
      return (
        fileName.isDirectory() &&
        fs.existsSync(path.join(pluginPackagesPath, fileName.name, 'dist', 'main.js'))
      );
    });

    folders.forEach((folder) => {
      const plugName = path.join(outputPlugins, folder.name);
      const mainjs = path.join(plugName, 'main.js');
      const inputMainJs = path.join(pluginPackagesPath, folder.name, 'dist', 'main.js');
      copyFiles(plugName, inputMainJs, mainjs);
    });
    return folders.length !== 0;
  }

  if (!(extractPackage() || extractFolderOfPackages())) {
    console.error(`"${pluginPackagesPath}" does not contain packages. Not extracting.`);
  };

  return 0;
}


const argv = yargs(process.argv.slice(2))
  .command('build', 'Build the plugin', {}, (argv) => {
    process.env['BABEL_ENV'] = 'production';
    copyToPluginsFolder(config);
    webpack(config, compile);
  })
  .command('start', 'Watch for changes and build plugin', {}, (argv) => {
    config.watch = true;
    config.mode = 'development';
    process.env['BABEL_ENV'] = 'development';
    copyToPluginsFolder(config);
    webpack(config, compile);
  })
  .command('create <name>', 'Create a new plugin folder', (yargs) => {
    yargs.positional('name', {
      describe: 'Name of package',
      type: 'string',
    })
  }, (argv) => {
    process.exitCode = init(argv.name);
  })
  .command(
    'extract <pluginPackages> <outputPlugins>',
    ('Copies folders of packages from pluginPackages/packageName/dist/main.js ' +
     'to outputPlugins/packageName/main.js'),
    (yargs) => {
    yargs.positional('pluginPackages', {
      describe: (
        'A folder of plugin packages that have been built with dist/main.js in them.' +
        'Can also be a single package folder.'
      ),
      type: 'string',
    })
    yargs.positional('outputPlugins', {
      describe: (
        'A plugins folder (eg. ".plugins") to extract plugins to. ' +
        'The output is a series of packageName/main.js. ' +
        'Creates this folder if it does not exist.'
      ),
      type: 'string',
    })
  }, (argv) => {
    process.exitCode = extract(argv.pluginPackages, argv.outputPlugins);
  })
  .demandCommand(1, '')
  .strict()
  .help()
  .argv
