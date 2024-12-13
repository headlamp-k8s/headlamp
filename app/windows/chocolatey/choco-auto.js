/**
 * Usage:
 *
 * 1. Ensure that Node.js and npm are installed on your system.
 * 2. Run this script using the command `node choco-auto.js <projectVersion>`.
 *
 * Parameters:
 * - projectVersion: The version of the project you want to fetch information for (e.g., 0.19.1).
 *
 * Ensure that you replace `<projectVersion>` with the actual project version, do not include the 'v'.
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const args = process.argv.slice(2);

if (!(args.length === 1)) {
  console.error('Usage: node choco-auto.js <projectVersion>');
  process.exit(1);
}

const projectVersion = args[0];

if (projectVersion.startsWith('v')) {
  console.error('Please provide the project version without the "v" prefix.');
  console.error('Example: node choco-auto.js 0.19.1');
  process.exit(1);
}

// Async function to fetch release information from GitHub API for a given tag
// For this script we are only interested in the checksums for the windows x64 asset
async function fetchGithubReleaseInfo() {
  const tag = projectVersion;
  const res = await fetch(
    `https://api.github.com/repos/headlamp-k8s/headlamp/releases/tags/v${tag}`
  );

  if (!res.ok) {
    console.error(
      `Error fetching release information for tag ${tag}: ${res.status} ${res.statusText}`
    );
    process.exit(1);
  }

  const resJSON = await res.json();

  const checksum = await updateReleaseInfo(resJSON, tag);
  return checksum;
}

async function getChecksums(checksumsUrl, fileName) {
  const res = await fetch(checksumsUrl);
  const checksums = await res.text();

  for (const line of checksums.split('\n')) {
    const [checksum, filename] = line.split('  ');

    if (!filename) {
      continue;
    }

    if (filename === fileName) {
      return checksum;
    }
  }

  return '';
}

async function updateReleaseInfo(response, tag) {
  const assets = response.assets;
  const checksums = assets.find(v => v.name === 'checksums.txt');
  const checksumsUrl = checksums.browser_download_url;
  // asset for windows x64, can add more assets for other archs
  const winx64Asset = assets.find(asset => asset.name === `Headlamp-${tag}-win-x64.exe`);
  const browserDownloadName = winx64Asset.name;

  const checksum = await getChecksums(checksumsUrl, browserDownloadName);
  console.log('Checksum:', checksum);

  return checksum;
}

async function runChocoUpdate() {
  const checksum = await fetchGithubReleaseInfo();

  console.log('using checksum', checksum);

  exec(`./choco-bump.sh ${projectVersion} ${checksum}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error - source choco-auto.js : ${error}`);
      return;
    }

    console.log(`stdout - source choco-auto.js : ${stdout}`);
    console.error(`stderr - source choco-auto.js : ${stderr}`);
  });
}

runChocoUpdate();
