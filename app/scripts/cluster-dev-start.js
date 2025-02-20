const { exec } = require('child_process');

const url = process.env.HEADLAMP_TEST_URL;
const command = `cross-env ELECTRON_DEV=1 ELECTRON_START_URL=${url} EXTERNAL_SERVER=true electron .`;

exec(command, (err, stdout, stderr) => {
  if (err) {
    console.error(`Error: ${err}`);
    return;
  }
  console.log(stdout);
  console.error(stderr);
});
