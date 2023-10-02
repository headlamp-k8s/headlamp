// This script copies the empty translations from a translations file to a new file. So they can
// be easily spotted and translated.
//
// Usage: node extract-empty-translations.js <translationsFile> [-o <outputFile>]
// Example (creates a ./src/i18n/locales/de/translations_empty.json file):
//   node extract-empty-translations.js ./src/i18n/locales/de/translations.json

const fs = require('fs');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv))
  .command('$0 <translationsFile>', 'Process a translations file', yargs => {
    yargs.positional('translationsFile', {
      describe: 'Path to the translations file',
      type: 'string',
    });
  })
  .option('outputFile', {
    alias: 'o',
    type: 'string',
    describe: 'Path to the output file',
  })
  .version(false).argv;

const translations = fs.readFileSync(argv.translationsFile, 'utf8');
const translationsData = JSON.parse(translations);

// Extract the keys with empty values
const emptyKeys = Object.keys(translationsData).filter(key => translationsData[key] === '');

// Create an object with the empty keys and empty values
const emptyTranslationsData = emptyKeys.reduce((obj, key) => {
  obj[key] = '';
  return obj;
}, {});

// If an output file is specified, write the data to the file
if (Object.keys(emptyTranslationsData).length === 0) {
  console.log('No missing translations found.');
  process.exit(0);
}

const outputFileName =
  argv.outputFile ||
  argv.translationsFile.slice(0, argv.translationsFile.lastIndexOf('.')) + '_empty.json';
// Write the empty translations data to the output file
fs.writeFileSync(outputFileName, JSON.stringify(emptyTranslationsData, null, 2));

console.log(`Created ${outputFileName}`);
