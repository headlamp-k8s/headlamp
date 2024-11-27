import { Box, TextField } from '@mui/material';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import helpers, { ClusterSettings } from '../../../helpers';
import { parseKubeConfig, renameCluster } from '../../../lib/k8s/apiProxy';
import { setConfig, setStatelessConfig } from '../../../redux/configSlice';
import { findKubeconfigByClusterName, updateStatelessClusterKubeconfig } from '../../../stateless/';
import { ConfirmButton } from '../../common';

function isValidClusterNameFormat(name: string) {
  // We allow empty isValidClusterNameFormat just because that's the default value in our case.
  if (!name) {
    return true;
  }

  // Validates that the namespace is a valid DNS-1123 label and returns a boolean.
  // https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#dns-label-names
  const regex = new RegExp('^[a-z0-9]([-a-z0-9]*[a-z0-9])?$');
  return regex.test(name);
}

interface CustomClusterNameProps {
  currentCluster?: string;
  clusterSettings: ClusterSettings | null;
  source: string;
  setClusterSettings: Dispatch<SetStateAction<ClusterSettings | null>>;
}

export default function CustomClusterName(props: CustomClusterNameProps) {
  const { currentCluster = '', clusterSettings, source, setClusterSettings } = props;
  const { t } = useTranslation(['translation']);
  const [newClusterName, setNewClusterName] = useState(currentCluster || '');
  const isValidCurrentName = isValidClusterNameFormat(newClusterName);
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    if (clusterSettings?.currentName !== currentCluster) {
      setNewClusterName(clusterSettings?.currentName || '');
    }

    // Avoid re-initializing settings as {} just because the cluster is not yet set.
    if (clusterSettings !== null) {
      helpers.storeClusterSettings(currentCluster || '', clusterSettings);
    }
  }, [currentCluster, clusterSettings]);

  const handleUpdateClusterName = (source: string) => {
    try {
      renameCluster(currentCluster || '', newClusterName, source)
        .then(async config => {
          if (currentCluster) {
            const kubeconfig = await findKubeconfigByClusterName(currentCluster);
            if (kubeconfig !== null) {
              await updateStatelessClusterKubeconfig(kubeconfig, newClusterName, currentCluster);
              // Make another request for updated kubeconfig
              const updatedKubeconfig = await findKubeconfigByClusterName(currentCluster);
              if (updatedKubeconfig !== null) {
                parseKubeConfig({ kubeconfig: updatedKubeconfig })
                  .then((config: any) => {
                    storeNewClusterName(newClusterName);
                    dispatch(setStatelessConfig(config));
                  })
                  .catch((err: Error) => {
                    console.error('Error updating cluster name:', err.message);
                  });
              }
            } else {
              dispatch(setConfig(config));
            }
          }
          history.push('/');
          window.location.reload();
        })
        .catch((err: Error) => {
          console.error('Error updating cluster name:', err.message);
        });
    } catch (error) {
      console.error('Error updating cluster name:', error);
    }
  };

  function storeNewClusterName(name: string) {
    let actualName = name;
    if (name === currentCluster) {
      actualName = '';
      setNewClusterName(actualName);
    }

    setClusterSettings((settings: ClusterSettings | null) => {
      const newSettings = { ...(settings || {}) };
      if (isValidClusterNameFormat(name)) {
        newSettings.currentName = actualName;
      }
      return newSettings;
    });
  }

  const invalidClusterNameMessage = t(
    "translation|Cluster name must contain only lowercase alphanumeric characters or '-', and must start and end with an alphanumeric character."
  );
  return (
    <TextField
      onChange={event => {
        let value = event.target.value;
        value = value.replace(' ', '');
        setNewClusterName(value);
      }}
      value={newClusterName}
      placeholder={currentCluster}
      error={!isValidCurrentName}
      helperText={
        isValidCurrentName
          ? t('translation|The current name of cluster. You can define custom modified name.')
          : invalidClusterNameMessage
      }
      InputProps={{
        endAdornment: (
          <Box pt={2} textAlign="right">
            <ConfirmButton
              onConfirm={() => {
                if (isValidCurrentName) {
                  handleUpdateClusterName(source);
                }
              }}
              confirmTitle={t('translation|Change name')}
              confirmDescription={t(
                'translation|Are you sure you want to change the name for "{{ clusterName }}"?',
                { clusterName: currentCluster }
              )}
              disabled={!newClusterName || !isValidCurrentName}
            >
              {t('translation|Apply')}
            </ConfirmButton>
          </Box>
        ),
        onKeyPress: event => {
          if (event.key === 'Enter' && isValidCurrentName) {
            handleUpdateClusterName(source);
          }
        },
        autoComplete: 'off',
        sx: { maxWidth: 250 },
      }}
    />
  );
}
