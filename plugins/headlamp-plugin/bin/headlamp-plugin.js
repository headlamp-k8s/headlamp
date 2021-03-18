#!/usr/bin/env node

'use strict';

const webpack = require('webpack');
const config = require('../config/webpack.config');
const args = require('minimist')(process.argv.slice(2))

const fs = require('fs')
const FileManagerPlugin = require('filemanager-webpack-plugin');
const envPaths = require('env-paths');


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

copyToPluginsFolder(config);


if (args['watch']) {
  config.watch = true;
  config.mode = 'development';
  process.env['BABEL_ENV'] = 'development';
} else {
  process.env['BABEL_ENV'] = 'production';
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

webpack(config, compile);
