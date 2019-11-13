import React from 'react';
import Overview from '../components/cluster/Overview';
import WorkloadOverview from '../components/workload/Overview';
import Auth from '../components/account/Auth';
import NamespacesList from '../components/namespace/List';
import NodeList from '../components/node/List';
import StorageClassList from '../components/storage/ClassList';
import PersistentVolumeList from '../components/storage/VolumeList';
import PersistentVolumeClaimList from '../components/storage/ClaimList';
import ServiceList from '../components/service/List';
import IngressList from '../components/ingress/List';
import ReplicaSetList from '../components/replicaset/List';
import ConfigMapList from '../components/configmap/List';
import ServiceAccountList from '../components/serviceaccount/List';
import RoleList from '../components/role/List';

export const ROUTES = [
  {
    path: "/",
    exact: true,
    name: 'Cluster',
    component: () => <Overview />
  },
  {
    path: "/namespaces",
    name: 'Namespaces',
    component: () => <NamespacesList />
  },
  {
    path: "/nodes",
    name: 'Nodes',
    component: () => <NodeList />
  },
  {
    path: "/storage/classes",
    exact: true,
    name: 'Storage Classes',
    component: () => <StorageClassList />
  },
  {
    path: "/storage/persistentvolumes",
    exact: true,
    name: 'Persistent Volumes',
    component: () => <PersistentVolumeList />
  },
  {
    path: "/storage/persistentvolumeclaims",
    exact: true,
    name: 'Persistent Volume Claims',
    component: () => <PersistentVolumeClaimList />
  },
  {
    path: "/workload",
    exact: true,
    name: 'Workloads',
    component: () => <WorkloadOverview />
  },
  {
    path: "/services",
    exact: true,
    name: 'Services',
    component: () => <ServiceList />
  },
  {
    path: "/ingresses",
    exact: true,
    name: 'Ingresses',
    component: () => <IngressList />
  },
  {
    path: "/replicasets",
    exact: true,
    name: 'Replica Sets',
    component: () => <ReplicaSetList />
  },
  {
    path: "/configmaps",
    exact: true,
    name: 'Config Maps',
    component: () => <ConfigMapList />
  },
  {
    path: "/serviceaccounts",
    exact: true,
    name: 'Service Accounts',
    component: () => <ServiceAccountList />
  },
  {
    path: "/roles",
    exact: true,
    name: 'Roles',
    component: () => <RoleList />
  },
  {
    path: "/login",
    exact: true,
    name: 'Login',
    component: () => <Auth />
  },
];
