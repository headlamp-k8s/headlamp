import { Box, Button, Drawer } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setSelectedResource } from '../../redux/drawerModeSlice';
import { useTypedSelector } from '../../redux/reducers/reducers';
import { KubeObjectDetails } from '../resourceMap/details/KubeNodeDetails';

export default function DetailsDrawer() {
  const { t } = useTranslation();

  const selectedResource = useTypedSelector(state => state.drawerMode.selectedResource);

  const dispatch = useDispatch();

  function closeDrawer() {
    dispatch(setSelectedResource(undefined));
  }

  if (!selectedResource) {
    return null;
  }

  return (
    <Drawer variant="persistent" anchor="right" open onClose={() => closeDrawer()}>
      <Box width={800}>
        <Box style={{ marginTop: '5rem', marginBottom: '2rem' }}>
          <Button variant="outlined" color="primary" onClick={() => closeDrawer()}>
            {t('Close')}
          </Button>
        </Box>
        <Box>
          <KubeObjectDetails resource={selectedResource} />
        </Box>
      </Box>
    </Drawer>
  );
}
