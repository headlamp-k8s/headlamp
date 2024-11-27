import { Box, FormControl, MenuItem, Select, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import helpers, { ClusterSettings } from '../../../helpers';
import { useCluster, useClustersConf } from '../../../lib/k8s';
import { deleteCluster } from '../../../lib/k8s/apiProxy';
import { setConfig } from '../../../redux/configSlice';
import { Link, Loader, NameValueTable, NameValueTableRow, SectionBox } from '../../common';
import ConfirmButton from '../../common/ConfirmButton';
import Empty from '../../common/EmptyContent';
import AllowedNamespaces from './AllowedNamespaces';
import CustomClusterName from './CustomClusterName';
import DefaultNamespace from './DefaultNamespace';

interface ClusterSelectorProps {
  currentCluster?: string;
  clusters: string[];
}

function ClusterSelector(props: ClusterSelectorProps) {
  const { currentCluster = '', clusters } = props;
  const history = useHistory();
  const { t } = useTranslation('glossary');

  return (
    <FormControl variant="outlined" margin="normal" sx={{ minWidth: 250 }}>
      <Select
        labelId="settings--cluster-selector"
        value={currentCluster}
        onChange={event => {
          history.replace(`/settings/cluster?c=${event.target.value}`);
        }}
        label={t('glossary|Cluster')}
        autoWidth
        aria-label={t('glossary|Cluster selector')}
      >
        {clusters.map(clusterName => (
          <MenuItem key={clusterName} value={clusterName}>
            {clusterName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default function SettingsCluster() {
  const clusterConf = useClustersConf();
  const clusters = Object.values(clusterConf || {}).map(cluster => cluster.name);
  const { t } = useTranslation(['translation']);
  const [clusterSettings, setClusterSettings] = React.useState<ClusterSettings | null>(null);
  const [cluster, setCluster] = React.useState(useCluster() || '');
  const clusterFromURLRef = React.useRef('');
  const theme = useTheme();

  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();

  const clusterInfo = (clusterConf && clusterConf[cluster || '']) || null;
  const source = clusterInfo?.meta_data?.source || '';

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
    const clusterFromUrl = new URLSearchParams(location.search).get('c');
    clusterFromURLRef.current = clusterFromUrl || '';

    if (clusterFromUrl && clusters.includes(clusterFromUrl)) {
      setCluster(clusterFromUrl);
    } else if (clusters.length > 0 && !clusterFromUrl) {
      history.replace(`/settings/cluster?c=${clusters[0]}`);
    } else {
      setCluster('');
    }
  }, [location.search, clusters]);

  // If we don't have yet a cluster name from the URL, we are still loading.
  if (!clusterFromURLRef.current) {
    return <Loader title="Loading" />;
  }

  if (clusters.length === 0) {
    return (
      <>
        <SectionBox title={t('translation|Cluster Settings')} backLink />
        <Empty color={theme.palette.mode === 'dark' ? 'error.light' : 'error.main'}>
          {t('translation|There seem to be no clusters configured…')}
        </Empty>
      </>
    );
  }

  if (!cluster) {
    return (
      <>
        <SectionBox title={t('translation|Cluster Settings')} backLink>
          <Typography
            color={theme.palette.mode === 'dark' ? 'error.light' : 'error.main'}
            component="h3"
            variant="h6"
          >
            {t(
              'translation|Cluster {{ clusterName }} does not exist. Please select a valid cluster:',
              {
                clusterName: clusterFromURLRef.current,
              }
            )}
          </Typography>
          <ClusterSelector clusters={clusters} />
        </SectionBox>
      </>
    );
  }
  let prefixRows: NameValueTableRow[] = [];
  if (helpers.isElectron()) {
    prefixRows = [
      {
        name: t('translation|Name'),
        value: (
          <CustomClusterName
            currentCluster={cluster}
            clusterSettings={clusterSettings}
            source={source}
            setClusterSettings={setClusterSettings}
          />
        ),
      },
    ];
  }

  const rows = [
    {
      name: t('translation|Default namespace'),
      value: (
        <DefaultNamespace
          currentCluster={cluster}
          clusterSettings={clusterSettings}
          clusterConf={clusterConf}
          clusterFromURLRef={clusterFromURLRef}
          setClusterSettings={setClusterSettings}
        />
      ),
    },
    {
      name: t('translation|Allowed namespaces'),
      value: (
        <AllowedNamespaces
          clusterSettings={clusterSettings}
          setClusterSettings={setClusterSettings}
        />
      ),
    },
  ];

  return (
    <>
      <SectionBox
        title={t('translation|Cluster Settings ({{ clusterName }})', {
          clusterName: cluster,
        })}
        backLink
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <ClusterSelector clusters={clusters} currentCluster={cluster} />
          <Link
            routeName="cluster"
            params={{ cluster: cluster }}
            tooltip={t('translation|Go to cluster')}
          >
            {t('translation|Go to cluster')}
          </Link>
        </Box>
        <NameValueTable rows={[...prefixRows, ...rows]} />
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
