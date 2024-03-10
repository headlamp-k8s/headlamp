import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { post } from '../../lib/k8s/apiProxy';
import Namespace from '../../lib/k8s/namespace';
import { clusterAction } from '../../redux/clusterActionSlice';
import { EventStatus, HeadlampEventType, useEventCallback } from '../../redux/headlampEventSlice';
import { ActionButton, AuthVisible } from '../common';

export function CreateNamespaceButton() {
  const { t } = useTranslation(['glossary', 'translation']);
  const [namespaceName, setNamespaceName] = useState('');
  const [namespaceDialogOpen, setNamespaceDialogOpen] = useState(false);
  const dispatchCreateEvent = useEventCallback(HeadlampEventType.CREATE_RESOURCE);
  const location = useLocation();
  const dispatch = useDispatch();

  function createNewNamespace() {
    async function namespaceRequest() {
      const newNamespaceData = {
        apiVersion: 'v1',
        kind: 'Namespace',
        metadata: {
          name: namespaceName,
        },
      };
      try {
        const response = await post('/api/v1/namespaces', newNamespaceData);
        return response;
      } catch (error) {
        console.error('Error creating namespace', error);
        throw error;
      }
    }

    setNamespaceDialogOpen(false);
    dispatch(
      clusterAction(() => namespaceRequest(), {
        startMessage: t('Creating namespace {{ itemName }}…', { namespaceName }),
        cancelledMessage: t('Cancelled creation of {{ itemName }}.', { namespaceName }),
        successMessage: t('Created Namespace {{ itemName }}.', { namespaceName }),
        errorMessage: t('Error creating namespace {{ itemName }}.', { namespaceName }),
        cancelUrl: location.pathname,
      })
    );
  }

  return (
    <AuthVisible item={Namespace} authVerb="create">
      <ActionButton
        color="primary"
        description={t('translation|Create')}
        icon={'mdi:plus-circle'}
        onClick={() => {
          setNamespaceDialogOpen(true);
        }}
      />

      <Dialog open={namespaceDialogOpen} onClose={() => setNamespaceDialogOpen(false)}>
        <DialogTitle>{t('translation|Create Namespace')}</DialogTitle>
        <DialogContent>
          <Box component="form" style={{ width: '20vw', maxWidth: '20vw' }}>
            <TextField
              margin="dense"
              id="name"
              label={t('translation|Name')}
              type="text"
              fullWidth
              value={namespaceName}
              onChange={event => setNamespaceName(event.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setNamespaceDialogOpen(false);
            }}
          >
            {t('translation|Cancel')}
          </Button>
          <Button
            onClick={() => {
              createNewNamespace();
              dispatchCreateEvent({
                status: EventStatus.CONFIRMED,
              });
            }}
          >
            {t('translation|Create')}
          </Button>
        </DialogActions>
      </Dialog>
    </AuthVisible>
  );
}
