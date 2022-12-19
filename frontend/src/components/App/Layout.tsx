import { Box } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Link from '@material-ui/core/Link';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { request } from '../../lib/k8s/apiProxy';
import { Cluster } from '../../lib/k8s/cluster';
import { getCluster } from '../../lib/util';
import { setConfig } from '../../redux/actions/actions';
import { ConfigState } from '../../redux/reducers/config';
import { useTypedSelector } from '../../redux/reducers/reducers';
import store from '../../redux/stores/store';
import ActionsNotifier from '../common/ActionsNotifier';
import AlertNotification from '../common/AlertNotification';
import Sidebar, { drawerWidthClosed, NavigationTabs } from '../Sidebar';
import RouteSwitcher from './RouteSwitcher';
import TopBar from './TopBar';
import VersionDialog from './VersionDialog';

const useStyle = makeStyles(theme => ({
  content: {
    flexGrow: 1,
    marginLeft: 'initial',
    [theme.breakpoints.only('sm')]: {
      marginLeft: drawerWidthClosed,
    },
  },
  toolbar: theme.mixins.toolbar,
  // importing visuallyHidden has typing issues at time of writing.
  // import { visuallyHidden } from '@material-ui/utils';
  visuallyHidden: {
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
  wrapper: {
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

function ClusterNotFoundPopup(props: {
  isClusterNotAvailable: boolean;
  changeClusterNotAvailableStateHandler: (isClusterNotAvailable: boolean) => void;
}) {
  const { isClusterNotAvailable, changeClusterNotAvailableStateHandler } = props;
  const theme = useTheme();
  const cluster = getCluster();
  const { t } = useTranslation('frequent');
  const isSidebarOpen = useTypedSelector(state => state.ui.sidebar.isSidebarOpen);
  const history = useHistory();

  if (!cluster) {
    return null;
  }

  if (!isClusterNotAvailable) {
    return null;
  }
  return (
    <>
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
        <Box ml={isSidebarOpen ? '-25vw' : 0}>
          {t(`Something went wrong with cluster ${cluster}`)}
        </Box>
        <Box
          style={{ cursor: 'pointer' }}
          color={'error.main'}
          bgcolor={theme.palette.common.white}
          ml={1}
          p={0.5}
          onClick={() => {
            history.replace('/');
            changeClusterNotAvailableStateHandler(false);
          }}
        >
          {t('frequent| Take me to cluster chooser')}
        </Box>
      </Box>
    </>
  );
}

export default function Layout({}: LayoutProps) {
  const classes = useStyle();
  const arePluginsLoaded = useTypedSelector(state => state.ui.pluginsLoaded);
  const dispatch = useDispatch();
  const clusters = useTypedSelector(state => state.config.clusters);
  const { t } = useTranslation('frequent');
  const [isClusterNotAvailable, setIsClusterNotAvailable] = useState(false);

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
          Object.keys(clustersToConfig).every((key: string) => {
            const clustersCopy = _.cloneDeep(clusters[key]);
            // remove the cluster status from the comparison
            delete clustersCopy.useToken;
            if (_.isEqual(clustersCopy, clustersToConfig[key])) {
              return true;
            } else {
              dispatch(setConfig(configToStore));
              return false;
            }
          });
        }
      })
      .catch((err: Error) => {
        console.error(err);
      });
  };

  useEffect(() => {
    if (clusters && !Object.keys(clusters).includes(getCluster() || '')) {
      setIsClusterNotAvailable(true);
    }
  }, [clusters]);

  return (
    <>
      <Link href="#main" className={classes.visuallyHidden}>
        {t('Skip to main content')}
      </Link>
      <Box className={classes.wrapper}>
        <VersionDialog />
        <CssBaseline />
        <TopBar />
        <Sidebar />
        <main id="main" className={classes.content}>
          <ClusterNotFoundPopup
            isClusterNotAvailable={isClusterNotAvailable}
            changeClusterNotAvailableStateHandler={() => {
              setIsClusterNotAvailable(false);
            }}
          />
          <AlertNotification />
          <Box p={[0, 3, 3]}>
            <div className={classes.toolbar} />
            <Container maxWidth="lg">
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
    </>
  );
}
