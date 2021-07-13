const path = require('path');
const helper = require('./i18n-helper');

module.exports = {
  lexers: {
    default: ['JsxLexer'],
  },
  namespaceSeparator: '|',
  keySeparator: false,
  defaultNamespace: 'app',
  output: path.join(helper.LOCALES_DIR, './$LOCALE/$NAMESPACE.json'),
  locales: helper.CURRENT_LOCALES,
};
