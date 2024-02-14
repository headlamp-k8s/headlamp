import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { getCluster } from '../../lib/cluster';
import Namespace from '../../lib/k8s/namespace';
import { clusterAction } from '../../redux/clusterActionSlice';
import { EventStatus, HeadlampEventType, useEventCallback } from '../../redux/headlampEventSlice';
import { ActionButton, AuthVisible } from '../common';

export default function CreateNamespaceButton() {
  const { t } = useTranslation(['glossary', 'translation']);
  const [namespaceName, setNamespaceName] = useState('');
  const [isValidNamespaceName, setIsValidNamespaceName] = useState(false);
  const [nameHelperMessage, setNameHelperMessage] = useState('');
  const [namespaceDialogOpen, setNamespaceDialogOpen] = useState(false);
  const dispatchCreateEvent = useEventCallback(HeadlampEventType.CREATE_RESOURCE);
  const dispatch = useDispatch();

  function createNewNamespace() {
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
        const response = await Namespace.apiEndpoint.post(newNamespaceData, {}, clusterData || '');
        setNamespaceName('');
        return response;
      } catch (error: any) {
        const statusCode = error?.status;
        console.error('Error creating namespace:', error);
        if (statusCode === 409) {
          setNamespaceDialogOpen(true);
          setIsValidNamespaceName(false);
          setNameHelperMessage(t('translation|A namespace with this name already exists.'));
        }
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

  useEffect(() => {
    const isValidNamespaceFormat = Namespace.isValidNamespaceFormat(namespaceName);
    setIsValidNamespaceName(isValidNamespaceFormat);

    if (!isValidNamespaceFormat) {
      if (namespaceName.length > 63) {
        setNameHelperMessage(t('translation|Namespaces must be under 64 characters.'));
      } else {
        setNameHelperMessage(
          t(
            "translation|Namespaces must contain only lowercase alphanumeric characters or '-', and must start and end with an alphanumeric character."
          )
        );
      }
    }
  }, [namespaceName]);

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

      <Dialog
        aria-label="Dialog"
        open={namespaceDialogOpen}
        onClose={() => setNamespaceDialogOpen(false)}
      >
        <DialogTitle>{t('translation|Create Namespace')}</DialogTitle>
        <DialogContent>
          <Box component="form" style={{ width: '20vw', maxWidth: '20vw' }}>
            <TextField
              margin="dense"
              id="name"
              aria-label="Name"
              label={t('translation|Name')}
              type="text"
              error={!isValidNamespaceName && namespaceName.length > 0}
              helperText={
                !isValidNamespaceName && namespaceName.length > 0 ? nameHelperMessage : ''
              }
              fullWidth
              value={namespaceName}
              onChange={event => setNamespaceName(event.target.value.toLowerCase())}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (isValidNamespaceName) {
                    createNewNamespace();
                    dispatchCreateEvent({
                      status: EventStatus.CONFIRMED,
                    });
                  }
                }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            aria-label="Cancel"
            onClick={() => {
              setNamespaceDialogOpen(false);
            }}
          >
            {t('translation|Cancel')}
          </Button>
          <Button
            aria-label="Create"
            disabled={!isValidNamespaceName}
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
