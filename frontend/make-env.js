'use strict';

// Creates the .env file

const fs = require('fs');
const {execSync} = require('child_process');
const appInfo = require('../app/package.json');

const gitVersion = execSync('git rev-parse HEAD').toString().trim();

const envContents = {
  REACT_APP_HEADLAMP_VERSION: appInfo.version,
  REACT_APP_HEADLAMP_GIT_VERSION: gitVersion,
  REACT_APP_HEADLAMP_PRODUCT_NAME: appInfo.productName,
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
