import { Box, Button, Chip, Grid, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Autocomplete } from '@material-ui/lab';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { deleteGroupSettings, storeGroupSettings } from '../../../lib/clusterGroup';
import { useClustersConf } from '../../../lib/k8s';
import { createRouteURL } from '../../../lib/router';
import { getClusterGroupInfo } from '../../../lib/util';
import { NameValueTable, SectionBox } from '../../common';
import ConfirmButton from '../../common/ConfirmButton';

const useStyles = makeStyles(theme => ({
  chipBox: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
    marginTop: theme.spacing(1),
  },
  input: {
    maxWidth: 250,
  },
  blackButton: {
    backgroundColor: theme.palette.sidebarBg,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      opacity: '0.8',
      backgroundColor: theme.palette.sidebarBg,
    },
  },
}));

// @todo: This is a copy of the function in frontend/src/lib/util.tsx. So let's add
// it to a common place.
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

export default function SettingsClusterGroup({ isCreate = false }: { isCreate?: boolean }) {
  const history = useHistory();
  const originalGroupInfo = React.useMemo(
    () => (isCreate ? null : getClusterGroupInfo()),
    [history]
  );
  const clusterConf = useClustersConf();
  const { t } = useTranslation(['settings', 'frequent', 'cluster']);
  const [groupName, setGroupName] = React.useState((!isCreate && originalGroupInfo?.name) || '');
  const classes = useStyles();
  const [group, setGroup] = React.useState(originalGroupInfo || { name: groupName, clusters: [] });

  const isValidName = isValidNamespaceFormat(groupName);
  const invalidNamespaceMessage = t(
    "cluster|Must contain only lowercase alphanumeric characters or '-', and must start and end with an alphanumeric character."
  );

  function onClusterAdd(cluster: string) {
    const newGroup = {
      ...group,
    };
    newGroup.clusters = [...new Set([...newGroup.clusters, cluster])].sort();
    setGroup(newGroup);

    if (!isCreate && !!newGroup?.name) {
      storeGroupSettings(newGroup);
    }
  }

  function onClusterRemove(cluster: string) {
    const newGroup = {
      ...group,
    };
    newGroup.clusters = newGroup.clusters.filter(c => c !== cluster);
    setGroup(newGroup);
  }

  React.useEffect(() => {
    if (!isCreate && isValidName && !!group?.name) {
      storeGroupSettings(group);
    }
  }, [group]);

  React.useEffect(() => {
    let timeoutHandle: NodeJS.Timeout | null = null;
    let stillMounted = true;

    // We store the namespace after a timeout.
    timeoutHandle = setTimeout(() => {
      if (!stillMounted) {
        return;
      }

      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
      }

      if (isValidNamespaceFormat(groupName)) {
        setGroup(group => ({ name: groupName, clusters: group.clusters }));
      }
    }, 1000);

    return () => {
      stillMounted = false;
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
        timeoutHandle = null;
      }
    };
  }, [groupName]);

  function createGroup() {
    storeGroupSettings(group);
    history.push(createRouteURL('cluster', { cluster: group.name }));
  }

  function saveGroup() {
    storeGroupSettings(group);
    history.push(createRouteURL('settingsCluster', { cluster: group.name }));
  }

  function hasChanges() {
    return (
      group.name !== originalGroupInfo?.name ||
      group.clusters.filter(clusterName => !originalGroupInfo?.clusters.includes(clusterName))
        .length > 0
    );
  }

  return (
    <>
      <SectionBox
        title={isCreate ? t('settings|Create Group') : t('settings|Cluster Group Settings')}
        backLink
      >
        <NameValueTable
          rows={[
            {
              name: t('cluster|Name'),
              value: (
                <TextField
                  onChange={event => {
                    let value = event.target.value;
                    value = value.replace(' ', '');
                    setGroupName(value);
                  }}
                  value={groupName}
                  error={!isValidName}
                  placeholder={t('settings|e.g. my-group')}
                  helperText={
                    isValidName
                      ? t('cluster|Must not clash with other groups or cluster names.')
                      : invalidNamespaceMessage
                  }
                />
              ),
            },
            {
              name: t('cluster|Clusters'),
              value: (
                <>
                  <Autocomplete
                    id="cluster-in-group-selector-autocomplete"
                    options={Object.values(clusterConf || {})}
                    getOptionLabel={option => option.name}
                    style={{ width: '100%' }}
                    disableClearable
                    autoComplete
                    includeInputInList
                    openOnFocus
                    renderInput={params => (
                      <TextField
                        {...params}
                        label={t('cluster|All clusters')}
                        variant="outlined"
                        value=""
                      />
                    )}
                    onChange={(_event, cluster) => onClusterAdd(cluster.name)}
                  />
                  <Box className={classes.chipBox} aria-label={t('cluster|Allowed namespaces')}>
                    {group?.clusters.map(clusterName => (
                      // @todo: Replace this with a list.
                      <Chip
                        key={clusterName}
                        label={clusterName}
                        clickable={false}
                        onDelete={() => {
                          onClusterRemove(clusterName);
                        }}
                      />
                    ))}
                  </Box>
                </>
              ),
            },
          ]}
        />
      </SectionBox>
      <Box pt={2}>
        <Grid container justifyContent="space-between">
          <Grid item>
            {!isCreate ? (
              <ConfirmButton
                color="secondary"
                onConfirm={() => deleteGroupSettings(group.name)}
                confirmTitle={t('cluster|Remove Group')}
                confirmDescription={t(
                  'cluster|Are you sure you want to remove the group "{{ name }}"?',
                  { name: group.name }
                )}
              >
                {t('cluster|Remove Group')}
              </ConfirmButton>
            ) : null}
          </Grid>
          <Grid item>
            <Button
              color="primary"
              variant="contained"
              onClick={() => {
                if (isCreate) {
                  createGroup();
                } else {
                  saveGroup();
                }
              }}
              disabled={!isValidName || !group.name || !hasChanges() || group.clusters.length === 0}
              className={!isValidName || !group.name ? undefined : classes.blackButton}
            >
              {isCreate ? t('cluster|Create Group') : t('frequent|Save')}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
