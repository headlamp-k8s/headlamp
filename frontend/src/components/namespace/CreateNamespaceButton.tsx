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
import { getCluster } from '../../lib/cluster';
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
  const dispatch = useDispatch();

  function createNewNamespace() {
    if (!Namespace.isValidNamespaceFormat(namespaceName)) {
      alert(
        t(
          "translation|Namespaces must be under 64 characters, contain only lowercase alphanumeric characters or '-', and must start and end with an alphanumeric character."
        )
      );
      return;
    }

    const clusterData = getCluster();
    const newNamespaceData = {
      apiVersion: 'v1',
      kind: 'Namespace',
      metadata: {
        name: namespaceName,
      },
    };
    const newNamespaceName = newNamespaceData.metadata.name;

    async function namespaceRequest() {
      try {
        return await post('/api/v1/namespaces', newNamespaceData, true, {
          cluster: clusterData || '',
        });
      } catch (error) {
        console.error('Error creating namespace', error);
        throw error;
      }
    }

    setNamespaceDialogOpen(false);
    dispatch(
      clusterAction(() => namespaceRequest(), {
        startMessage: t('translation|Applying {{  newItemName  }}…', {
          newItemName: newNamespaceName,
        }),
        cancelledMessage: t('translation|Cancelled applying  {{  newItemName  }}.', {
          newItemName: newNamespaceName,
        }),
        successMessage: t('translation|Applied {{ newItemName }}.', {
          newItemName: newNamespaceName,
        }),
        errorMessage: t('translation|Failed to create {{ kind }} {{ name }}.', {
          kind: 'namespace',
          name: newNamespaceName,
        }),
        cancelCallback: () => {
          setNamespaceDialogOpen(true);
        },
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
