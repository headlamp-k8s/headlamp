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

  // @todo: this is to make testing locally easier. Remove before merge.
  const proc1 = child_process.spawnSync('npm', ['link', '@kinvolk/headlamp-plugin'], {cwd: dstFolder});

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


const argv = yargs(process.argv.slice(2))
  .command('build', 'Build the plugin', {}, (argv) => {
    process.env['BABEL_ENV'] = 'production';
    copyToPluginsFolder(config);
    webpack(config, compile);
  })
  .command('start', 'Watch for changes and build the plugin', {}, (argv) => {
    config.watch = true;
    config.mode = 'development';
    process.env['BABEL_ENV'] = 'development';
    copyToPluginsFolder(config);
    webpack(config, compile);
  })
  .command('init <name>', 'Initialize a new plugin folder with base code', (yargs) => {
    yargs.positional('name', {
      describe: 'Name of package',
      type: 'string',
    })
  }, (argv) => {
    process.exitCode = init(argv.name);
  })
  .help()
  .argv
