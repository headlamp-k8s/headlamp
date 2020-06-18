import React from 'react';
import { generatePath } from 'react-router';
import Auth from '../components/account/Auth';
import Chooser from '../components/cluster/Chooser';
import Overview from '../components/cluster/Overview';
import ConfigDetails from '../components/configmap/Details';
import ConfigMapList from '../components/configmap/List';
import CustomResourceDefinitionDetails from '../components/crd/Details';
import CustomResourceDefinitionList from '../components/crd/List';
import DaemonSetDetails from '../components/daemonset/Details';
import IngressDetails from '../components/ingress/Details';
import IngressList from '../components/ingress/List';
import NamespaceDetails from '../components/namespace/Details';
import NamespacesList from '../components/namespace/List';
import NodeDetails from '../components/node/Details';
import NodeList from '../components/node/List';
import PodDetails from '../components/pod/Details';
import PodList from '../components/pod/List';
import ReplicaSetList from '../components/replicaset/List';
import RoleBindingDetails from '../components/role/BindingDetails';
import RoleBindingList from '../components/role/BindingList';
import RoleDetails from '../components/role/Details';
import RoleList from '../components/role/List';
import SecretDetails from '../components/secret/Details';
import SecretList from '../components/secret/List';
import ServiceDetails from '../components/service/Details';
import ServiceList from '../components/service/List';
import ServiceAccountDetails from '../components/serviceaccount/Details';
import ServiceAccountList from '../components/serviceaccount/List';
import StatefulSet from '../components/statefulset/Details';
import PersistentVolumeClaimDetails from '../components/storage/ClaimDetails';
import PersistentVolumeClaimList from '../components/storage/ClaimList';
import StorageClassDetails from '../components/storage/ClassDetails';
import StorageClassList from '../components/storage/ClassList';
import PersistentVolumeDetails from '../components/storage/VolumeDetails';
import PersistentVolumeList from '../components/storage/VolumeList';
import WorkloadDetails from '../components/workload/Details';
import WorkloadOverview from '../components/workload/Overview';
import store from '../redux/stores/store';
import { getCluster, getClusterPrefixedPath } from './util';

export interface Route {
  path: string;
  exact?: boolean;
  name?: string;
  noCluster?: boolean;
  noAuthRequired?: boolean;
  sidebar: string | null;
  component: () => JSX.Element;
}

export const ROUTES: {
  [routeName: string]: Route;
} = {
  cluster: {
    path: '/',
    exact: true,
    name: 'Cluster',
    sidebar: 'cluster',
    component: () => <Overview />
  },
  chooser: {
    path: '/',
    exact: true,
    sidebar: null,
    noCluster: true,
    noAuthRequired: true,
    component: () => <Chooser useCover />
  },
  namespaces: {
    path: '/namespaces',
    name: 'Namespaces',
    exact: true,
    sidebar: 'namespaces',
    component: () => <NamespacesList />
  },
  namespace: {
    path: '/namespaces/:name',
    sidebar: 'namespaces',
    component: () => <NamespaceDetails />
  },
  nodes: {
    path: '/nodes',
    name: 'Nodes',
    exact: true,
    sidebar: 'nodes',
    component: () => <NodeList />
  },
  node: {
    path: '/nodes/:name',
    sidebar: 'nodes',
    component: () => <NodeDetails />
  },
  storageClasses: {
    path: '/storage/classes',
    exact: true,
    sidebar: 'storageClasses',
    name: 'Storage Classes',
    component: () => <StorageClassList />
  },
  storageClassDetails: {
    path: '/storage/classes/:name',
    name: 'Storage Classes',
    sidebar: 'storageClasses',
    component: () => <StorageClassDetails />
  },
  storageVolumes: {
    path: '/storage/persistentvolumes',
    exact: true,
    sidebar: 'storageVolumes',
    name: 'Persistent Volumes',
    component: () => <PersistentVolumeList />
  },
  persistentVolume: {
    path: '/storage/persistentvolumes/:name',
    exact: true,
    sidebar: 'storageVolumes',
    name: 'Persistent Volume',
    component: () => <PersistentVolumeDetails />
  },
  persistentVolumeClaims: {
    path: '/storage/persistentvolumeclaims',
    exact: true,
    sidebar: 'persistentVolumeClaims',
    name: 'Persistent Volume Claims',
    component: () => <PersistentVolumeClaimList />
  },
  persistentVolumeClaim: {
    path: '/storage/persistentvolumeclaims/:namespace/:name',
    sidebar: 'persistentVolumeClaims',
    exact: true,
    component: () => <PersistentVolumeClaimDetails />
  },
  workloads: {
    path: '/workload',
    exact: true,
    name: 'Workloads',
    sidebar: 'workloads',
    component: () => <WorkloadOverview />
  },
  DaemonSet: {
    path: '/daemonsets/:namespace/:name',
    exact: true,
    sidebar: 'workloads',
    component: () => <DaemonSetDetails />
  },
  StatefulSet: {
    path: '/statefulsets/:namespace/:name',
    exact: true,
    sidebar: 'workloads',
    component: () => <StatefulSet />
  },
  Deployment: {
    path: '/deployments/:namespace/:name',
    exact: true,
    sidebar: 'workloads',
    component: () => <WorkloadDetails workloadKind="Deployment" />
  },
  Job: {
    path: '/jobs/:namespace/:name',
    exact: true,
    sidebar: 'workloads',
    component: () => <WorkloadDetails workloadKind="Job" />
  },
  CronJob: {
    path: '/cronjobs/:namespace/:name',
    exact: true,
    sidebar: 'workloads',
    component: () => <WorkloadDetails workloadKind="CronJob" />
  },
  pods: {
    path: '/pods',
    exact: true,
    name: 'Pods',
    sidebar: 'pods',
    component: () => <PodList />
  },
  pod: {
    path: '/pods/:namespace/:name',
    exact: true,
    sidebar: 'pods',
    component: () => <PodDetails />
  },
  services: {
    path: '/services',
    exact: true,
    name: 'Services',
    sidebar: 'services',
    component: () => <ServiceList />
  },
  service: {
    path: '/services/:namespace/:name',
    exact: true,
    sidebar: 'services',
    component: () => <ServiceDetails />
  },
  ingresses: {
    path: '/ingresses',
    exact: true,
    name: 'Ingresses',
    sidebar: 'ingresses',
    component: () => <IngressList />
  },
  ingress: {
    path: '/ingresses/:namespace/:name',
    exact: true,
    sidebar: 'ingresses',
    component: () => <IngressDetails />
  },
  replicaSets: {
    path: '/replicasets',
    exact: true,
    name: 'Replica Sets',
    sidebar: 'replicaSets',
    component: () => <ReplicaSetList />
  },
  ReplicaSet: {
    path: '/replicasets/:namespace/:name',
    exact: true,
    sidebar: 'replicaSets',
    component: () => <WorkloadDetails workloadKind="ReplicaSet" />
  },
  configMaps: {
    path: '/configmaps',
    exact: true,
    name: 'Config Maps',
    sidebar: 'configMaps',
    component: () => <ConfigMapList />
  },
  configMap: {
    path: '/configmaps/:namespace/:name',
    exact: true,
    sidebar: 'configMaps',
    component: () => <ConfigDetails />
  },
  serviceAccounts: {
    path: '/serviceaccounts',
    exact: true,
    name: 'Service Accounts',
    sidebar: 'serviceAccounts',
    component: () => <ServiceAccountList />
  },
  serviceAccount: {
    path: '/serviceaccounts/:namespace/:name',
    exact: true,
    sidebar: 'serviceAccounts',
    component: () => <ServiceAccountDetails />
  },
  roles: {
    path: '/roles',
    exact: true,
    name: 'Roles',
    sidebar: 'roles',
    component: () => <RoleList />
  },
  role: {
    path: '/roles/:namespace/:name',
    exact: true,
    sidebar: 'roles',
    component: () => <RoleDetails />
  },
  clusterrole: {
    path: '/clusterroles/:name',
    exact: true,
    sidebar: 'roles',
    component: () => <RoleDetails />
  },
  roleBindings: {
    path: '/rolebindings',
    exact: true,
    name: 'Role Bindings',
    sidebar: 'roleBindings',
    component: () => <RoleBindingList />
  },
  roleBinding: {
    path: '/rolebinding/:namespace/:name',
    exact: true,
    name: 'Role Binding',
    sidebar: 'roleBindings',
    component: () => <RoleBindingDetails />
  },
  clusterRoleBinding: {
    path: '/clusterrolebinding/:name',
    exact: true,
    name: 'Role Binding',
    sidebar: 'roleBindings',
    component: () => <RoleBindingDetails />
  },
  secrets: {
    path: '/secrets',
    exact: true,
    name: 'Secrets',
    sidebar: 'secrets',
    component: () => <SecretList />
  },
  secret: {
    path: '/secrets/:namespace/:name',
    exact: true,
    sidebar: 'secrets',
    component: () => <SecretDetails />
  },
  login: {
    path: '/login',
    exact: true,
    name: 'Login',
    sidebar: null,
    noAuthRequired: true,
    component: () => <Auth />
  },
  crds: {
    path: '/crds',
    exact: true,
    name: 'CRDs',
    sidebar: 'crds',
    component: () => <CustomResourceDefinitionList />
  },
  crd: {
    path: '/crds/:name',
    exact: true,
    name: 'CRD',
    sidebar: 'crds',
    component: () => <CustomResourceDefinitionDetails />
  },
};

export function getRoute(routeName: string) {
  return ROUTES[routeName];
}

export function getRoutePath(route: Route) {
  if (route.noCluster) {
    return route.path;
  }

  return getClusterPrefixedPath(route.path);
}

export interface RouteURLProps {
  cluster?: string;
  [prop: string]: any;
}

export function createRouteURL(routeName: string, params: RouteURLProps = {}) {
  const route = getRoute(routeName);

  if (!route) {
    return '';
  }

  let cluster: string | null = null;
  if (!route.noCluster) {
    cluster = getCluster();
    if (!cluster) {
      const clusters = store.getState().config.clusters;
      cluster = clusters.length > 0 ? clusters[0].name : null;
    }
  }
  const fullParams = {
    ...params
  };
  if (cluster) {
    fullParams.cluster = cluster;
  }
  const url = getRoutePath(route);
  return generatePath(url, fullParams);
}
