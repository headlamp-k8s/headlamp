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
};
