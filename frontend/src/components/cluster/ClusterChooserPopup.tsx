import { Icon } from '@iconify/react';
import {
  ListItemIcon,
  ListSubheader,
  MenuItem,
  MenuList,
  Popover,
  useMediaQuery,
} from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath } from 'react-router';
import { useHistory } from 'react-router-dom';
import helpers from '../../helpers';
import { useCluster, useClustersConf } from '../../lib/k8s';
import { Cluster } from '../../lib/k8s/cluster';
import { createRouteURL } from '../../lib/router';
import { getCluster, getClusterPrefixedPath } from '../../lib/util';

const useStyles = makeStyles(theme => ({
  button: {
    backgroundColor: theme.palette.sidebarBg,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      color: theme.palette.text.primary,
    },
    width: '100%',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    textTransform: 'none',
  },
  list: {
    width: '280px',
    minWidth: '280px',
    minHeight: '200px',
    maxHeight: '50vh',
    overflowY: 'auto',
    position: 'relative',

    '& .MuiListItemIcon-root': {
      minWidth: 0,
      paddingRight: theme.spacing(2),
    },
    '& .MuiListItem-gutters': {
      paddingLeft: 0,
    },
  },
  recentClustersSubheader: {
    paddingLeft: 0,
    lineHeight: theme.typography.pxToRem(24),
  },
  popover: {
    marginTop: '-5px',
  },
}));

function ClusterListItem(props: { cluster: Cluster; onClick: () => void; selected?: boolean }) {
  const { cluster, selected, onClick } = props;
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <MenuItem
      selected={selected}
      key={`recent_cluster_${cluster.name}`}
      onClick={onClick}
      id={cluster.name}
    >
      <ListItemIcon>
        <Icon icon="mdi:kubernetes" width={26} color={theme.palette.text.primary} />
      </ListItemIcon>
      <ListItemText
        primary={cluster.name}
        secondary={!!cluster.isCurrent ? t('Current', { context: 'cluster' }) : ''}
      />
    </MenuItem>
  );
}

export interface ChooserPopupPros {
  /** The element to which the popup will be anchored. */
  anchor: HTMLElement | null;
  /** Callback to be called when the popup is closed. */
  onClose?: (() => void) | null;
}

/** A popup that allows the user to choose a cluster.
 * @param anchor The element to which the popup will be anchored.
 * @param onClose Callback to be called when the popup is closed.
 */
function ClusterChooserPopup(props: ChooserPopupPros) {
  const { t } = useTranslation(['translation']);
  const { anchor, onClose, ...otherProps } = props;
  const [filter, setFilter] = React.useState('');
  const clusters = useClustersConf();
  const history = useHistory();
  const classes = useStyles();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeDescendantIndex, setActiveDescendantIndex] = React.useState<number>(-1);

  const focusedRef = React.useCallback(node => {
    if (node !== null) {
      node.focus();
    }
  }, []);
  const currentCluster = useCluster();

  function handleClose() {
    setFilter('');

    if (!!onClose) {
      onClose();
    }
  }

  const [recentClusters, clustersToShow] = React.useMemo(() => {
    let allClusters = Object.values(clusters || {});
    if (filter !== '') {
      allClusters = allClusters.filter(cluster => cluster.name.includes(filter));
    }

    const recentClustersNames = !!filter ? [] : helpers.getRecentClusters();

    const clustersToShow: Cluster[] = [];
    const recentClusters: Cluster[] = [];

    allClusters.forEach(c => {
      const cluster = { ...c };
      if (c.name === currentCluster) {
        cluster.isCurrent = true;
      }

      if (recentClustersNames.includes(c.name)) {
        recentClusters.push(cluster);
      } else {
        clustersToShow.push(cluster);
      }
    });

    recentClusters.sort((a, b) => {
      if (a.isCurrent) {
        return -1;
      } else if (b.isCurrent) {
        return 1;
      }

      return 0;
    });

    clustersToShow.sort((a, b) => {
      if (a.isCurrent) {
        return -1;
      } else if (b.isCurrent) {
        return 1;
      }

      return a.name.localeCompare(b.name);
    });

    return [recentClusters, clustersToShow];
  }, [clusters, currentCluster, filter]);

  React.useEffect(() => {
    setActiveDescendantIndex(-1);
  }, [filter]);

  function selectCluster(cluster: Cluster) {
    handleClose();

    if (cluster.name !== getCluster()) {
      helpers.setRecentCluster(cluster);
      history.push({
        pathname: generatePath(getClusterPrefixedPath(), {
          cluster: cluster.name,
        }),
      });
    }
  }

  const activeDescendantProp = React.useMemo(() => {
    const cluster = getActiveDescendantCluster();

    if (!cluster) {
      return {};
    }

    return {
      'aria-activedescendant': cluster.name,
    };
  }, [activeDescendantIndex]);

  function getActiveDescendantCluster() {
    const allClusters = [...recentClusters, ...clustersToShow];
    if (activeDescendantIndex === -1 || activeDescendantIndex >= allClusters.length) {
      return null;
    }

    return allClusters[activeDescendantIndex];
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    switch (e.key) {
      case 'ArrowUp': {
        setActiveDescendantIndex(
          idx => (idx - 1) % (recentClusters.length + clustersToShow.length)
        );
        break;
      }
      case 'ArrowDown': {
        setActiveDescendantIndex(
          idx => (idx + 1) % (recentClusters.length + clustersToShow.length)
        );
        break;
      }
      case 'Enter': {
        const cluster = getActiveDescendantCluster();
        if (!!cluster) {
          selectCluster(cluster);
        }
        break;
      }
    }
  }

  if (!anchor) {
    return null;
  }

  return (
    <Popover
      open={!!anchor}
      anchorEl={isSmallScreen ? null : anchor}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: isSmallScreen ? 'center' : 'left',
      }}
      transformOrigin={{
        vertical: isSmallScreen ? 'center' : 'top',
        horizontal: isSmallScreen ? 'center' : 'left',
      }}
      aria-labelledby="chooser-dialog-title"
      aria-busy={clusters === null}
      className={classes.popover}
      {...otherProps}
    >
      <Box p={2}>
        <TextField
          label={t('Choose cluster')}
          id="filled-size-small"
          placeholder={t('translation|Name')}
          size="small"
          fullWidth
          InputLabelProps={{ shrink: true }}
          onChange={e => setFilter(e.target.value)}
          inputRef={focusedRef}
          onKeyDown={onKeyDown}
          InputProps={{
            'aria-owns': 'cluster-chooser-list',
            'aria-haspopup': 'listbox',
          }}
          {...activeDescendantProp}
        />
        <MenuList id="cluster-chooser-list" className={classes.list} dense>
          {recentClusters.length > 0 && (
            <>
              {
                // We only show the subheader if the recent clusters list is not all the clusters we have.
                clustersToShow.length > 0 && (
                  <ListSubheader disableSticky className={classes.recentClustersSubheader}>
                    {t('Recent clusters')}
                  </ListSubheader>
                )
              }
              {recentClusters.map(cluster => (
                <ClusterListItem
                  key={`recent_cluster_${cluster.name}`}
                  cluster={cluster}
                  onClick={() => selectCluster(cluster)}
                  selected={cluster.name === getActiveDescendantCluster()?.name}
                />
              ))}
            </>
          )}
          {clustersToShow.length > 0 && recentClusters.length > 0 && <Divider />}
          {clustersToShow.map(cluster => (
            <ClusterListItem
              key={`cluster_button_${cluster.name}`}
              cluster={cluster}
              onClick={() => selectCluster(cluster)}
              selected={cluster.name === getActiveDescendantCluster()?.name}
            />
          ))}
        </MenuList>
      </Box>
      {helpers.isElectron() && (
        <>
          <Button
            className={classes.button}
            onClick={() => history.push(createRouteURL('loadKubeConfig'))}
          >
            {t('translation|Add Cluster')}
          </Button>
        </>
      )}
    </Popover>
  );
}

export default ClusterChooserPopup;
