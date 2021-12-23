const path = require('path');
const fs = require('fs');

const directoryPath = path.join(__dirname, './locales/');
const currentLocales = [];

fs.readdirSync(directoryPath).forEach(file => currentLocales.push(file));

module.exports = {
  lexers: {
    default: ['JsxLexer'],
  },
  namespaceSeparator: '|',
  keySeparator: false,
  output: path.join(directoryPath, './$LOCALE/$NAMESPACE.json'),
  locales: currentLocales,
  // The English catalog has "SomeKey": "SomeKey" so we stop warnings about
  // missing values.
  useKeysAsDefaultValue: locale => locale === 'en',
};
