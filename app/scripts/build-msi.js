// You need to install wix tool set first
// Reference https://ourcodeworld.com/articles/read/927/how-to-create-a-msi-installer-in-windows-for-an-electron-framework-application
const { MSICreator } = require('electron-wix-msi');
const path = require('path');

const APP_DIR = path.resolve(__dirname, '../dist/win-unpacked');
const OUT_DIR = path.resolve(__dirname, '../dist');

const msiCreator = new MSICreator({
  appDirectory: APP_DIR,
  outputDirectory: OUT_DIR,
  description: 'Easy-to-use and extensible Kubernetes web UI',
  exe: process.env.npm_package_name,
  name: process.env.npm_package_name,
  manufacturer: 'Kinvolk',
  version: process.env.npm_package_version,
  appIconPath: path.resolve(__dirname, '../build/icons/icon.ico'),
  ui: {
    chooseDirectory: true,
  },
});

msiCreator.create().then(function () {
  msiCreator.compile();
});
