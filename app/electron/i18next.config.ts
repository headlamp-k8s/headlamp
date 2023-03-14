import i18next from 'i18next';
import { CURRENT_LOCALES } from './i18n-helper';
const i18nextBackend = require('i18next-fs-backend');

const en = {}; // To keep TS happy.

i18next
  // Use dynamic imports (webpack code splitting) to load javascript bundles.
  // @see https://www.i18next.com/misc/creating-own-plugins#backend
  // @see https://webpack.js.org/guides/code-splitting/
  .use(i18nextBackend)
  .use({
    type: 'backend',
    read<Namespace extends keyof typeof en>(
      language: string | any,
      namespace: Namespace,
      callback: (errorValue: unknown, translations: null | typeof en[Namespace]) => void
    ) {
      import(`./locales/${language}/${namespace}.json`)
        .then(resources => {
          callback(null, resources);
        })
        .catch(error => {
          callback(error, null);
        });
    },
  })
  .init({
    debug: process.env.NODE_ENV === 'development',
    fallbackLng: 'en',
    supportedLngs: CURRENT_LOCALES,
    ns: ['app'],
    defaultNS: 'app',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
      format: function (value, format, lng) {
        // https://www.i18next.com/translation-function/formatting
        if (format === 'number') return new Intl.NumberFormat(lng).format(value);
        if (format === 'date') return new Intl.DateTimeFormat(lng).format(value);
        return value;
      },
    },
    returnEmptyString: false,
    nsSeparator: '|',
    keySeparator: false,
  });

export default i18next;
