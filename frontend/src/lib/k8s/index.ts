import React from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { setConfig } from '../../redux/actions/actions';
import { useTypedSelector } from '../../redux/reducers/reducers';
import { request } from './apiProxy';
import { KubeObjectClass, StringDict } from './cluster';
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
  Service,
  ServiceAccount,
  StatefulSet,
  StorageClass,
];

const resourceClassesDict: {
  [className: string]: KubeObjectClass;
} = {};

classList.forEach(cls => {
  resourceClassesDict[cls.className] = cls;
});

export const ResourceClasses = resourceClassesDict;

// Hook for getting or fetching the clusters configuration.
export function useClustersConf() {
  const dispatch = useDispatch();
  const clusters = useTypedSelector(state => state.config.clusters);

  React.useEffect(() => {
    if (clusters.length === 0) {
      request('/config', {}, false, false)
        .then((config: object) => {
          dispatch(setConfig(config));
        })
        .catch((err: Error) => console.error(err));
      return;
    }
  },
  [clusters, dispatch]);

  return clusters;
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
