import { Box, Drawer } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setSelectedResource } from '../../redux/drawerModeSlice';
import { useTypedSelector } from '../../redux/reducers/reducers';
import { ActionButton } from '../common';
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
        {/* Note: the top margin is needed to not clip into the topbar */}
        <Box
          sx={{
            marginTop: '4rem',
            display: 'flex',
            padding: '1rem',
            justifyContent: 'right',
          }}
        >
          <ActionButton onClick={() => closeDrawer()} icon="mdi:close" description={t('Close')} />
        </Box>
        <Box>
          <KubeObjectDetails resource={selectedResource} />
        </Box>
      </Box>
    </Drawer>
  );
}
