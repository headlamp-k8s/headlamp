import React from 'react';
import helpers from '../../helpers';
import { useTypedSelector } from '../../redux/reducers/reducers';

export default function Headless() {
  const headless = useTypedSelector(state => state.config.headless);
  console.log('headless', headless);

  React.useEffect(() => {
    if (window && window.addEventListener) {
      window.addEventListener('beforeunload', handleTabClosing);
    }
    return () => {
      if (window && window.removeEventListener) {
        window.removeEventListener('beforeunload', handleTabClosing);
      }
    };
  });

  const handleTabClosing = () => {
    console.log('handleTabClosing', JSON.stringify(helpers.getBaseUrl()));
    if (headless === true) {
      // Signal to the backend that this tab is quiting.
      const baseURL = helpers.getAppUrl();
      const quitURL = baseURL ? new URL('quit', baseURL) : '/quit';
      console.log('quitURL', quitURL);
      navigator.sendBeacon(quitURL);
    }
  };
  return null;
}
