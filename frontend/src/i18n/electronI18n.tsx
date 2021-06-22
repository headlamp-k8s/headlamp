import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import helpers from '../helpers';

// If we're running under electron, we need to communicate any language changes.
const ipcRenderer = helpers.isElectron() ? window.require('electron').ipcRenderer : null;

function tellAppAboutLanguage(lang: string) {
  if (ipcRenderer) {
    ipcRenderer.send('locale', lang);
  }
}

/** Integration with Electron app, so it can change locale information. */
export function useElectronI18n() {
  const { i18n } = useTranslation();

  useEffect(() => {
    i18n.on('languageChanged', tellAppAboutLanguage);
    return () => {
      i18n.off('languageChanged', tellAppAboutLanguage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
