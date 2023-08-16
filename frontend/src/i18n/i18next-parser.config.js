const path = require('path');
const fs = require('fs');
const sharedConfig = require('./i18nextSharedConfig');

const directoryPath = path.join(__dirname, './locales/');
const currentLocales = [];
const contextSeparator = sharedConfig.contextSeparator;

fs.readdirSync(directoryPath).forEach(file => currentLocales.push(file));

module.exports = {
  lexers: {
    default: ['JsxLexer'],
  },
  namespaceSeparator: '|',
  keySeparator: false,
  output: path.join(directoryPath, './$LOCALE/$NAMESPACE.json'),
  locales: currentLocales,
  contextSeparator,
  defaultValue: (locale, _namespace, key) => {
    // The English catalog has "SomeKey": "SomeKey" so we stop warnings about
    // missing values.
    if (locale === 'en') {
      const contextSepIdx = key.indexOf(contextSeparator);
      if (contextSepIdx >= 0) {
        return key.substring(0, contextSepIdx);
      }
      return key;
    }
    return '';
  },
};
