import { Box, Button, Drawer, useMediaQuery } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import CronJob from '../../lib/k8s/cronJob';
import Deployment from '../../lib/k8s/deployment';
import Job from '../../lib/k8s/job';
import ReplicaSet from '../../lib/k8s/replicaSet';
import StatefulSet from '../../lib/k8s/statefulSet';
import { setDetailDrawerOpen } from '../../redux/drawerModeSlice';
import { useTypedSelector } from '../../redux/reducers/reducers';
import DaemonSetDetails from '../daemonset/Details';
import PodDetails from '../pod/Details';
import WorkloadDetails from '../workload/Details';

export default function DetailsDrawer() {
  const drawerOpen = useTypedSelector(state => state.drawerMode.isDetailDrawerOpen);
  const dispatch = useDispatch();

  const params = useParams();

  console.log('EXAMPLE params: ', params);

  const mediaQuerySize = useMediaQuery('(min-width: 1200px)');

  // EXPERIMENTAL -------------
  //
  // const drawerNamespace = useTypedSelector(state => state.drawerMode.currentDrawerNamespace);
  // const drawerName = useTypedSelector(state => state.drawerMode.currentDrawerName);
  // const drawerResource = useTypedSelector(state => state.drawerMode.currentDrawerResource);
  // const drawerCluster = useTypedSelector(state => state.drawerMode.currentDrawerCluster);

  // --------------------------

  // const detailView = {
  //   pods: <PodDetails />,
  // };

  const drawerName = useTypedSelector(state => state.drawerMode.currentDrawerName);

  // const localDrawerName = localStorage.getItem('currentDrawerName') as string;
  const drawerNamespace = localStorage.getItem('currentDrawerNamespace') as string;
  const drawerResource = localStorage.getItem('currentDrawerResource') as string;

  console.log('drawerNamespace: ', drawerNamespace);
  console.log('drawerName: ', drawerName);
  console.log('drawerResource: ', drawerResource);

  function closeDrawer() {
    dispatch(setDetailDrawerOpen(false));
  }

  // This is used to reload the drawer, currently the most viable solution
  const [currentName, setCurrentName] = React.useState('');

  useEffect(() => {
    // refresh?
    console.log('refresh');
    console.log('CLOSING DRAWER');
    console.log('DRAWER OPEN', drawerOpen);
    console.log('IS DRAWER OPEN', drawerOpen);
    console.log('drawerNamespace: ', drawerNamespace);
    console.log('drawerName: ', drawerName);
    console.log('drawerResource: ', drawerResource);
    setCurrentName(drawerName);
  }, [drawerName]);

  console.log('drawer params: ', params);

  function drawerResourceSelector(resource: string) {
    const detailView = {
      pods: <PodDetails />,
      // deployments is missing a details component
      deployments: (
        <WorkloadDetails
          workloadKind={Deployment}
          drawerName={drawerName}
          drawerNamespace={drawerNamespace}
        />
      ),
      daemonsets: <DaemonSetDetails />,
    };

    const workloadKindList = [
      'pods',
      'deployments',
      'replicasets',
      'jobs',
      'cronjobs',
      'daemonsets',
      'statefulsets',
    ];

    if (workloadKindList.includes(resource)) {
      switch (resource) {
        case 'pods':
          return detailView.pods;
        case 'deployments':
          return detailView.deployments;
        case 'replicasets':
          return ReplicaSet;
        case 'jobs':
          return Job;
        case 'cronjobs':
          return CronJob;
        case 'daemonsets':
          return detailView.daemonsets;
        case 'statefulsets':
          return StatefulSet;
        default:
          return null;
      }
    }
  }

  // NOTE: for the refresh to remember the drawer we need to use the local drawer name first then the redux if not available
  return (
    <>
      {mediaQuerySize && (
        <Drawer variant="persistent" anchor="right" open={drawerOpen} onClose={() => closeDrawer()}>
          <Box width={800}>
            <Box style={{ marginTop: '5rem', marginBottom: '2rem' }}>
              <Button variant="outlined" color="primary" onClick={() => closeDrawer()}>
                Close
              </Button>
            </Box>
            <Box>
              {drawerName === currentName ? (
                <>{drawerResourceSelector(drawerResource)}</>
              ) : (
                () => closeDrawer()
              )}

              {/* {drawerName === currentName ? (
                <WorkloadDetails
                  workloadKind={drawerResourceSelector(drawerResource)}
                  drawerName={localDrawerName ? localDrawerName : localDrawerName}
                  drawerNamespace={drawerNamespace}
                />
              ) : null} */}

              {/* {drawerResource === 'pods' && drawerName === currentName ? (
                <WorkloadDetails
                  workloadKind={drawerResourceSelector(drawerResource)}
                  drawerName={localDrawerName ? localDrawerName : localDrawerName}
                  drawerNamespace={drawerNamespace}
                />
              ) : null} */}
            </Box>
          </Box>
        </Drawer>
      )}
    </>
  );
}
