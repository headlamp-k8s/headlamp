import React from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { setConfig } from '../../redux/actions/actions';
import { ConfigState } from '../../redux/reducers/config';
import { useTypedSelector } from '../../redux/reducers/reducers';
import { getCluster } from '../util';
import { request } from './apiProxy';
import { Cluster, KubeObject, StringDict } from './cluster';
import ClusterRole from './clusterRole';
import ClusterRoleBinding from './clusterRoleBinding';
import ConfigMap from './configMap';
import CustomResourceDefinition from './crd';
import CronJob from './cronJob';
import DaemonSet from './daemonSet';
import Deployment from './deployment';
import Ingress from './ingress';
import Job from './job';
import Namespace from './namespace';
import Node from './node';
import PersistentVolume from './persistentVolume';
import PersistentVolumeClaim from './persistentVolumeClaim';
import Pod from './pod';
import ReplicaSet from './replicaSet';
import Role from './role';
import RoleBinding from './roleBinding';
import Secret from './secret';
import Service from './service';
import ServiceAccount from './serviceAccount';
import StatefulSet from './statefulSet';
import StorageClass from './storageClass';

const classList = [
  ClusterRole,
  ClusterRoleBinding,
  ConfigMap,
  CustomResourceDefinition,
  CronJob,
  DaemonSet,
  Deployment,
  Ingress,
  Job,
  Namespace,
  Node,
  PersistentVolume,
  PersistentVolumeClaim,
  Pod,
  ReplicaSet,
  Role,
  RoleBinding,
  Secret,
  Service,
  ServiceAccount,
  StatefulSet,
  StorageClass,
];

const resourceClassesDict: {
  [className: string]: KubeObject;
} = {};

classList.forEach(cls => {
  // Ideally this should just be the class name, but until we ensure the class name is consistent
  // (in what comes to the capitalization), we use this lazy approach.
  const className: string = cls.className.charAt(0).toUpperCase() + cls.className.slice(1);
  resourceClassesDict[className] = cls;
});

export const ResourceClasses = resourceClassesDict;

interface Config {
  [prop: string]: any;
}

// Hook for getting or fetching the clusters configuration.
export function useClustersConf() {
  const dispatch = useDispatch();
  const clusters = useTypedSelector(state => state.config.clusters);

  React.useEffect(() => {
    if (Object.keys(clusters).length === 0) {
      request('/config', {}, false, false)
        .then((config: Config) => {
          const clusters: ConfigState['clusters'] = {};
          config?.clusters.forEach((cluster: Cluster) => {
            clusters[cluster.name] = cluster;
          });

          const configToStore = {
            ...config,
            clusters
          };
          dispatch(setConfig(configToStore));
        })
        .catch((err: Error) => console.error(err));
      return;
    }
  },
  [clusters, dispatch]);

  return clusters;
}

export function useCluster() {
  const [cluster, setCluster] = React.useState<string | null>(null);
  // Make sure we update when changing clusters.
  // @todo: We need a better way to do this.
  const location = useLocation();
  const clusters = useClustersConf();

  React.useEffect(() => {
    const currentCluster = getCluster();
    if (cluster !== currentCluster) {
      setCluster(getCluster());
    }
  },
  [clusters, cluster, location]);

  return cluster;
}

export function getVersion(): Promise<StringDict> {
  return request('/version');
}

type CancellablePromise = Promise<() => void>;

export function useConnectApi(...apiCalls: (() => CancellablePromise)[]) {
  // Use the location to make sure the API calls are changed, as they may depend on the cluster
  // (defined in the URL ATM).
  // @todo: Update this if the active cluster management is changed.
  const location = useLocation();

  React.useEffect(() => {
    const cancellables = apiCalls.map(func => func());

    return function cleanup() {
      for (const cancellablePromise of cancellables) {
        cancellablePromise.then(cancellable => cancellable());
      }
    };
  },
    // If we add the apiCalls to the dependency list, then it actually
    // results in undesired reloads.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location]);
}
