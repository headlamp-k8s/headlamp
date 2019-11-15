import React from 'react';
import Auth from '../components/account/Auth';
import Overview from '../components/cluster/Overview';
import ConfigMapList from '../components/configmap/List';
import IngressList from '../components/ingress/List';
import NamespacesList from '../components/namespace/List';
import NodeList from '../components/node/List';
import PodList from '../components/pods/List';
import ReplicaSetList from '../components/replicaset/List';
import RoleBindingList from '../components/role/BindingList';
import RoleList from '../components/role/List';
import SecretList from '../components/secret/List';
import ServiceList from '../components/service/List';
import ServiceAccountList from '../components/serviceaccount/List';
import PersistentVolumeClaimList from '../components/storage/ClaimList';
import StorageClassDetails from '../components/storage/ClassDetails';
import StorageClassList from '../components/storage/ClassList';
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
  persistentVolumeClaims: {
    path: '/storage/persistentvolumeclaims',
    exact: true,
    name: 'Persistent Volume Claims',
    component: () => <PersistentVolumeClaimList />
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
  ingresses: {
    path: '/ingresses',
    exact: true,
    name: 'Ingresses',
    component: () => <IngressList />
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
