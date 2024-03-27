import { FormControlLabel, Switch } from '@mui/material';
import React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setDetailDrawerEnabled } from '../../../redux/drawerModeSlice';
import { useTypedSelector } from '../../../redux/reducers/reducers';

export default function DrawerModeButton() {
  const dispatch = useDispatch();
  const { t } = useTranslation('translation');
  // This will fix the problem of the project refreshing the state away from needed position

  // DETAIL DRAWER MODE
  const isDetailDrawerEnabled = useTypedSelector(state => state.drawerMode.isDetailDrawerEnabled);
  // const localDetailDrawerEnabled = localStorage.getItem('detailDrawerEnabled');
  const [isDrawerEnabled, changeDetailDrawerEnabled] = useState<any>(isDetailDrawerEnabled);

  if (isDetailDrawerEnabled) {
    console.log('THE LOCAL STORAGE IS TRUE');
    dispatch(setDetailDrawerEnabled(true));
    console.log('READING FROM DISPATCHED STATE', isDetailDrawerEnabled);
  } else {
    console.log(" THE LOCAL STORAGE IS NULL, UNDEFINED, OR 'FALSE' ");
    dispatch(setDetailDrawerEnabled(false));
    console.log('READING FROM DISPATCHED STATE', isDetailDrawerEnabled);
  }

  console.log('BUTTON - isDetailDrawerEnabled', isDetailDrawerEnabled);

  // the useEffect will run everytime the isDrawerEnabled state changes, which is everytime the user clicks the switch button because the switch button changes the state of isDrawerEnabled
  useEffect(() => {
    dispatch(setDetailDrawerEnabled(isDrawerEnabled));
    console.log('ON SETTINGS');
    console.log(localStorage.getItem('detailDrawerEnabled'));
  }, [isDrawerEnabled]);

  // this function takes in the current changes and updates it, this kicks off the useEffect that is listening for changes to newDrawerEnabled
  function drawerModeToggle() {
    console.log('drawerModeToggle');
    changeDetailDrawerEnabled(!isDrawerEnabled);
  }

  // NOTICE THAT WE DO NOT USE isDrawerEnabled TO DETERMINE HOW THE SWITCH IS RENDERED UNDER THE CHECKED PROP, THIS IS BECAUSE THE USEEFFECT WILL RERENDER THE COMPONENT WITH THE NEW STATE
  return (
    <FormControlLabel
      control={
        <Switch
          checked={isDetailDrawerEnabled}
          onClick={drawerModeToggle}
          name="drawerMode"
          color="primary"
        />
      }
      // will need to replace label
      label={t('translation|Drawer Mode')}
    />
  );
}
