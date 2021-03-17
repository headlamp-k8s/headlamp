#!/usr/bin/env node

'use strict';

const webpack = require('webpack');
const config = require('../config/webpack.config');
const args = require('minimist')(process.argv.slice(2))

if (args['watch']) {
  config.watch = true;
  config.mode = 'development';
  process.env['BABEL_ENV'] = 'development';
} else {
  process.env['BABEL_ENV'] = 'production';
}

// Compile src and show any warnings + errors
webpack(config, (err, stats) => {
  if (err && err.message) {
    console.log(err);
    return;
  }
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
});
