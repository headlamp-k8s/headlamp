const os = require('os');
const path = require('path');
const { execSync } = require('child_process');
const { readFileSync } = require('fs');

const envFile = path.join(os.tmpdir(), 'tmpEnv');

test('Create & verify', () => {
  const execFile = path.resolve(path.join(__dirname, '..', 'make-env.js'));
  execSync(`node ${execFile} ${envFile}`);

  const envContents = readFileSync(envFile).toString();

  const lines = envContents.split(/\r?\n/);
  const envObj = {};

  lines.forEach(line => {
    // Skip empty lines
    if (!line) {
      return;
    }

    const [key, val] = line.trim().split('=');

    expect(key.trim()).toBeDefined();
    expect(val.trim()).toBeDefined();

    envObj[key] = val;
  });

  const keys = Object.keys(envObj);
  expect(keys).toContain('VITE_HEADLAMP_VERSION');
  expect(keys).toContain('VITE_HEADLAMP_GIT_VERSION');
  expect(keys).toContain('VITE_HEADLAMP_PRODUCT_NAME');
});
