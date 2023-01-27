import { useEffect, useState } from 'react';
import { useTypedSelector } from '../../../redux/reducers/reducers';

export const useSettings = function (settingName?: string) {
  const storeSettingEntries = useTypedSelector(state =>
    settingName ? state.config.settings[settingName] : state.config.settings
  );
  const [settingEntries, setSettingEntries] = useState(storeSettingEntries);

  useEffect(() => {
    setSettingEntries(settingEntries);
  }, [storeSettingEntries]);

  return settingEntries;
};
