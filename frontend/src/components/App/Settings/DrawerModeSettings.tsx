import { FormControlLabel, Switch } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setDetailDrawerEnabled } from '../../../redux/drawerModeSlice';
import { useTypedSelector } from '../../../redux/reducers/reducers';
import { TooltipIcon } from '../../common';

export default function DrawerModeSettings() {
  const dispatch = useDispatch();
  const { t } = useTranslation('translation');

  const isDrawerEnabled = useTypedSelector(state => state.drawerMode.isDetailDrawerEnabled);

  function drawerModeToggle() {
    dispatch(setDetailDrawerEnabled(!isDrawerEnabled));
  }

  return (
    <FormControlLabel
      control={
        <Switch
          checked={isDrawerEnabled}
          onClick={drawerModeToggle}
          name="drawerMode"
          color="primary"
        />
      }
      label={
        <>
          {t('translation|Overlay')}
          <TooltipIcon>
            {t(
              'translation|Shows resource details in a pane overlaid on the list view instead of a full page.'
            )}
          </TooltipIcon>
        </>
      }
    />
  );
}
