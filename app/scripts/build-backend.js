'use strict';

const { exec } = require("child_process");

exports.default = async context => {
  let arch = context.arch;
  if (arch === 'x64') {
    arch = 'amd64';
  }

  let osName = '';
  if (context.platform.name === 'windows') {
    osName = 'Windows_NT';
  }

  await exec('make backend', {
    env: {
      ...process.env, // needed otherwise important vars like PATH and GOROOT are not set
      GOARCH: arch,
      OS: osName,
    },
    cwd: '..'
  },
  (error, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);

    if (!!error) {
      throw error;
    }
  });
};
