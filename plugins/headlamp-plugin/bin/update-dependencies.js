#!/usr/bin/env node
// @ts-check
'use strict';

// Aids maintenance syncing packages between frontend/ and headlamp-plugin
// Inside headlamp-plugin: `npm run update-dependencies`.

// Some packages are used by headlamp-plugin that are not used by the frontend.
const dependenciesFrontDoesNotHave = new Set([
  '@babel/cli',
  '@babel/core',
  '@babel/plugin-proposal-class-properties',
  '@babel/plugin-transform-react-jsx',
  '@babel/preset-env',
  '@babel/preset-react',
  '@babel/preset-typescript',
  '@remix-run/router',
  '@svgr/webpack',
  'babel-loader',
  'css-loader',
  'env-paths',
  'eslint-plugin-jsx-a11y',
  'file-loader',
  'filemanager-webpack-plugin',
  'fs-extra',
  'imports-loader',
  'shx',
  'style-loader',
  'url-loader',
  'validate-npm-package-name',
  'webpack-cli',
  'yargs',
]);

// Dependencies from frontend/ that aren't wanted by headlamp-plugin.
const dependenciesToNotCopy = [
  'husky',
  'typedoc',
  'typedoc-hugo-theme',
  'typedoc-plugin-markdown',
  'typedoc-plugin-rename-defaults',
];

const fs = require('fs-extra');
const headlampPluginPkg = require('../package.json');
const frontendPkg = require('../../../frontend/package.json');

/**
 * Update dependencies from frontend/package.json into headlamp-plugin/packages.json
 *
 * Because frontend/ isn't distributed as a package, we can't just depend on it.
 *
 * @param packageJsonPath {string} where the package.json is
 */
function updateDependencies(packageJsonPath) {
  const allFrontendDependencies = {
    ...frontendPkg.dependencies,
    ...frontendPkg.devDependencies,
  };
  const newDependencies = {
    ...allFrontendDependencies,
    ...headlampPluginPkg.dependencies,
  };
  const headlampPluginPkgOriginal = { ...headlampPluginPkg };

  const sortedDependencies = {};
  Object.keys(newDependencies)
    .sort()
    .forEach(function (key) {
      sortedDependencies[key] = newDependencies[key];
    });

  // @ts-ignore because, the keys change in the dependencies.
  headlampPluginPkg.dependencies = sortedDependencies;

  // Some dependencies from frontend/ aren't wanted.
  for (const packageName of dependenciesToNotCopy) {
    delete headlampPluginPkg.dependencies[packageName];
  }

  // We want to find if packages are removed from frontend/package.json too.
  (function checkRemovedDependencies() {
    // Are any in the output which aren't in the input anymore?
    function keysFromANotInB(a, b) {
      return Object.keys(a).filter(k => !(k in b));
    }

    const notIn = keysFromANotInB(headlampPluginPkg.dependencies, allFrontendDependencies).filter(
      k => !dependenciesFrontDoesNotHave.has(k)
    );

    for (const packageName of notIn) {
      delete headlampPluginPkg.dependencies[packageName];
    }

    if (notIn.length > 0) {
      console.warn(
        'Warning, these dependencies were removed from frontend/ and now also headlamp-plugin/',
        notIn
      );
    }
  })();

  const changed = JSON.stringify(headlampPluginPkgOriginal) !== JSON.stringify(headlampPluginPkg);

  if (changed) {
    console.log(
      'Some frontend/package.json dependencies changed. Writing headlamp-plugin/package.json'
    );
    fs.writeFileSync(packageJsonPath, JSON.stringify(headlampPluginPkg, null, '  ') + '\n');
  } else {
    console.warn(
      'No frontend/package.json dependencies changed. Not writing headlamp-plugin/package.json'
    );
  }
}

updateDependencies('package.json');
