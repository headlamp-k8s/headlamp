import FormControl, { FormControlProps } from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Theme, useTheme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { supportedLanguages } from '../config';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(2),
    },
  })
);
export interface LocaleSelectProps {
  showTitle?: boolean;
  showFullNames?: boolean;
  formControlProps?: FormControlProps;
}

/**
 * A UI for selecting the locale with i18next
 */
export default function LocaleSelect(props: LocaleSelectProps) {
  const { formControlProps, showFullNames } = props;
  const classes = useStyles();
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const fullNames = React.useMemo(() => {
    if (!showFullNames) {
      return {};
    }

    return getFullNames();
  }, [showFullNames]);

  const changeLng = (event: SelectChangeEvent<string>) => {
    const lng = event.target.value as string;

    i18n.changeLanguage(lng);
    theme.direction = i18n.dir();
  };

  function getFullNames() {
    if (!i18n?.options?.supportedLngs) {
      return {};
    }

    const fullNames: { [langCore: string]: string } = {};
    i18n?.options?.supportedLngs.forEach((lng: string) => {
      if (!lng) {
        return;
      }

      fullNames[lng] = supportedLanguages[lng] || lng;
    });

    return fullNames;
  }

  // Select has a problem with aria-controls not being stable under test.
  const extraInputProps = process.env.UNDER_TEST ? { 'aria-controls': 'under-test' } : {};

  return (
    <FormControl className={classes.formControl} {...formControlProps}>
      {props.showTitle && <FormLabel component="legend">{t('Select locale')}</FormLabel>}
      <Select
        value={i18n.language ? i18n.language : 'en'}
        onChange={changeLng}
        SelectDisplayProps={extraInputProps}
        inputProps={{ 'aria-label': t('Select locale'), ...extraInputProps }}
      >
        {(i18n?.options?.supportedLngs || [])
          .filter(lng => lng !== 'cimode')
          .map(lng => (
            <MenuItem value={lng} key={lng}>
              {showFullNames ? fullNames[lng] : lng}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
}
