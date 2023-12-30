import { Box, Button } from '@mui/material';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import _ from 'lodash';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { request } from '../../lib/k8s/apiProxy';
import { Cluster } from '../../lib/k8s/cluster';
import { getCluster } from '../../lib/util';
import { setConfig } from '../../redux/configSlice';
import { ConfigState } from '../../redux/configSlice';
import { useTypedSelector } from '../../redux/reducers/reducers';
import store from '../../redux/stores/store';
import ActionsNotifier from '../common/ActionsNotifier';
import AlertNotification from '../common/AlertNotification';
import Sidebar, { NavigationTabs } from '../Sidebar';
import RouteSwitcher from './RouteSwitcher';
import TopBar from './TopBar';
import VersionDialog from './VersionDialog';

const PREFIX = 'Layout';

const classes = {
  content: `${PREFIX}-content`,
  toolbar: `${PREFIX}-toolbar`,
  visuallyHidden: `${PREFIX}-visuallyHidden`,
  wrapper: `${PREFIX}-wrapper`,
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')(({ theme }) => ({
  [`& .${classes.content}`]: {
    flexGrow: 1,
    marginLeft: 'initial',
  },
  [`& .${classes.toolbar}`]: theme.mixins.toolbar,
  // importing visuallyHidden has typing issues at time of writing.
  // import { visuallyHidden } from '@mui/utils';
  [`& .${classes.visuallyHidden}`]: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: '1px',
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: '1px',
  },
  [`& .${classes.wrapper}`]: {
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      display: 'block',
    },
  },
}));

export interface LayoutProps {}

const CLUSTER_FETCH_INTERVAL = 10 * 1000; // ms

interface Config {
  [prop: string]: any;
}

function ClusterNotFoundPopup() {
  const theme = useTheme();
  const cluster = getCluster();
  const { t } = useTranslation();

  return (
    <Box
      display={'flex'}
      justifyContent="center"
      style={{
        position: 'absolute',
        color: theme.palette.common.white,
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

export default function Layout({}: LayoutProps) {
  const arePluginsLoaded = useTypedSelector(state => state.plugins.loaded);
  const dispatch = useDispatch();
  const clusters = useTypedSelector(state => state.config.clusters);
  const { t } = useTranslation();
  const clusterInURL = getCluster();

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
    request('/config', {}, false, false)
      .then((config: Config) => {
        const clustersToConfig: ConfigState['clusters'] = {};
        config?.clusters.forEach((cluster: Cluster) => {
          clustersToConfig[cluster.name] = cluster;
        });
        const configToStore = {
          ...config,
          clusters: clustersToConfig,
        };

        if (clusters === null) {
          dispatch(setConfig(configToStore));
        } else if (Object.keys(clustersToConfig).length !== Object.keys(clusters).length) {
          dispatch(setConfig(configToStore));
        } else {
          let isConfigDifferent = false;
          Object.keys(clustersToConfig).every((key: string) => {
            // The length of the old cluster list and the new one may be the same, so we need
            // to check if the cluster is present in the new list (happens when renaming a
            // cluster for example).
            if (!!clusters[key]) {
              let clusterToCompare = clusters[key];

              // Remove the cluster status from the comparison if needed (in which case we copy
              // the cluster object to avoid modifying the original one).
              if (clusterToCompare.useToken !== undefined) {
                clusterToCompare = _.cloneDeep(clusters[key]);
                delete clusterToCompare.useToken;
              }

              if (_.isEqual(clusterToCompare, clustersToConfig[key])) {
                return true;
              }
            }

            isConfigDifferent = true;
            return false;
          });

          if (isConfigDifferent) {
            dispatch(setConfig(configToStore));
          }
        }
      })
      .catch((err: Error) => {
        console.error('Error getting config:', err);
      });
  };

  return (
    <Root>
      <Link href="#main" className={classes.visuallyHidden}>
        {t('Skip to main content')}
      </Link>
      <Box className={classes.wrapper}>
        <VersionDialog />
        <CssBaseline />
        <TopBar />
        <Sidebar />
        <main id="main" className={classes.content}>
          {clusters && !!clusterInURL && !Object.keys(clusters).includes(getCluster() || '') ? (
            <ClusterNotFoundPopup />
          ) : (
            ''
          )}
          <AlertNotification />
          <Box>
            <div className={classes.toolbar} />
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
        </main>
        <ActionsNotifier />
      </Box>
    </Root>
  );
}
