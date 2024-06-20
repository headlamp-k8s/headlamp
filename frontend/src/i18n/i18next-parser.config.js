import fs from 'fs';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import sharedConfig from './i18nextSharedConfig.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const directoryPath = path.join(__dirname, './locales/');
const currentLocales = [];
const contextSeparator = sharedConfig.contextSeparator;

fs.readdirSync(directoryPath).forEach(file => currentLocales.push(file));

export default {
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
