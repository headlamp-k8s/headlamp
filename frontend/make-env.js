'use strict';

// Creates the .env file

const fs = require('fs');
const {execSync} = require('child_process');
const appInfo = require('../app/package.json');

const gitVersion = execSync('git rev-parse HEAD').toString().trim();

const envContents = {
  VITE_HEADLAMP_VERSION: appInfo.version,
  VITE_HEADLAMP_GIT_VERSION: gitVersion,
  VITE_HEADLAMP_PRODUCT_NAME: appInfo.productName,
};

function createEnvText() {
  let text = '';
  Object.entries(envContents).forEach(([key, value]) => {
    text += `${key}=${value}\n`
  })

  return text;
}

const fileName = process.argv[2] || '.env';

fs.writeFileSync(fileName, createEnvText());
