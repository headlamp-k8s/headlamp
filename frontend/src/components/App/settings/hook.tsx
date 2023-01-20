import { useEffect, useState } from 'react';
import { useTypedSelector } from '../../../redux/reducers/reducers';

export const useSettings = function (settingName?: string) {
  const storeSettingEntries = useTypedSelector(state =>
    settingName ? state.ui.settings[settingName] : state.ui.settings
  );
  const [settingEntries, setSettingEntries] = useState(storeSettingEntries);

  useEffect(() => {
    setSettingEntries(settingEntries);
  }, [storeSettingEntries]);

  return settingEntries;
};
