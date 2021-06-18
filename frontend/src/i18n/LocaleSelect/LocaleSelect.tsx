import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';
import helpers from '../../helpers';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(2),
    },
  })
);
export interface LocaleSelectProps {}

// If we're running under electron, we need to communicate any language changes.
const ipcRenderer = helpers.isElectron() ? window.require('electron').ipcRenderer : null;

function tellAppAboutLanguage(lang: string) {
  if (ipcRenderer) {
    ipcRenderer.send('locale', lang);
  }
}

/**
 * A UI for selecting the locale with i18next
 */
export default function LocaleSelect(props: LocaleSelectProps) {
  const classes = useStyles();

  const { t, i18n } = useTranslation('frequent');
  const theme = useTheme();
  document.body.dir = i18n.dir();

  React.useEffect(() => {
    // Inform the app about the current locale as soon as we set it up.
    tellAppAboutLanguage(i18n.language);
  }, []);

  const changeLng = (event: React.ChangeEvent<{ value: unknown }>) => {
    const lng = event.target.value as string;

    i18n.changeLanguage(lng);
    document.body.dir = i18n.dir();
    theme.direction = i18n.dir();

    tellAppAboutLanguage(lng);
  };

  return (
    <FormControl className={classes.formControl}>
      <Select
        value={i18n.language ? i18n.language : 'en'}
        onChange={changeLng}
        inputProps={{ 'aria-label': t('Select locale') }}
      >
        <MenuItem value={'en'}>en</MenuItem>
        <MenuItem value={'pt'}>pt</MenuItem>
        <MenuItem value={'es'}>es</MenuItem>
      </Select>
    </FormControl>
  );
}
