import React from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { setConfig } from '../../redux/actions/actions';
import { ConfigState } from '../../redux/reducers/config';
import { useTypedSelector } from '../../redux/reducers/reducers';
import { getCluster } from '../util';
import { request } from './apiProxy';
import { Cluster, KubeObject, LabelSelector, StringDict } from './cluster';
import ClusterRole from './clusterRole';
import ClusterRoleBinding from './clusterRoleBinding';
import ConfigMap from './configMap';
import CustomResourceDefinition from './crd';
import CronJob from './cronJob';
import DaemonSet from './daemonSet';
import Deployment from './deployment';
import Endpoints from './endpoints';
import HPA from './hpa';
import Ingress from './ingress';
import Job from './job';
import Namespace from './namespace';
import NetworkPolicy from './networkpolicy';
import Node from './node';
import PersistentVolume from './persistentVolume';
import PersistentVolumeClaim from './persistentVolumeClaim';
import Pod from './pod';
import PodDisruptionBudget from './podDisruptionBudget';
import PriorityClasses from './priorityClasses';
import ReplicaSet from './replicaSet';
import ResourceQuota from './resourceQuota';
import Role from './role';
import RoleBinding from './roleBinding';
import Secret from './secret';
import Service from './service';
import ServiceAccount from './serviceAccount';
import StatefulSet from './statefulSet';
import StorageClass from './storageClass';

const CLUSTER_FETCH_INTERVAL = 60 * 1000; // ms

const classList = [
  ClusterRole,
  ClusterRoleBinding,
  ConfigMap,
  CustomResourceDefinition,
  CronJob,
  DaemonSet,
  Deployment,
  Endpoints,
  ResourceQuota,
  HPA,
  PodDisruptionBudget,
  PriorityClasses,
  Ingress,
  Job,
  Namespace,
  NetworkPolicy,
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
export function useClustersConf(): ConfigState['clusters'] {
  const dispatch = useDispatch();
  const clusters = useTypedSelector(state => state.config.clusters);
  const [retry, setRetry] = React.useState(!clusters || Object.keys(clusters).length === 0);

  React.useEffect(() => {
    let retryHandler = 0;

    if (retry) {
      setRetry(false);

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

          if (
            !clusters ||
            Object.keys(clusters).length !== 0 ||
            Object.keys(clustersToConfig).length !== 0
          ) {
            dispatch(setConfig(configToStore));
          }
        })
        .catch((err: Error) => {
          console.error(err);
          retryHandler = window.setInterval(() => setRetry(true), CLUSTER_FETCH_INTERVAL);
        });

      return function cleanup() {
        if (retryHandler !== 0) {
          window.clearInterval(retryHandler);
          retryHandler = 0;
        }
      };
    }
  }, [clusters, dispatch, retry]);

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
  }, [clusters, cluster, location]);

  return cluster;
}

export function getVersion(): Promise<StringDict> {
  return request('/version');
}

export type CancellablePromise = Promise<() => void>;

export function useConnectApi(...apiCalls: (() => CancellablePromise)[]) {
  // Use the location to make sure the API calls are changed, as they may depend on the cluster
  // (defined in the URL ATM).
  // @todo: Update this if the active cluster management is changed.
  const location = useLocation();

  React.useEffect(
    () => {
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
    [location]
  );
}

/**
 * See {@link https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#list-and-watch-filtering|Label selector examples},
 * {@link https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#resources-that-support-set-based-requirements|deployment selector example},
 * {@link https://github.com/kubernetes/apimachinery/blob/be3a79b26814a8d7637d70f4d434a4626ee1c1e7/pkg/selection/operator.go#L24|possible operators}, and
 * {@link https://github.com/kubernetes/apimachinery/blob/be3a79b26814a8d7637d70f4d434a4626ee1c1e7/pkg/labels/selector.go#L305|Format rule for expressions}.
 */
export function labelSelectorToQuery(labelSelector: LabelSelector) {
  const segments: string[] = [];

  const matchLabels = labelSelector.matchLabels ?? {};
  for (const k in matchLabels) {
    segments.push(`${k}=${matchLabels[k]}`);
  }

  const matchExpressions = labelSelector.matchExpressions ?? [];
  for (const expr of matchExpressions) {
    let segment = '';
    if (expr.operator === 'DoesNotExist') {
      segment += '!';
    }

    let needsParensWrap = false;
    const NoLengthLimits = -1;
    let expectedValuesLength = NoLengthLimits;

    segment += expr.key;
    switch (expr.operator) {
      case 'Equals':
        segment += '=';
        expectedValuesLength = 1;
        break;
      case 'DoubleEquals':
        segment += '==';
        expectedValuesLength = 1;
        break;
      case 'NotEquals':
        segment += '!=';
        expectedValuesLength = 1;
        break;
      case 'In':
        segment += ' in ';
        needsParensWrap = true;
        break;
      case 'NotIn':
        segment += ' notin ';
        needsParensWrap = true;
        break;
      case 'GreaterThan':
        segment += '>';
        expectedValuesLength = 1;
        break;
      case 'LessThan':
        segment += '<';
        expectedValuesLength = 1;
        break;
      case 'Exists':
      case 'DoesNotExist':
        expectedValuesLength = 0;
        break;
    }

    let values = '';

    if (expectedValuesLength === 1) {
      values = expr.values[0] ?? '';
    } else if (expectedValuesLength === NoLengthLimits) {
      values = [...(expr.values ?? [])].sort().join(',');
      if (needsParensWrap) {
        values = '(' + values + ')';
      }
    }

    segment += values;
    segments.push(segment);
  }

  if (segments.length === 0) {
    return '';
  }

  return segments.join(',');
}

// Other exports that can be used by plugins:
export * as cluster from './cluster';
export * as clusterRole from './clusterRole';
export * as clusterRoleBinding from './clusterRoleBinding';
export * as configMap from './configMap';
export * as crd from './crd';
export * as cronJob from './cronJob';
export * as daemonSet from './daemonSet';
export * as deployment from './deployment';
export * as event from './event';
export * as ingress from './ingress';
export * as job from './job';
export * as namespace from './namespace';
export * as node from './node';
export * as persistentVolume from './persistentVolume';
export * as persistentVolumeClaim from './persistentVolumeClaim';
export * as pod from './pod';
export * as replicaSet from './replicaSet';
export * as role from './role';
export * as roleBinding from './roleBinding';
export * as secret from './secret';
export * as service from './service';
export * as serviceAccount from './serviceAccount';
export * as statefulSet from './statefulSet';
export * as storageClass from './storageClass';
