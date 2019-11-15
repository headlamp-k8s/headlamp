import React from 'react';
import { generatePath } from 'react-router';
import Auth from '../components/account/Auth';
import Overview from '../components/cluster/Overview';
import ConfigDetails from '../components/configmap/Details';
import ConfigMapList from '../components/configmap/List';
import IngressDetails from '../components/ingress/Details';
import IngressList from '../components/ingress/List';
import NamespacesList from '../components/namespace/List';
import NodeList from '../components/node/List';
import PodList from '../components/pods/List';
import ReplicaSetList from '../components/replicaset/List';
import RoleBindingList from '../components/role/BindingList';
import RoleList from '../components/role/List';
import SecretList from '../components/secret/List';
import ServiceDetails from '../components/service/Details';
import ServiceList from '../components/service/List';
import ServiceAccountList from '../components/serviceaccount/List';
import PersistentVolumeClaimDetails from '../components/storage/ClaimDetails';
import PersistentVolumeClaimList from '../components/storage/ClaimList';
import StorageClassDetails from '../components/storage/ClassDetails';
import StorageClassList from '../components/storage/ClassList';
import PersistentVolumeDetails from '../components/storage/VolumeDetails';
import PersistentVolumeList from '../components/storage/VolumeList';
import WorkloadOverview from '../components/workload/Overview';

export const ROUTES = {
  cluster: {
    path: '/',
    exact: true,
    name: 'Cluster',
    component: () => <Overview />
  },
  namespaces: {
    path: '/namespaces',
    name: 'Namespaces',
    component: () => <NamespacesList />
  },
  nodes: {
    path: '/nodes',
    name: 'Nodes',
    component: () => <NodeList />
  },
  storageClasses: {
    path: '/storage/classes',
    exact: true,
    name: 'Storage Classes',
    component: () => <StorageClassList />
  },
  storageClassDetails: {
    path: '/storage/classes/:name',
    name: 'Storage Classes',
    component: () => <StorageClassDetails />
  },
  storageVolumes: {
    path: '/storage/persistentvolumes',
    exact: true,
    name: 'Persistent Volumes',
    component: () => <PersistentVolumeList />
  },
  persistentVolume: {
    path: '/storage/persistentvolumes/:name',
    exact: true,
    name: 'Persistent Volume',
    component: () => <PersistentVolumeDetails />
  },
  persistentVolumeClaims: {
    path: '/storage/persistentvolumeclaims',
    exact: true,
    name: 'Persistent Volume Claims',
    component: () => <PersistentVolumeClaimList />
  },
  persistentVolumeClaim: {
    path: '/storage/persistentvolumeclaims/:namespace/:name',
    exact: true,
    component: () => <PersistentVolumeClaimDetails />
  },
  workloads: {
    path: '/workload',
    exact: true,
    name: 'Workloads',
    component: () => <WorkloadOverview />
  },
  pods: {
    path: '/pods',
    exact: true,
    name: 'Pods',
    component: () => <PodList />
  },
  services: {
    path: '/services',
    exact: true,
    name: 'Services',
    component: () => <ServiceList />
  },
  service: {
    path: '/services/:namespace/:name',
    exact: true,
    component: () => <ServiceDetails />
  },
  ingresses: {
    path: '/ingresses',
    exact: true,
    name: 'Ingresses',
    component: () => <IngressList />
  },
  ingress: {
    path: '/ingresses/:namespace/:name',
    exact: true,
    component: () => <IngressDetails />
  },
  replicaSets: {
    path: '/replicasets',
    exact: true,
    name: 'Replica Sets',
    component: () => <ReplicaSetList />
  },
  configMaps: {
    path: '/configmaps',
    exact: true,
    name: 'Config Maps',
    component: () => <ConfigMapList />
  },
  configMap: {
    path: '/configmaps/:namespace/:name',
    exact: true,
    component: () => <ConfigDetails />
  },
  serviceAccounts: {
    path: '/serviceaccounts',
    exact: true,
    name: 'Service Accounts',
    component: () => <ServiceAccountList />
  },
  roles: {
    path: '/roles',
    exact: true,
    name: 'Roles',
    component: () => <RoleList />
  },
  roleBindings: {
    path: '/rolebindings',
    exact: true,
    name: 'Role Bindings',
    component: () => <RoleBindingList />
  },
  secrets: {
    path: '/secrets',
    exact: true,
    name: 'Secrets',
    component: () => <SecretList />
  },
  login: {
    path: '/login',
    exact: true,
    name: 'Login',
    component: () => <Auth />
  },
};

export function getRoute(routeName) {
  return ROUTES[routeName];
}

export function createRouteURL(routeName, params={}) {
  const url = getRoute(routeName).path;
  return generatePath(url, params);
}
