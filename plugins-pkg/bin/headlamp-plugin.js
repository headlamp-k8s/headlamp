#!/usr/bin/env node

'use strict';

const webpack = require('webpack');
const config = require('../config/webpack.config');

webpack(config, (err, stats) => {
  if (err && err.message) {
    console.log(err);
    return;
  }

  for (const item of stats.compilation.warnings) {
    console.log(item);
  }

  for (const item of stats.compilation.errors) {
    console.log(item);
  }
});
