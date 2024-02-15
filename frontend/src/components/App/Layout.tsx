import { Box, Button } from '@mui/material';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useClustersConf } from '../../lib/k8s';
import { request } from '../../lib/k8s/apiProxy';
import { Cluster } from '../../lib/k8s/cluster';
import { getCluster } from '../../lib/util';
import { setConfig } from '../../redux/configSlice';
import { ConfigState } from '../../redux/configSlice';
import { useTypedSelector } from '../../redux/reducers/reducers';
import store from '../../redux/stores/store';
import { fetchStatelessClusterKubeConfigs, processClusterComparison } from '../../stateless/';
import ActionsNotifier from '../common/ActionsNotifier';
import AlertNotification from '../common/AlertNotification';
import Sidebar, { NavigationTabs } from '../Sidebar';
import RouteSwitcher from './RouteSwitcher';
import TopBar from './TopBar';
import VersionDialog from './VersionDialog';

export interface LayoutProps {}

const CLUSTER_FETCH_INTERVAL = 10 * 1000; // ms

function ClusterNotFoundPopup() {
  const cluster = getCluster();
  const { t } = useTranslation();

  return (
    <Box
      display={'flex'}
      justifyContent="center"
      sx={{
        position: 'absolute',
        color: 'common.white',
        textAlign: 'center',
      }}
      bgcolor={'error.main'}
      zIndex={1400}
      width={'100%'}
      p={0.5}
      alignItems="center"
    >
      <Box p={0.5}>{t(`Something went wrong with cluster {{ cluster }}`, { cluster })}</Box>
      <Button variant="contained" size="small" href="/">
        {t('Choose another cluster')}
      </Button>
    </Box>
  );
}
const Div = styled('div')``;
const Main = styled('main')``;

export default function Layout({}: LayoutProps) {
  const arePluginsLoaded = useTypedSelector(state => state.plugins.loaded);
  const dispatch = useDispatch();
  const clusters = useTypedSelector(state => state.config.clusters);
  const { t } = useTranslation();
  const allClusters = useClustersConf();
  const clusterInURL = getCluster();
  const theme = useTheme();

  /** This fetches the cluster config from the backend and updates the redux store on an interval.
   * When stateless clusters are enabled, it also fetches the stateless cluster config from the
   * indexDB and then sends the backend to parse it and then updates the parsed value into redux
   * store on an interval.
   * */
  useEffect(() => {
    window.clusterConfigFetchHandler = setInterval(
      () => {
        fetchConfig();
      },
      CLUSTER_FETCH_INTERVAL,
      clusters
    );
    fetchConfig();
    return () => {
      if (window.clusterConfigFetchHandler) {
        clearInterval(window.clusterConfigFetchHandler);
      }
    };
  }, []);

  /**
   * Fetches the cluster config from the backend and updates the redux store
   * if the present stored config is different from the fetched one.
   */
  const fetchConfig = () => {
    const clusters = store.getState().config.clusters;
    const statelessClusters = store.getState().config.statelessClusters;

    request('/config', {}, false, false)
      .then(config => {
        const clustersToConfig: ConfigState['clusters'] = {};
        config?.clusters.forEach((cluster: Cluster) => {
          clustersToConfig[cluster.name] = cluster;
        });

        const configToStore = { ...config, clusters: clustersToConfig };

        if (clusters === null) {
          dispatch(setConfig(configToStore));
        } else {
          const isConfigDifferent = processClusterComparison(clusters, clustersToConfig, false);

          if (
            isConfigDifferent ||
            Object.keys(clustersToConfig).length !== Object.keys(clusters).length
          ) {
            if (statelessClusters !== null) {
              processClusterComparison(clusters, statelessClusters, true);
            }

            dispatch(setConfig(configToStore));
          }
        }

        /**
         * Fetches the stateless cluster config from the indexDB and then sends the backend to parse it
         * only if the stateless cluster config is enabled in the backend.
         */
        if (config?.isDynamicClusterEnabled) {
          fetchStatelessClusterKubeConfigs(dispatch);
        }
      })
      .catch(err => {
        console.error('Error getting config:', err);
      });
  };

  return (
    <>
      <Link
        href="#main"
        sx={{
          border: 0,
          clip: 'rect(0 0 0 0)',
          height: '1px',
          margin: -1,
          overflow: 'hidden',
          padding: 0,
          position: 'absolute',
          whiteSpace: 'nowrap',
          width: '1px',
        }}
      >
        {t('Skip to main content')}
      </Link>
      <Box sx={{ display: 'flex', [theme.breakpoints.down('sm')]: { display: 'block' } }}>
        <VersionDialog />
        <CssBaseline />
        <TopBar />
        <Sidebar />
        <Main id="main" sx={{ flexGrow: 1, marginLeft: 'initial' }}>
          {allClusters &&
          !!clusterInURL &&
          !Object.keys(allClusters).includes(getCluster() || '') ? (
            <ClusterNotFoundPopup />
          ) : (
            ''
          )}
          <AlertNotification />
          <Box>
            <Div sx={theme.mixins.toolbar} />
            <Container maxWidth="xl">
              <NavigationTabs />
              {arePluginsLoaded && (
                <RouteSwitcher
                  requiresToken={() => {
                    const clusterName = getCluster() || '';
                    const cluster = clusters ? clusters[clusterName] : undefined;
                    return cluster?.useToken === undefined || cluster?.useToken;
                  }}
                />
              )}
            </Container>
          </Box>
        </Main>
        <ActionsNotifier />
      </Box>
    </>
  );
}
