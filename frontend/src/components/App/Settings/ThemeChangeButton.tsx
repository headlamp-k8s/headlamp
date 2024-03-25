import { Icon } from '@iconify/react';
import { Button, ButtonGroup } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/system';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { getThemeName, ThemesConf } from '../../../lib/themes';
import { setTheme as setThemeRedux } from '../themeSlice';

const StyledButton = styled(Button)(({ theme }) => ({
  color: theme.palette.mode === 'dark' ? '#fff' : '#000',
  borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
    borderColor:
      theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
  },
}));

export default function ThemeChangeButton(props: { showBothIcons?: boolean }) {
  const themeName = getThemeName();

  const { showBothIcons } = props;
  const dispatch = useDispatch();
  const { t } = useTranslation();
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

  function changeTheme(themeNameArg?: string) {
    const idx = themeNames.indexOf(themeNameArg || themeName);
    const newTheme = themeNames[(idx + 1) % themeNames.length];
    dispatch(setThemeRedux(newTheme));
    setIcon(counterIcons[newTheme]);
  }

  if (showBothIcons) {
    return (
      <>
        <ButtonGroup
          size="large"
          sx={theme => ({
            '& button': {
              boxShadow: 'none',
              borderRadius: '4px',
              padding: '0.8rem 1.5rem',
            },
            '& .MuiButton-contained': {
              backgroundColor: theme.palette.mode === 'dark' ? '#fff' : 'rgba(0, 0, 0, 0.45)',
              color: theme.palette.mode === 'dark' ? '#000' : 'rgb(255, 255, 255)',
            },
          })}
        >
          <StyledButton
            aria-label={t('light theme')}
            onClick={() => changeTheme('dark')}
            variant={themeName === 'light' ? 'contained' : 'outlined'}
          >
            <Icon icon={counterIcons.dark} width="20" />
          </StyledButton>
          <StyledButton
            aria-label={t('dark theme')}
            onClick={() => changeTheme('light')}
            variant={themeName === 'dark' ? 'contained' : 'outlined'}
          >
            <Icon icon={counterIcons.light} width="20" />
          </StyledButton>
        </ButtonGroup>
      </>
    );
  }

  return (
    <IconButton aria-label={t('Change theme')} onClick={() => changeTheme()} size="medium">
      <Icon icon={icon} />
    </IconButton>
  );
}
