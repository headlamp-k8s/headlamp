import { Icon, InlineIcon } from '@iconify/react';
import { Box, Chip, FormControl, IconButton, MenuItem, Select, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import helpers, { ClusterSettings } from '../../../helpers';
import { useCluster, useClustersConf } from '../../../lib/k8s';
import { deleteCluster, parseKubeConfig, renameCluster } from '../../../lib/k8s/apiProxy';
import { setConfig, setStatelessConfig } from '../../../redux/configSlice';
import { findKubeconfigByClusterName, updateStatelessClusterKubeconfig } from '../../../stateless/';
import { NameValueTable, SectionBox } from '../../common';
import ConfirmButton from '../../common/ConfirmButton';
import Empty from '../../common/EmptyContent';

function isValidNamespaceFormat(namespace: string) {
  // We allow empty strings just because that's the default value in our case.
  if (!namespace) {
    return true;
  }

  // Validates that the namespace is a valid DNS-1123 label and returns a boolean.
  // https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#dns-label-names
  const regex = new RegExp('^[a-z0-9]([-a-z0-9]*[a-z0-9])?$');
  return regex.test(namespace);
}

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

export default function SettingsCluster() {
  const clusterConf = useClustersConf();
  const clusters = Object.values(clusterConf || {}).map(cluster => cluster.name);
  const { t } = useTranslation(['translation']);
  const [defaultNamespace, setDefaultNamespace] = React.useState('default');
  const [userDefaultNamespace, setUserDefaultNamespace] = React.useState('');
  const [newAllowedNamespace, setNewAllowedNamespace] = React.useState('');
  const [clusterSettings, setClusterSettings] = React.useState<ClusterSettings | null>(null);
  const [cluster, setCluster] = React.useState(useCluster() || '');
  const [newClusterName, setNewClusterName] = React.useState(cluster || '');
  const theme = useTheme();

  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();

  const clusterInfo = (clusterConf && clusterConf[cluster || '']) || null;
  const source = clusterInfo?.meta_data?.source || '';

  const handleUpdateClusterName = (source: string) => {
    try {
      renameCluster(cluster || '', newClusterName, source)
        .then(async config => {
          if (cluster) {
            const kubeconfig = await findKubeconfigByClusterName(cluster);
            if (kubeconfig !== null) {
              await updateStatelessClusterKubeconfig(kubeconfig, newClusterName, cluster);
              // Make another request for updated kubeconfig
              const updatedKubeconfig = await findKubeconfigByClusterName(cluster);
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

  const removeCluster = () => {
    deleteCluster(cluster || '')
      .then(config => {
        dispatch(setConfig(config));
        history.push('/');
      })
      .catch((err: Error) => {
        if (err.message === 'Not Found') {
          // TODO: create notification with error message
        }
      });
  };

  // check if cluster was loaded by user
  const removableCluster = React.useMemo(() => {
    if (!cluster) {
      return false;
    }

    const clusterInfo = (clusterConf && clusterConf[cluster]) || null;
    return clusterInfo?.meta_data?.source === 'dynamic_cluster';
  }, [cluster, clusterConf]);

  React.useEffect(() => {
    setClusterSettings(!!cluster ? helpers.loadClusterSettings(cluster || '') : null);
  }, [cluster]);

  React.useEffect(() => {
    const clusterInfo = (clusterConf && clusterConf[cluster || '']) || null;
    const clusterConfNs = clusterInfo?.meta_data?.namespace;
    if (!!clusterConfNs && clusterConfNs !== defaultNamespace) {
      setDefaultNamespace(clusterConfNs);
    }
  }, [cluster, clusterConf]);

  React.useEffect(() => {
    if (clusterSettings?.defaultNamespace !== userDefaultNamespace) {
      setUserDefaultNamespace(clusterSettings?.defaultNamespace || '');
    }

    if (clusterSettings?.currentName !== cluster) {
      setNewClusterName(clusterSettings?.currentName || '');
    }

    // Avoid re-initializing settings as {} just because the cluster is not yet set.
    if (clusterSettings !== null) {
      helpers.storeClusterSettings(cluster || '', clusterSettings);
    }
  }, [cluster, clusterSettings]);

  React.useEffect(() => {
    let timeoutHandle: NodeJS.Timeout | null = null;

    if (isEditingDefaultNamespace()) {
      // We store the namespace after a timeout.
      timeoutHandle = setTimeout(() => {
        if (isValidNamespaceFormat(userDefaultNamespace)) {
          storeNewDefaultNamespace(userDefaultNamespace);
        }
      }, 1000);
    }

    return () => {
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
        timeoutHandle = null;
      }
    };
  }, [userDefaultNamespace]);

  React.useEffect(() => {
    const clusterFromUrl = new URLSearchParams(location.search).get('c');
    if (clusterFromUrl && clusters.includes(clusterFromUrl)) {
      setCluster(clusterFromUrl);
    } else if (clusters.length > 0 && !clusterFromUrl) {
      setCluster(clusters[0]);
      history.replace(`/settings/cluster?c=${clusters[0]}`);
    } else {
      setCluster('');
    }
  }, [location.search, clusters]);

  function isEditingDefaultNamespace() {
    return clusterSettings?.defaultNamespace !== userDefaultNamespace;
  }

  function storeNewAllowedNamespace(namespace: string) {
    setNewAllowedNamespace('');
    setClusterSettings((settings: ClusterSettings | null) => {
      const newSettings = { ...(settings || {}) };
      newSettings.allowedNamespaces = newSettings.allowedNamespaces || [];
      newSettings.allowedNamespaces.push(namespace);
      // Sort and avoid duplicates
      newSettings.allowedNamespaces = [...new Set(newSettings.allowedNamespaces)].sort();
      return newSettings;
    });
  }

  function storeNewDefaultNamespace(namespace: string) {
    let actualNamespace = namespace;
    if (namespace === defaultNamespace) {
      actualNamespace = '';
      setUserDefaultNamespace(actualNamespace);
    }

    setClusterSettings((settings: ClusterSettings | null) => {
      const newSettings = { ...(settings || {}) };
      if (isValidNamespaceFormat(namespace)) {
        newSettings.defaultNamespace = actualNamespace;
      }
      return newSettings;
    });
  }

  function storeNewClusterName(name: string) {
    let actualName = name;
    if (name === cluster) {
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

  const isValidDefaultNamespace = isValidNamespaceFormat(userDefaultNamespace);
  const isValidCurrentName = isValidClusterNameFormat(newClusterName);
  const isValidNewAllowedNamespace = isValidNamespaceFormat(newAllowedNamespace);
  const invalidNamespaceMessage = t(
    "translation|Namespaces must contain only lowercase alphanumeric characters or '-', and must start and end with an alphanumeric character."
  );

  const invalidClusterNameMessage = t(
    "translation|Cluster name must contain only lowercase alphanumeric characters or '-', and must start and end with an alphanumeric character."
  );

  const clusterFromUrl = new URLSearchParams(location.search).get('c');

  return (
    <>
      <SectionBox
        title={t('translation|Cluster Settings ({{ clusterName }})', {
          clusterName: cluster || clusterFromUrl,
        })}
        backLink
      >
        {cluster ? (
          <>
            <FormControl variant="outlined" margin="normal" sx={{ minWidth: 250 }}>
              <Select
                value={cluster}
                onChange={event => {
                  setCluster(event.target.value);
                  history.replace(`/settings/cluster?c=${event.target.value}`);
                }}
                autoWidth
              >
                {clusters.map(clusterName => (
                  <MenuItem key={clusterName} value={clusterName}>
                    {clusterName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <NameValueTable
              rows={[
                {
                  name: t('translation|Name'),
                  value: (
                    <TextField
                      onChange={event => {
                        let value = event.target.value;
                        value = value.replace(' ', '');
                        setNewClusterName(value);
                      }}
                      value={newClusterName}
                      placeholder={cluster}
                      error={!isValidCurrentName}
                      helperText={
                        isValidCurrentName
                          ? t(
                              'translation|The current name of cluster. You can define custom modified name.'
                            )
                          : invalidClusterNameMessage
                      }
                      InputProps={{
                        endAdornment: (
                          <Box textAlign="right">
                            <ConfirmButton
                              onConfirm={() => {
                                if (isValidCurrentName) {
                                  handleUpdateClusterName(source);
                                }
                              }}
                              confirmTitle={t('translation|Change name')}
                              confirmDescription={t(
                                'translation|Are you sure you want to change the name for "{{ clusterName }}"?',
                                { clusterName: cluster }
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
                  ),
                },
              ]}
            />
            <NameValueTable
              rows={[
                {
                  name: t('translation|Default namespace'),
                  value: (
                    <TextField
                      onChange={event => {
                        let value = event.target.value;
                        value = value.replace(' ', '');
                        setUserDefaultNamespace(value);
                      }}
                      value={userDefaultNamespace}
                      placeholder={defaultNamespace}
                      error={!isValidDefaultNamespace}
                      helperText={
                        isValidDefaultNamespace
                          ? t(
                              'translation|The default namespace for e.g. when applying resources (when not specified directly).'
                            )
                          : invalidNamespaceMessage
                      }
                      InputProps={{
                        endAdornment: isEditingDefaultNamespace() ? (
                          <Icon
                            width={24}
                            color={theme.palette.text.secondary}
                            icon="mdi:progress-check"
                          />
                        ) : (
                          <Icon width={24} icon="mdi:check-bold" />
                        ),
                        sx: { maxWidth: 250 },
                      }}
                    />
                  ),
                },
                {
                  name: t('translation|Allowed namespaces'),
                  value: (
                    <>
                      <TextField
                        onChange={event => {
                          let value = event.target.value;
                          value = value.replace(' ', '');
                          setNewAllowedNamespace(value);
                        }}
                        placeholder="namespace"
                        error={!isValidNewAllowedNamespace}
                        value={newAllowedNamespace}
                        helperText={
                          isValidNewAllowedNamespace
                            ? t(
                                'translation|The list of namespaces you are allowed to access in this cluster.'
                              )
                            : invalidNamespaceMessage
                        }
                        autoComplete="off"
                        inputProps={{
                          form: {
                            autocomplete: 'off',
                          },
                        }}
                        InputProps={{
                          endAdornment: (
                            <IconButton
                              onClick={() => {
                                storeNewAllowedNamespace(newAllowedNamespace);
                              }}
                              disabled={!newAllowedNamespace}
                              size="medium"
                            >
                              <InlineIcon icon="mdi:plus-circle" />
                            </IconButton>
                          ),
                          onKeyPress: event => {
                            if (event.key === 'Enter') {
                              storeNewAllowedNamespace(newAllowedNamespace);
                            }
                          },
                          autoComplete: 'off',
                          sx: { maxWidth: 250 },
                        }}
                      />
                      <Box aria-label={t('translation|Allowed namespaces')}>
                        {((clusterSettings || {}).allowedNamespaces || []).map(namespace => (
                          <Chip
                            key={namespace}
                            label={namespace}
                            size="small"
                            clickable={false}
                            onDelete={() => {
                              setClusterSettings(settings => {
                                const newSettings = { ...settings };
                                newSettings.allowedNamespaces =
                                  newSettings.allowedNamespaces?.filter(ns => ns !== namespace);
                                return newSettings;
                              });
                            }}
                          />
                        ))}
                      </Box>
                    </>
                  ),
                },
              ]}
            />
          </>
        ) : (
          <Empty color="error">
            {t(
              'translation|Cluster {{ clusterName }} does not exist. Please select a valid cluster.',
              {
                clusterName: clusterFromUrl,
              }
            )}
          </Empty>
        )}
      </SectionBox>
      {removableCluster && helpers.isElectron() && (
        <Box pt={2} textAlign="right">
          <ConfirmButton
            color="secondary"
            onConfirm={() => removeCluster()}
            confirmTitle={t('translation|Remove Cluster')}
            confirmDescription={t(
              'translation|Are you sure you want to remove the cluster "{{ clusterName }}"?',
              { clusterName: cluster }
            )}
          >
            {t('translation|Remove Cluster')}
          </ConfirmButton>
        </Box>
      )}
    </>
  );
}
