import { Icon } from '@iconify/react';
import IconButton from '@material-ui/core/IconButton';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { getThemeName, ThemesConf } from '../../lib/themes';
import { setTheme as setThemeRedux } from '../../redux/actions/actions';

export default function ThemeChangeButton() {
  const themeName = getThemeName();

  const dispatch = useDispatch();
  const { t } = useTranslation('frequent');
  const darkIcon = 'mdi:weather-night';
  const lightIcon = 'mdi:weather-sunny';
  type iconType = typeof darkIcon | typeof lightIcon;

  const counterIcons: {
    [themeName in keyof ThemesConf]: iconType;
  } = {
    light: darkIcon,
    dark: lightIcon,
  };

  const [icon, setIcon] = React.useState<iconType>(counterIcons[themeName]);

  const themeNames = Object.keys(counterIcons);

  function changeTheme() {
    const idx = themeNames.indexOf(themeName);
    const newTheme = themeNames[(idx + 1) % themeNames.length];
    dispatch(setThemeRedux(newTheme));
    setIcon(counterIcons[newTheme]);
  }

  return (
    <IconButton aria-label={t('Change theme')} onClick={() => changeTheme()}>
      <Icon icon={icon} />
    </IconButton>
  );
}
