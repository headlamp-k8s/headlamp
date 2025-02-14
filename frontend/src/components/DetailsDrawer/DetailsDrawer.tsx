import { Box, Drawer, useMediaQuery, useTheme } from '@mui/material';
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
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const isDetailDrawerEnabled = useTypedSelector(state => state.drawerMode.isDetailDrawerEnabled);

  function closeDrawer() {
    dispatch(setSelectedResource(undefined));
  }

  if (!selectedResource || isSmallScreen) {
    return null;
  }

  return (
    isDetailDrawerEnabled && (
      <Drawer variant="persistent" anchor="right" open onClose={() => closeDrawer()}>
        <Box width={'45vw'}>
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
          <Box>{selectedResource && <KubeObjectDetails resource={selectedResource} />}</Box>
        </Box>
      </Drawer>
    )
  );
}
