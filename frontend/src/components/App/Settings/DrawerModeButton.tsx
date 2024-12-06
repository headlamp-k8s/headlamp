import { FormControlLabel, Switch } from '@mui/material';
import React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setDetailDrawerEnabled } from '../../../redux/drawerModeSlice';
import { useTypedSelector } from '../../../redux/reducers/reducers';
import { TooltipIcon } from '../../common';

export default function DrawerModeButton() {
  const dispatch = useDispatch();
  const { t } = useTranslation('translation');

  const [isDrawerEnabled, changeDetailDrawerEnabled] = useState<any>(
    useTypedSelector(state => state.drawerMode.isDetailDrawerEnabled)
  );

  if (isDrawerEnabled) {
    dispatch(setDetailDrawerEnabled(true));
  } else {
    dispatch(setDetailDrawerEnabled(false));
  }

  // the useEffect will run everytime the isDrawerEnabled state changes, which is everytime the user clicks the switch button because the switch button changes the state of isDrawerEnabled
  useEffect(() => {
    dispatch(setDetailDrawerEnabled(isDrawerEnabled));
  }, [isDrawerEnabled]);

  // this function takes in the current changes and updates it, this kicks off the useEffect that is listening for changes to newDrawerEnabled
  function drawerModeToggle() {
    changeDetailDrawerEnabled(!isDrawerEnabled);
  }

  // NOTICE THAT WE DO NOT USE isDrawerEnabled TO DETERMINE HOW THE SWITCH IS RENDERED UNDER THE CHECKED PROP, THIS IS BECAUSE THE USEEFFECT WILL RERENDER THE COMPONENT WITH THE NEW STATE
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
          {t('translation|Drawer Mode')}
          <TooltipIcon>
            {t('translation|Enable details to render in side drawer window')}
          </TooltipIcon>
        </>
      }
    />
  );
}
