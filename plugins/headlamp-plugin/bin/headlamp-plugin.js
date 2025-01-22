#!/usr/bin/env node
// @ts-check
'use strict';

const webpack = require('webpack');
const config = require('../config/webpack.config');
const crypto = require('crypto');
const fs = require('fs-extra');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const envPaths = require('env-paths');
const os = require('os');
const path = require('path');
const resolve = path.resolve;
const child_process = require('child_process');
const validate = require('validate-npm-package-name');
const yargs = require('yargs/yargs');
const headlampPluginPkg = require('../package.json');
const PluginManager = require('../plugin-management/plugin-management').PluginManager;
const { table } = require('table');
const tar = require('tar');

/**
 * Creates a new plugin folder.
 *
 * Copies the files within template, and modifies a couple.
 * Then runs npm install inside of the folder.
 *
 * @param {string} name - name of package and output folder.
 * @param {boolean} link - if we link @kinvolk/headlamp-plugin for testing
 * @returns {0 | 1 | 2 | 3} Exit code, where 0 is success, 1, 2, and 3 are failures.
 */
function create(name, link) {
  const dstFolder = name;
  const templateFolder = path.resolve(__dirname, '..', 'template');
  const indexPath = path.join(dstFolder, 'src', 'index.tsx');
  const packagePath = path.join(dstFolder, 'package.json');
  const readmePath = path.join(dstFolder, 'README.md');

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

  fs.copySync(templateFolder, dstFolder, {
    errorOnExist: true,
    overwrite: false,
  });

  function replaceFileVariables(path) {
    fs.writeFileSync(
      path,
      fs
        .readFileSync(path, 'utf8')
        .split('$${name}')
        .join(name)
        .split('$${headlamp-plugin-version}')
        .join(headlampPluginPkg.version)
        .split('$${eslint-config-version}')
        .join(headlampPluginPkg.dependencies['@headlamp-k8s/eslint-config'])
    );
  }

  replaceFileVariables(packagePath);
  replaceFileVariables(indexPath);
  replaceFileVariables(readmePath);

  // This can be used to make testing locally easier.
  if (link) {
    console.log('Linking @kinvolk/headlamp-plugin');
    child_process.spawnSync('npm', ['link', '@kinvolk/headlamp-plugin'], {
      cwd: dstFolder,
    });
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
    console.error(
      `Problem running npm install inside of "${dstFolder}" abs: "${resolve(dstFolder)}"`
    );
    return 3;
  }

  // This can be used to make testing locally easier.
  if (link) {
    // Seems to require linking again with npm 7+
    console.log('Linking @kinvolk/headlamp-plugin');
    child_process.spawnSync('npm', ['link', '@kinvolk/headlamp-plugin'], {
      cwd: dstFolder,
    });
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
 * Compile callback for webpack to show any warnings + errors.
 */
function compileMessages(err, stats) {
  if (err && err.message) {
    console.log(err);
    // This should be a failure.
    return 1;
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

    if (stats.hasErrors()) {
      // This should be a failure.
      return 1;
    }
  }

  return 0;
}

/**
 * extract copies folders of packages in the form:
 *   packageName/dist/main.js to packageName/main.js
 *   packageName/package.json to packageName/package.json
 *
 * @param {string} pluginPackagesPath - can be a package or a folder of packages.
 * @param {string} outputPlugins - folder where the plugins are placed.
 * @param {boolean} logSteps - whether to print the steps of the extraction (true by default).
 * @returns {0 | 1} Exit code, where 0 is success, 1 is failure.
 */
function extract(pluginPackagesPath, outputPlugins, logSteps = true) {
  if (!fs.existsSync(pluginPackagesPath)) {
    console.error(`"${pluginPackagesPath}" does not exist. Not extracting.`);
    return 1;
  }
  if (!fs.existsSync(outputPlugins)) {
    if (logSteps) {
      console.log(`"${outputPlugins}" did not exist, making folder.`);
    }
    fs.mkdirSync(outputPlugins);
  }

  /**
   * pluginPackagesPath is a package folder, not a folder of packages.
   */
  function extractPackage() {
    if (fs.existsSync(path.join(pluginPackagesPath, 'dist', 'main.js'))) {
      const distPath = path.join(pluginPackagesPath, 'dist');
      const trimmedPath =
        pluginPackagesPath.slice(-1) === path.sep
          ? pluginPackagesPath.slice(0, -1)
          : pluginPackagesPath;
      const folderName = trimmedPath.split(path.sep).splice(-1)[0];
      const plugName = path.join(outputPlugins, folderName);

      fs.ensureDirSync(plugName);

      const files = fs.readdirSync(distPath);
      files.forEach(file => {
        const srcFile = path.join(distPath, file);
        const destFile = path.join(plugName, file);
        console.log(`Copying "${srcFile}" to "${destFile}".`);
        fs.copyFileSync(srcFile, destFile);
      });

      const inputPackageJson = path.join(pluginPackagesPath, 'package.json');
      const outputPackageJson = path.join(plugName, 'package.json');
      console.log(`Copying "${inputPackageJson}" to "${outputPackageJson}".`);
      fs.copyFileSync(inputPackageJson, outputPackageJson);

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
      const distPath = path.join(pluginPackagesPath, folder.name, 'dist');
      const plugName = path.join(outputPlugins, folder.name);

      fs.ensureDirSync(plugName);

      const files = fs.readdirSync(distPath);
      files.forEach(file => {
        const srcFile = path.join(distPath, file);
        const destFile = path.join(plugName, file);
        console.log(`Copying "${srcFile}" to "${destFile}".`);
        fs.copyFileSync(srcFile, destFile);
      });

      const inputPackageJson = path.join(pluginPackagesPath, folder.name, 'package.json');
      const outputPackageJson = path.join(plugName, 'package.json');
      console.log(`Copying "${inputPackageJson}" to "${outputPackageJson}".`);
      fs.copyFileSync(inputPackageJson, outputPackageJson);
    });
    return folders.length !== 0;
  }

  if (!(extractPackage() || extractFolderOfPackages())) {
    console.error(`"${pluginPackagesPath}" does not contain packages. Not extracting.`);
    return 1;
  }

  return 0;
}

/**
 * Calculate the checksum of a file.
 *
 * @param {*} filePath
 * @returns
 */
async function calculateChecksum(filePath) {
  try {
    const fileBuffer = await fs.readFile(filePath);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    const hex = hashSum.digest('hex');
    return hex;
  } catch (error) {
    console.error('Error calculating checksum:', error);
    throw error; // Rethrow the error if you want to handle it further up the call stack
  }
}

/**
 * Creates a tarball of the plugin package. The tarball is placed in the outputFolderPath.
 * It moves files from:
 *   packageName/dist/main.js to packageName/main.js
 *   packageName/package.json to packageName/package.json
 * And then creates a tarball of the resulting folder.
 *
 * @param {string} pluginDir - path to the plugin package.
 * @param {string} outputDir - folder where the tarball is placed.
 *
 * @returns {0 | 1} Exit code, where 0 is success, 1 is failure.
 */
async function createArchive(pluginDir, outputDir) {
  const pluginPath = path.resolve(pluginDir);
  if (!fs.existsSync(pluginPath)) {
    console.error(`Error: "${pluginPath}" does not exist. Not creating archive.`);
    return 1;
  }

  // Extract name + version from plugin's package.json
  const packageJsonPath = path.join(pluginPath, 'package.json');
  let packageJson = '';
  try {
    packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  } catch (e) {
    console.error(`Error: Failed to read package.json from "${pluginPath}". Not creating archive.`);
    return 1;
  }

  const sanitizedName = packageJson.name.replace(/@/g, '').replace(/\//g, '-');
  const tarballName = `${sanitizedName}-${packageJson.version}.tar.gz`;

  const outputFolderPath = path.resolve(outputDir);
  const tarballPath = path.join(outputFolderPath, tarballName);

  if (!fs.existsSync(outputFolderPath)) {
    console.log(`"${outputFolderPath}" did not exist, making folder.`);
    fs.mkdirSync(outputFolderPath, { recursive: true });
  } else if (fs.existsSync(tarballPath)) {
    console.error(`Error: Tarball "${tarballPath}" already exists. Not creating archive.`);
    return 1;
  }

  // Create temporary folder
  const tempFolder = fs.mkdtempSync(path.join(os.tmpdir(), 'headlamp-plugin-'));
  if (extract(pluginPath, tempFolder, false) !== 0) {
    console.error(
      `Error: Failed to extract plugin package to "${tempFolder}". Not creating archive.`
    );
    return 1;
  }

  const folderName = path.basename(pluginPath);

  // Create tarball
  await tar.c(
    {
      gzip: true,
      file: tarballPath,
      cwd: tempFolder,
    },
    [folderName]
  );

  // Remove temporary folder
  fs.rmSync(tempFolder, { recursive: true });

  console.log(`Created tarball: "${tarballPath}".`);

  // Print sha256 checksum for convenience
  const checksum = await calculateChecksum(tarballPath);
  console.log(`Tarball checksum (sha256): ${checksum}`);

  return 0;
}

/**
 * Start watching for changes, and build again if there are changes.
 * @returns {number} - Exit code, where 0 is success.
 */
function start() {
  /**
   * Copies the built plugin to the app config folder ~/.config/Headlamp/plugins/
   *
   * Adds a webpack config plugin for copying the folder.
   */
  function copyToPluginsFolder(webpackConfig) {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

    // @todo: should the whole package name be used here,
    //    and the load be fixed to use? What about namespace packages?
    const packageName = packageJson.name.split('/').splice(-1)[0];
    const paths = envPaths('Headlamp', { suffix: '' });
    const configDir = fs.existsSync(paths.data) ? paths.data : paths.config;

    webpackConfig.plugins = [
      new FileManagerPlugin({
        events: {
          onEnd: {
            copy: [
              {
                source: './dist/*',
                destination: path.join(configDir, 'plugins', packageName),
              },
              {
                source: './package.json',
                destination: path.join(configDir, 'plugins', packageName, 'package.json'),
              },
            ],
          },
        },
      }),
    ];
  }

  /**
   * Inform if @kinvolk/headlamp-plugin is outdated.
   */
  async function informIfOutdated() {
    console.log('Checking if @kinvolk/headlamp-plugin is up to date...');
    child_process.exec('npm outdated --json', (error, stdout) => {
      if (error) {
        // npm outdated exit codes 1 when something is not up to date.
        const result = stdout.toString();
        const outdated = JSON.parse(result);
        if ('@kinvolk/headlamp-plugin' in outdated) {
          const url = `https://github.com/headlamp-k8s/headlamp/releases`;
          console.warn(
            '    @kinvolk/headlamp-plugin is out of date. Run the following command to upgrade \n' +
              `    See release notes here: ${url}` +
              '    npx @kinvolk/headlamp-plugin upgrade'
          );
          return;
        }
      }
    });
  }

  setTimeout(() => {
    informIfOutdated().catch(error => {
      console.error('Error checking if @kinvolk/headlamp-plugin is up to date:', error);
    });
  }, 500);

  config.watch = true;
  config.mode = 'development';
  process.env['BABEL_ENV'] = 'development';
  copyToPluginsFolder(config);
  let exitCode = 0;
  webpack(config, (err, stats) => {
    // We are checking the exit code of the compileMessages function.
    // It should be 0 if there are no errors, and 1 if there are errors.
    exitCode = compileMessages(err, stats);
    if (exitCode !== 0) {
      console.error('Failed to start watching for changes.');
    } else {
      console.log('Watching for changes to plugin...');
    }
  });

  return exitCode;
}

/**
 * Run script on a plugin package or folder of plugin packages.
 *
 * @param packageFolder {string} - folder where the package, or folder of packages is.
 * @param scriptName {string} - name of the script to run.
 * @param cmdLine {string} - command line to run.
 * @param env {object} - environment variables to run the command with.
 * @returns {0 | 1} - Exit code, where 0 is success, 1 is failure.
 */
function runScriptOnPackages(packageFolder, scriptName, cmdLine, env) {
  if (!fs.existsSync(packageFolder)) {
    console.error(`"${packageFolder}" does not exist. Not ${scriptName}-ing.`);
    return 1;
  }

  const oldCwd = process.cwd();

  const runOnPackageReturn = {
    success: 0,
    notThere: 1,
    issue: 2,
  };

  function runOnPackage(folder) {
    if (!fs.existsSync(path.join(folder, 'package.json'))) {
      return runOnPackageReturn.notThere;
    }

    process.chdir(folder);

    if (!fs.existsSync('node_modules')) {
      console.log(`No node_modules in "${folder}" found. Running npm install...`);

      try {
        child_process.execSync('npm install', {
          stdio: 'inherit',
          encoding: 'utf8',
        });
      } catch (e) {
        console.error(`Problem running 'npm install' inside of "${folder}"\r\n`);
        process.chdir(oldCwd);
        return runOnPackageReturn.issue;
      }
      console.log(`Finished npm install.`);
    }

    // See if the cmd is in the:
    // - package/node_modules/.bin
    // - package/../node_modules/.bin
    // - the npx node_modules/.bin
    // If not, just use the original cmdLine and hope for the best :)
    let cmdLineToUse = cmdLine;
    const scriptCmd = cmdLine.split(' ')[0];
    const scriptCmdRest = cmdLine.split(' ').slice(1).join(' ');

    const nodeModulesBinCmd = path.join('node_modules', '.bin', scriptCmd);
    const upNodeModulesBinCmd = path.join('../', nodeModulesBinCmd);

    // When run as npx, find it in the node_modules npx uses
    const headlampPluginBin = fs.realpathSync(process.argv[1]);
    const npxBinCmd = path.join(
      path.dirname(headlampPluginBin),
      '..',
      '..',
      '..',
      '..',
      nodeModulesBinCmd
    );

    if (fs.existsSync(nodeModulesBinCmd)) {
      cmdLineToUse = nodeModulesBinCmd + ' ' + scriptCmdRest;
    } else if (fs.existsSync(upNodeModulesBinCmd)) {
      cmdLineToUse = upNodeModulesBinCmd + ' ' + scriptCmdRest;
    } else if (fs.existsSync(npxBinCmd)) {
      cmdLineToUse = npxBinCmd + ' ' + scriptCmdRest;
    } else {
      console.warn(
        `"${scriptCmd}" not found in "${resolve(nodeModulesBinCmd)}" or "${resolve(
          upNodeModulesBinCmd
        )}" or "${resolve(npxBinCmd)}".`
      );
    }

    console.log(`"${folder}": ${scriptName}-ing, :${cmdLineToUse}:...`);

    try {
      child_process.execSync(cmdLineToUse, {
        stdio: 'inherit',
        encoding: 'utf8',
        env: { ...process.env, ...(env || {}) },
      });
    } catch (e) {
      console.error(`Problem running ${scriptName} inside of "${folder}"\r\n`);
      process.chdir(oldCwd);
      return runOnPackageReturn.issue;
    }

    console.log(`Done ${scriptName}-ing: "${folder}".\r\n`);
    process.chdir(oldCwd);
    return runOnPackageReturn.success;
  }

  function runOnFolderOfPackages(packageFolder) {
    const folders = fs.readdirSync(packageFolder, { withFileTypes: true }).filter(fileName => {
      return (
        fileName.isDirectory() &&
        fs.existsSync(path.join(packageFolder, fileName.name, 'package.json'))
      );
    });

    if (folders.length === 0) {
      return {
        error: runOnPackageReturn.notThere,
        failedFolders: [],
      };
    }

    const errorFolders = folders.map(folder => {
      const folderToProcess = path.join(packageFolder, folder.name);
      return {
        error: runOnPackage(folderToProcess),
        folder: folderToProcess,
      };
    });
    const failedErrorFolders = errorFolders.filter(
      errFolder => errFolder.error !== runOnPackageReturn.success
    );

    if (failedErrorFolders.length === 0) {
      return {
        error: runOnPackageReturn.success,
        failedFolders: [],
      };
    }
    return {
      error: runOnPackageReturn.issue,
      failedFolders: failedErrorFolders.map(errFolder => path.basename(errFolder.folder)),
    };
  }

  const err = runOnPackage(packageFolder);

  if (err === runOnPackageReturn.notThere) {
    const folderErr = runOnFolderOfPackages(packageFolder);
    if (folderErr.error === runOnPackageReturn.notThere) {
      console.error(
        `"${resolve(packageFolder)}" does not contain a package or packages. Not ${scriptName}-ing.`
      );
      return 1; // failed
    } else if (folderErr.error === runOnPackageReturn.issue) {
      console.error(
        `Some in "${resolve(packageFolder)}" failed. Failed folders: ${folderErr.failedFolders.join(
          ', '
        )}`
      );
      return 1; // failed
    }
  }

  return 0; // success
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
    webpack(config, (err, stats) => {
      // We are checking the exit code of the compileMessages function.
      // It should be 0 if there are no errors, and 1 if there are errors.
      const exitCode = compileMessages(err, stats);
      if (exitCode !== 0) {
        console.error(`Failed to build "${folder}" for production.`);
      } else {
        console.log(`Finished building "${folder}" for production.`);
      }
      process.exit(exitCode);
    });
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
 * Format plugin code with prettier. Format the plugin package or folder of packages.
 *
 * @param packageFolder {string} - folder where the package, or folder of packages is.
 * @param check {boolean} - if true, check if the code is checked for formatting, but don't format it.
 * @returns {0 | 1} Exit code, where 0 is success, 1 is failure.
 */
function format(packageFolder, check) {
  const cmdLine = check
    ? `prettier --config package.json --check src`
    : 'prettier --config package.json --write --cache src';
  return runScriptOnPackages(packageFolder, 'format', cmdLine, {});
}

/**
 * Use `npm outdated` to find which dependencies are not up to date.
 *
 * @returns a dict keyed by package name
 *
 * @see https://docs.npmjs.com/cli/v8/commands/npm-outdated
 *
 * #### Example
 * ```js
 *  {
 *    "@kinvolk/headlamp-plugin": {
 *      "current": "0.5.0",
 *      "wanted": "0.5.1",
 *      "latest": "0.5.1",
 *      "dependent": "pod-counter",
 *      "location": "/home/rene/dev/headlamp/plugins/examples/pod-counter/node_modules/@kinvolk/headlamp-plugin"
 *    }
 *  }
 * ```
 *
 * #### Example: Nothing needs updating?
 * ```js
 *  {}
 * ```
 */
function getNpmOutdated() {
  let result = null;

  try {
    result = child_process.execSync('npm outdated --json', {
      encoding: 'utf8',
    });
  } catch (error) {
    // npm outdated exit codes 1 when something is not up to date.
    result = error.stdout.toString();
  }
  return JSON.parse(result);
}

/**
 * Upgrade package automatically, updating headlamp-plugin version.
 *
 * In the future this could be used for other upgrade tasks.
 *
 * @param packageFolder {string} - folder where the package, or folder of packages is.
 * @parm skipPackageUpdates {boolean} - do not upgrade packages if true.
 * @param headlampPluginVersion {string} - tag or version of headlamp-plugin to upgrade to.
 * @returns {0 | 1} Exit code, where 0 is success, 1 is failure.
 */
function upgrade(packageFolder, skipPackageUpdates, headlampPluginVersion) {
  /**
   * Files from the template might not be there.
   *
   * Either because they created the package themselves,
   *   or used an old version headlamp-plugin create.
   *
   * Assumes we are in the package folder.
   */
  function addMissingTemplateFiles() {
    const missingFiles = [
      path.join('src', 'headlamp-plugin.d.ts'),
      path.join('.vscode', 'extensions.json'),
      path.join('.vscode', 'settings.json'),
      path.join('.vscode', 'tasks.json'),
      'tsconfig.json',
    ];
    const templateFolder = path.resolve(__dirname, '..', 'template');

    missingFiles.forEach(pathToCheck => {
      const from = path.join(templateFolder, pathToCheck);
      const to = path.join('.', pathToCheck);

      // only copy it if it doesn't exist
      if (!fs.existsSync(to)) {
        console.log(`Adding missing file: "${to}"`);
        // Make the folder in to there if it is not.
        fs.mkdirSync(path.dirname(to), { recursive: true });
        fs.copyFileSync(from, to);
      }
      // Add file if it is different
      if (fs.readFileSync(from, 'utf8') !== fs.readFileSync(to, 'utf8')) {
        console.log(`Updating file: "${to}"`);
        fs.copyFileSync(from, to);
      }
    });
  }

  /**
   * If there are material-ui v4 files in src/ folder, upgrade them to v5.
   *
   * @see https://mui.com/material-ui/migration/migration-v4/#run-codemods
   */
  function upgradeMui() {
    const hasMaterialUI = fs
      .readdirSync('src', { withFileTypes: true })
      .filter(dirent => dirent.isFile() && dirent.name.endsWith('.ts'))
      .map(dirent => path.join('src', dirent.name))
      .filter(path => fs.readFileSync(path, 'utf8').includes('@material-ui'));

    if (hasMaterialUI.length > 0) {
      console.log('Found files with "@material-ui". Upgrading material-ui v4 to mui v5...');
      const cmd = 'npx @mui/codemod v5.0.0/preset-safe src';
      if (runCmd(cmd, '.')) {
        console.error(`Failed to upgrade material-ui v4 to mui v5.`);
        return false;
      }
    }
    return true;
  }

  /**
   * Some files should not be there anymore.
   *
   * Assumes we are in the package folder.
   */
  function removeFiles() {
    const filesToRemove = ['jsconfig.json'];

    filesToRemove.forEach(pathToCheck => {
      const removePath = path.join('.', pathToCheck);
      if (fs.existsSync(removePath)) {
        console.log(`Removing file: "${removePath}"`);
        fs.unlinkSync(removePath);
      }
    });
  }

  /**
   * Adds missing config into package.json
   */
  function addMissingConfiguration() {
    const templateFolder = path.resolve(__dirname, '..', 'template');
    const packageJsonPath = path.join('.', 'package.json');
    const templatePackageJson = JSON.parse(
      fs.readFileSync(path.join(templateFolder, 'package.json'), 'utf8')
    );
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    let configChanged = false;

    /**
     * replaceNestedKeys is used to replace nested keys in the package.json file.
     *
     * It only replaces the properties specified, and does so if they
     * are missing or not equal to the ones in the template.
     *
     * @param {string} keyName top-level key in the package.json file that contains the nested keys to be replaced.
     * @param {string[]} subProperties names of the nested keys to be replaced in keyName.
     */
    function replaceNestedKeys(keyName, subProperties) {
      subProperties.forEach(key => {
        if (packageJson[keyName][key] !== templatePackageJson[keyName][key]) {
          packageJson[keyName][key] = templatePackageJson[keyName][key];
          configChanged = true;
          console.log(
            `Updated package.json field ${keyName}.${key}: ${JSON.stringify(
              packageJson[keyName][key]
            )}`
          );
        }
      });
    }

    // Update these scripts keys to match the template.
    replaceNestedKeys('scripts', ['tsc', 'storybook', 'test', 'storybook-build']);

    // replace top level keys
    const checkKeys = ['eslintConfig', 'prettier', 'overrides'];
    checkKeys.forEach(key => {
      if (JSON.stringify(packageJson[key]) !== JSON.stringify(templatePackageJson[key])) {
        packageJson[key] = templatePackageJson[key];
        configChanged = true;
        console.log(`Updated package.json field "${key}": ${JSON.stringify(packageJson[key])}`);
      }
    });

    if (configChanged) {
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, '  ') + '\n');
    }
  }

  /**
   * Runs the command (more conveniently than node).
   *
   * @param {string} cmd - that you want to run.
   * @param {string} folder = folder to run inside.
   * @returns status code, so 0 on success and failure otherwise.
   */
  function runCmd(cmd, folder) {
    console.log(`Running cmd:"${cmd}" inside of ${folder} abs: "${resolve(folder)}"`);
    try {
      child_process.execSync(cmd, {
        stdio: 'inherit',
        encoding: 'utf8',
      });
    } catch (e) {
      console.error(`Problem running ${cmd}`);
      return e.status;
    }
    return 0;
  }

  /**
   * In order to more robustly upgrade packages,
   * we reset the package-lock.json and node_modules.
   *
   * @returns true unless there is a problem.
   */
  function resetPackageLock() {
    if (fs.existsSync('node_modules')) {
      console.log(`Resetting node_modules folder for more robust package upgrade...`);
      fs.rm('node_modules', { recursive: true });
    }
    if (fs.existsSync('package-lock.json')) {
      console.log(`Resetting package-lock.json file for more robust package upgrade...`);
      fs.unlinkSync('package-lock.json');
    }
    return true;
  }

  /**
   * Upgrades "@kinvolk/headlamp-plugin" dependency to latest or given version.
   *
   * @returns true unless there is a problem with the upgrade.
   */
  function upgradeHeadlampPlugin() {
    const theTag = headlampPluginVersion ? headlampPluginVersion : 'latest';
    if (
      headlampPluginVersion !== undefined ||
      '@kinvolk/headlamp-plugin' in getNpmOutdated() ||
      !fs.existsSync('node_modules')
    ) {
      // Upgrade the @kinvolk/headlamp-plugin

      const cmd = `npm install @kinvolk/headlamp-plugin@${theTag} --save`;
      if (runCmd(cmd, '.')) {
        return false;
      }
    }

    return true;
  }

  /**
   * Upgrades "@headlamp-k8s/eslint-config" dependency to latest or given version.
   *
   * @returns true unless there is a problem with the upgrade.
   */
  function upgradeEslintConfig() {
    // This should be the version related to headlamp-plugin. If it is the latest
    // version old versions in CI will look at the latest headlamp-k8s/eslint-config
    // and that latest version might not be compatible.

    function getEslintConfigToMatchHeadlampPlugin() {
      // Read node_modules/@kinvolk/headlamp-plugin/package.json and get the version of eslint-config
      const headlampPluginPackageJsonPath = path.join(
        'node_modules',
        '@kinvolk',
        'headlamp-plugin',
        'package.json'
      );
      let headlampPluginPackageJson = {};
      try {
        headlampPluginPackageJson = JSON.parse(
          fs.readFileSync(headlampPluginPackageJsonPath, 'utf8')
        );
      } catch (e) {
        console.error(
          `Error: Failed to read package.json from "${headlampPluginPackageJsonPath}".`
        );
        return false;
      }

      return headlampPluginPackageJson.devDependencies['@headlamp-k8s/eslint-config'];
    }
    const headlampPluginEslintVersion = getEslintConfigToMatchHeadlampPlugin();
    if (!headlampPluginEslintVersion) {
      console.error(
        `Error: Failed to get version of @headlamp-k8s/eslint-config from headlamp-plugin.`
      );
      return false;
    }

    const packageJsonPath = path.join('.', 'package.json');
    let packageJson = {};
    try {
      packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    } catch (e) {
      console.error(`Error: Failed to read package.json from "${packageJsonPath}".`);
      return false;
    }

    const oldVersion = packageJson.devDependencies['@headlamp-k8s/eslint-config'];
    if (
      oldVersion === undefined ||
      '@headlamp-k8s/eslint-config' in getNpmOutdated() ||
      !fs.existsSync('node_modules')
    ) {
      const cmd = `npm install -D @headlamp-k8s/eslint-config@${headlampPluginEslintVersion} --save`;
      if (runCmd(cmd, '.')) {
        return false;
      }
    }

    return true;
  }

  /**
   * Upgrade a single package in a folder.
   *
   * @param {string} folder - where the package is.
   * @param {boolean | undefined} skipPackageUpdates - If true do not update packages.
   * @returns {boolean} - true if it is successful upgrading
   */
  function upgradePackage(folder, skipPackageUpdates) {
    const oldCwd = process.cwd();

    process.chdir(folder);
    console.log(`Upgrading "${folder}"...`);

    addMissingTemplateFiles();
    addMissingConfiguration();
    removeFiles();

    let failed = false;
    let reason = '';
    if (skipPackageUpdates !== true) {
      if (!failed && !resetPackageLock()) {
        failed = true;
        reason = 'resetting package-lock.json and node_modules failed.';
      }
      if (!failed && !upgradeHeadlampPlugin()) {
        failed = true;
        reason = 'upgrading @kinvolk/headlamp-plugin failed.';
      }
      if (!failed && !upgradeEslintConfig()) {
        failed = true;
        reason = 'upgrading @headlamp-k8s/eslint-config failed.';
      }
      if (!failed && !upgradeMui()) {
        failed = true;
        reason = 'upgrading from material-ui 4 to mui 5 failed.';
      }
      if (!failed && runCmd('npm audit fix', folder)) {
        console.warn('"npm audit fix" failed. You may need to inspect your dependencies manually.');
      }
      if (!failed && runCmd('npm run format', folder)) {
        failed = true;
        reason = '"npm run format" failed.';
      }
      if (!failed && runCmd('npm run lint', folder)) {
        failed = true;
        reason = '"npm run lint" failed.';
      }
      if (!failed && runCmd('npm run tsc', folder)) {
        failed = true;
        reason = '"npm run tsc" failed';
      }
    }
    if (failed) {
      console.error(`Failed upgrading: "${folder}". Reason: ${reason}`);
    } else {
      console.log(`Successfully upgraded: "${folder}".`);
    }
    process.chdir(oldCwd);
    return !failed;
  }

  /**
   * Upgrade each package inside the folder.
   *
   * @param {fs.Dirent[]} packageFolders - folders to upgrade.
   * @param {boolean | undefined} skipPackageUpdates - If true do not update packages.
   * @returns {boolean} - true if all of them are upgraded successfully.
   */
  function upgradeFolderOfPackages(packageFolders, skipPackageUpdates) {
    let failed = '';

    for (const folder of packageFolders) {
      if (failed) {
        console.error(
          `Skipping "${folder.name}", because "${failed}" did not upgrade successfully.`
        );
        continue;
      }
      const folderToUpgrade = path.join(packageFolder, folder.name);
      if (!upgradePackage(folderToUpgrade, skipPackageUpdates)) {
        failed = folderToUpgrade;
      }
    }
    return !failed;
  }

  if (!fs.existsSync(packageFolder)) {
    console.error(`"${packageFolder}" does not exist. Not upgrading.`);
    return 1;
  }

  if (fs.existsSync(path.join(packageFolder, 'package.json'))) {
    if (!upgradePackage(packageFolder, skipPackageUpdates)) {
      return 1;
    }
  } else {
    const packageFolders = fs
      .readdirSync(packageFolder, { withFileTypes: true })
      .filter(fileName => {
        return (
          fileName.isDirectory() &&
          fs.existsSync(path.join(packageFolder, fileName.name, 'package.json'))
        );
      });
    if (packageFolders.length === 0) {
      console.error(`"${packageFolder}" does not contain a package or packages. Not upgrading.`);
      return 1;
    }
    if (!upgradeFolderOfPackages(packageFolders, skipPackageUpdates)) {
      return 1;
    }
  }

  return 0;
}

/**
 * Lint code with eslint. Lint the plugin package or folder of packages.
 *
 * @param packageFolder {string} - folder where the package, or folder of packages is.
 * @param fix {boolean} - automatically fix problems.
 * @returns {0 | 1} - Exit code, where 0 is success, 1 is failure.
 */
function lint(packageFolder, fix) {
  const script = `eslint --cache -c package.json --max-warnings 0 --ext .js,.ts,.tsx src/${
    fix ? ' --fix' : ''
  }`;
  return runScriptOnPackages(packageFolder, 'lint', script, {});
}

/**
 * Type check code with tsc. Type check the plugin package or folder of packages.
 *
 * @param packageFolder {string} - folder where the package, or folder of packages is.
 * @returns {0 | 1} - Exit code, where 0 is success, 1 is failure.
 */
function tsc(packageFolder) {
  const script = 'tsc --noEmit';
  return runScriptOnPackages(packageFolder, 'tsc', script, {});
}

/**
 * Start storybook.
 *
 * @param packageFolder {string} - folder where the package is.
 * @returns {0 | 1} Exit code, where 0 is success, 1 is failure.
 */
function storybook(packageFolder) {
  try {
    child_process.execSync(
      './node_modules/.bin/storybook dev -p 6007 -c node_modules/@kinvolk/headlamp-plugin/config/.storybook',
      {
        stdio: 'inherit',
        cwd: packageFolder,
        encoding: 'utf8',
      }
    );
  } catch (e) {
    console.error(
      `Problem running storybook dev inside of "${packageFolder}" abs: "${resolve(packageFolder)}"`
    );
    return 1;
  }

  return 0;
}

/**
 * Build storybook.
 *
 * @param packageFolder {string} - folder where the package is.
 * @returns {0 | 1} Exit code, where 0 is success, 1 is failure.
 */
function storybook_build(packageFolder) {
  const script = `storybook build -c node_modules/@kinvolk/headlamp-plugin/config/.storybook`;
  return runScriptOnPackages(packageFolder, 'storybook build', script, {});
}

/**
 * Run tests.
 *
 * @param packageFolder {string} - folder where the package is.
 * @returns {0 | 1} Exit code, where 0 is success, 1 is failure.
 */
function test(packageFolder) {
  const script = `react-scripts test --transformIgnorePatterns "/node_modules/(?!monaco-editor|spacetime|d3|internmap|react-markdown|xterm|github-markdown-css|vfile|unist-.+|unified|bail|is-plain-obj|trough|remark-.+|mdast-util-.+|micromark|parse-entities|character-entities|property-information|comma-separated-tokens|hast-util-whitespace|remark-.+|space-separated-tokens|decode-named-character-reference|@kinvolk/headlamp-plugin)"`;
  return runScriptOnPackages(packageFolder, 'test', script, { UNDER_TEST: 'true' });
}

// const headlampPluginBin = fs.realpathSync(process.argv[1]);
// console.log('headlampPluginBin path:', headlampPluginBin);

yargs(process.argv.slice(2))
  .command(
    'build [package]',
    'Build the plugin, or folder of plugins. <package> defaults to current working directory.',
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
  .command('start', 'Watch for changes and build plugin.', {}, () => {
    process.exitCode = start();
  })
  .command(
    'create <name>',
    'Create a new plugin folder.',
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
      'to outputPlugins/packageName/main.js.',
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
    'package [pluginPath] [outputDir]',
    'Creates a tarball of the plugin package in the format Headlamp expects.',
    yargs => {
      yargs.positional('pluginPath', {
        describe:
          'A folder of a plugin package that have been built with dist/main.js in it.' +
          ' Defaults to current working directory.',
        type: 'string',
      });
      yargs.positional('outputDir', {
        describe:
          'The destination folder in which to create the archive.' +
          'Creates this folder if it does not exist.',
        type: 'string',
      });
    },
    async argv => {
      let pluginPath = argv.pluginPath;
      if (!pluginPath) {
        pluginPath = process.cwd();
      }

      let outputDir = argv.outputDir;
      if (!outputDir) {
        outputDir = process.cwd();
      }

      process.exitCode = await createArchive(pluginPath, outputDir);
    }
  )
  .command(
    'format [package]',
    'format the plugin code with prettier. <package> defaults to current working directory.' +
      ' Can also be a folder of packages.',
    yargs => {
      yargs
        .positional('package', {
          describe: 'Package to code format',
          type: 'string',
          default: '.',
        })
        .option('check', {
          describe: 'Check the formatting without changing files',
          type: 'boolean',
        });
    },
    argv => {
      process.exitCode = format(argv.package, argv.check);
    }
  )
  .command(
    'lint [package]',
    'Lint the plugin for coding issues with eslint. ' +
      '<package> defaults to current working directory.' +
      ' Can also be a folder of packages.',
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
      process.exitCode = lint(argv.package, argv.fix);
    }
  )
  .command(
    'tsc [package]',
    'Type check the plugin for coding issues with tsc. ' +
      '<package> defaults to current working directory.' +
      ' Can also be a folder of packages.',
    yargs => {
      yargs.positional('package', {
        describe: 'Package to type check',
        type: 'string',
        default: '.',
      });
    },
    argv => {
      process.exitCode = tsc(argv.package);
    }
  )
  .command(
    'storybook [package]',
    'Start storybook. <package> defaults to current working directory.',
    yargs => {
      yargs.positional('package', {
        describe: 'Package to start storybook for',
        type: 'string',
        default: '.',
      });
    },
    argv => {
      process.exitCode = storybook(argv.package);
    }
  )
  .command(
    'storybook-build [package]',
    'Build static storybook. <package> defaults to current working directory.' +
      ' Can also be a folder of packages.',
    yargs => {
      yargs.positional('package', {
        describe: 'Package to build storybook for',
        type: 'string',
        default: '.',
      });
    },
    argv => {
      process.exitCode = storybook_build(argv.package);
    }
  )
  .command(
    'upgrade [package]',
    'Upgrade the plugin to latest headlamp-plugin; ' +
      'upgrades headlamp-plugin and audits packages, formats, lints, type checks.' +
      '<package> defaults to current working directory. Can also be a folder of packages.',
    yargs => {
      yargs
        .positional('package', {
          describe: 'Package to upgrade',
          type: 'string',
          default: '.',
        })
        .option('skip-package-updates', {
          describe: 'For development of headlamp-plugin itself, so it does not do package updates.',
          type: 'boolean',
        })
        .option('headlamp-plugin-version', {
          describe:
            'Use a specific headlamp-plugin-version when upgrading packages. Defaults to "latest".',
          type: 'string',
        });
    },
    argv => {
      process.exitCode = upgrade(argv.package, argv.skipPackageUpdates, argv.headlampPluginVersion);
    }
  )
  .command(
    'test [package]',
    'Test. <package> defaults to current working directory.' + ' Can also be a folder of packages.',
    yargs => {
      yargs.positional('package', {
        describe: 'Package to test',
        type: 'string',
        default: '.',
      });
    },
    argv => {
      process.exitCode = test(argv.package);
    }
  )
  .command(
    'install <URL>',
    'Install a plugin from the Artiface Hub URL',
    yargs => {
      yargs
        .positional('URL', {
          describe: 'URL of the plugin to install',
          type: 'string',
        })
        .option('folderName', {
          describe: 'Name of the folder to install the plugin into',
          type: 'string',
        })
        .option('headlampVersion', {
          describe: 'Version of headlamp to install the plugin into',
          type: 'string',
        })
        .option('quiet', {
          alias: 'q',
          describe: 'Do not print logs',
          type: 'boolean',
        });
    },
    async argv => {
      const { URL, folderName, headlampVersion, quiet } = argv;
      const progressCallback = quiet
        ? null
        : data => {
            if (data.type === 'error' || data.type === 'success') {
              console.error(data.type, ':', data.message);
            }
          }; // Use console.log for logs if not in quiet mode
      try {
        await PluginManager.install(URL, folderName, headlampVersion, progressCallback);
      } catch (e) {
        console.error(e.message);
        process.exit(1); // Exit with error status
      }
    }
  )
  .command(
    'update <pluginName>',
    'Update a plugin to the latest version',
    yargs => {
      yargs
        .positional('pluginName', {
          describe: 'Name of the plugin to update',
          type: 'string',
        })
        .positional('folderName', {
          describe: 'Name of the folder that contains the plugin',
          type: 'string',
        })
        .positional('headlampVersion', {
          describe: 'Version of headlamp to update the plugin into',
          type: 'string',
        })
        .option('quiet', {
          alias: 'q',
          describe: 'Do not print logs',
          type: 'boolean',
        });
    },
    async argv => {
      const { pluginName, folderName, headlampVersion, quiet } = argv;
      const progressCallback = quiet
        ? null
        : data => {
            if (data.type === 'error' || data.type === 'success') {
              console.error(data.type, ':', data.message);
            }
          }; // Use console.log for logs if not in quiet mode
      try {
        await PluginManager.update(pluginName, folderName, headlampVersion, progressCallback);
      } catch (e) {
        console.error(e.message);
        process.exit(1); // Exit with error status
      }
    }
  )
  .command(
    'uninstall <pluginName>',
    'Uninstall a plugin',
    yargs => {
      yargs
        .positional('pluginName', {
          describe: 'Name of the plugin to uninstall',
          type: 'string',
        })
        .option('folderName', {
          describe: 'Name of the folder that contains the plugin',
          type: 'string',
        })
        .option('quiet', {
          alias: 'q',
          describe: 'Do not print logs',
          type: 'boolean',
        });
    },
    async argv => {
      const { pluginName, folderName, quiet } = argv;
      const progressCallback = quiet
        ? null
        : data => {
            if (data.type === 'error' || data.type === 'success') {
              console.error(data.type, ':', data.message);
            }
          }; // Use console.log for logs if not in quiet mode
      try {
        await PluginManager.uninstall(pluginName, folderName, progressCallback);
      } catch (e) {
        console.error(e.message);
        process.exit(1); // Exit with error status
      }
    }
  )
  .command(
    'list',
    'List installed plugins',
    yargs => {
      yargs
        .option('folderName', {
          describe: 'Name of the folder that contains the plugins',
          type: 'string',
        })
        .option('json', {
          alias: 'j',
          describe: 'Output in JSON format',
          type: 'boolean',
        });
    },
    async argv => {
      const { folderName, json } = argv;
      const progressCallback = data => {
        if (json) {
          console.log(JSON.stringify(data.data));
        } else {
          // display table
          const rows = [['Name', 'Version', 'Folder Name', 'Repo', 'Author']];
          data.data.forEach(plugin => {
            rows.push([
              plugin.pluginName,
              plugin.pluginVersion,
              plugin.folderName,
              plugin.repoName,
              plugin.author,
            ]);
          });
          console.log(table(rows));
        }
      };
      try {
        await PluginManager.list(folderName, progressCallback);
      } catch (e) {
        console.error(e.message);
        process.exit(1); // Exit with error status
      }
    }
  )
  .demandCommand(1, '')
  .strict()
  .help().argv;
