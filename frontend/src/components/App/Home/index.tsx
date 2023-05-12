import { Icon } from '@iconify/react';
import {
  ButtonBase,
  ButtonBaseProps,
  Card,
  CardContent,
  Grid,
  makeStyles,
  Typography,
  useTheme,
} from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, useHistory } from 'react-router-dom';
import helpers from '../../../helpers';
import { useClustersConf } from '../../../lib/k8s';
import { Cluster } from '../../../lib/k8s/cluster';
import { createRouteURL } from '../../../lib/router';
import { getClusterPrefixedPath } from '../../../lib/util';
import { PageGrid, SectionBox, SectionFilterHeader, SimpleTable } from '../../common';

interface ClusterButtonProps extends React.PropsWithChildren<{}> {
  cluster: Cluster;
  onClick?: (...args: any[]) => void;
  focusedRef?: (node: any) => void;
}

interface BigButtonProps extends ButtonBaseProps {
  icon: string;
  iconSize?: number;
  iconColor?: string;
  label: string;
  primary?: boolean;
}

const useBigButtonStyles = makeStyles(theme => ({
  root: {
    width: 140,
    height: 140,
    paddingTop: '24px',
    backgroundColor: ({ primary }: { primary: boolean }) =>
      primary ? theme.palette.text.primary : theme.palette.sidebarBg,
  },
  content: {
    textAlign: 'center',
    paddingTop: 0,
  },
  label: {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    display: 'block',
    fontSize: '1rem',
    paddingTop: '8px',
    color: ({ primary }: { primary: boolean }) =>
      primary ? theme.palette.primary.contrastText : theme.palette.text.primary,
  },
}));

function SquareButton(props: BigButtonProps) {
  const { icon, iconSize = 50, iconColor, label, primary = false, ...otherProps } = props;
  const classes = useBigButtonStyles({ primary });
  const theme = useTheme();

  return (
    <ButtonBase focusRipple {...otherProps}>
      <Card className={classes.root}>
        <CardContent className={classes.content}>
          <Icon
            icon={icon}
            width={iconSize}
            height={iconSize}
            color={
              iconColor ||
              (primary ? theme.palette.primary.contrastText : theme.palette.text.primary)
            }
          />
          <Typography color="textSecondary" gutterBottom className={classes.label} title={label}>
            {label}
          </Typography>
        </CardContent>
      </Card>
    </ButtonBase>
  );
}

function ClusterButton(props: ClusterButtonProps) {
  const { cluster, onClick = undefined, focusedRef } = props;

  return (
    <SquareButton
      focusRipple
      icon="mdi:kubernetes"
      label={cluster.name}
      ref={focusedRef}
      onClick={onClick}
    />
  );
}

interface ClusterListProps {
  clusters: Cluster[];
  onButtonClick: (cluster: Cluster) => void;
}

function ClusterList(props: ClusterListProps) {
  const { clusters } = props;
  const history = useHistory();
  const focusedRef = React.useCallback(node => {
    if (node !== null) {
      node.focus();
    }
  }, []);
  const { t } = useTranslation('cluster');
  const recentClustersLabelId = 'recent-clusters-label';
  const maxRecentClusters = 3;
  // We slice it here for the maximum recent clusters just for extra safety, since this
  // is an entry point to the rest of the functionality
  const recentClusterNames = helpers.getRecentClusters().slice(0, maxRecentClusters);

  let recentClusters: Cluster[] = [];

  // If we have more than the maximum number of recent clusters allowed, we show the most
  // recent ones. Otherwise, just show the clusters in the order they are received.
  if (clusters.length > maxRecentClusters) {
    // Get clusters matching the recent cluster names, if they exist still.
    recentClusters = recentClusterNames
      .map(name => clusters.find(cluster => cluster.name === name))
      .filter(item => !!item) as Cluster[];
    // See whether we need to fill with new clusters (when the recent clusters were less than the
    // maximum/wanted).
    const neededClusters = maxRecentClusters - recentClusters.length;
    if (neededClusters > 0) {
      recentClusters = recentClusters.concat(
        clusters.filter(item => !recentClusters.includes(item)).slice(0, neededClusters)
      );
    }
  } else {
    recentClusters = clusters;
  }

  function onClusterButtonClicked(cluster: Cluster) {
    helpers.setRecentCluster(cluster);
    history.push({
      pathname: generatePath(getClusterPrefixedPath(), {
        cluster: cluster.name,
      }),
    });
  }

  return (
    <Grid
      aria-labelledby={`#${recentClustersLabelId}`}
      item
      container
      alignItems="flex-start"
      // justifyContent={clusters.length > maxRecentClusters ? 'space-between' : 'center'}
      spacing={2}
    >
      {recentClusters.map((cluster, i) => (
        <Grid item key={cluster.name}>
          <ClusterButton
            focusedRef={i === 0 ? focusedRef : undefined}
            cluster={cluster}
            onClick={() => onClusterButtonClicked(cluster)}
          />
        </Grid>
      ))}
      {helpers.isElectron() && (
        <Grid item>
          <SquareButton
            onClick={() => {
              history.push(createRouteURL('loadKubeConfig'));
            }}
            label={t('frequent|Load cluster')}
            icon="mdi:plus-circle-outline"
            primary
          />
        </Grid>
      )}
    </Grid>
  );
}

export default function Home() {
  const { t } = useTranslation(['glossary', 'frequent']);
  const clusters = useClustersConf() || [];

  return (
    <PageGrid>
      <SectionBox title={t('Home')}>
        <ClusterList clusters={Object.values(clusters)} onButtonClick={() => {}} />
      </SectionBox>
      <SectionBox
        title={
          <SectionFilterHeader
            title={t('All Clusters')}
            noNamespaceFilter
            headerStyle="subsection"
          />
        }
      >
        <SimpleTable
          columns={[
            {
              label: t('frequent|Name'),
              getter: ({ name }: Cluster) => name,
            },
          ]}
          data={Object.values(clusters)}
        />
      </SectionBox>
    </PageGrid>
  );
}
