import _ from 'lodash';
import React from 'react';
import { generatePath } from 'react-router';
import NotFoundComponent from '../components/404';
import AuthToken from '../components/account/Auth';
import AuthChooser from '../components/authchooser';
import Chooser from '../components/cluster/Chooser';
import Overview from '../components/cluster/Overview';
import ConfigDetails from '../components/configmap/Details';
import ConfigMapList from '../components/configmap/List';
import CustomResourceDetails from '../components/crd/CustomResourceDetails';
import CustomResourceDefinitionDetails from '../components/crd/Details';
import CustomResourceDefinitionList from '../components/crd/List';
import CronJobDetails from '../components/cronjob/Details';
import CronJobList from '../components/cronjob/List';
import DaemonSetDetails from '../components/daemonset/Details';
import DaemonSetList from '../components/daemonset/List';
import DeploymentsList from '../components/deployments/List';
import HorizontalPodAutoscalerDetails from '../components/horizontalpodautoscalers/Details';
import HorizontalPodAutoscalerList from '../components/horizontalpodautoscalers/List';
import IngressDetails from '../components/ingress/Details';
import IngressList from '../components/ingress/List';
import JobsList from '../components/job/List';
import NamespaceDetails from '../components/namespace/Details';
import NamespacesList from '../components/namespace/List';
import NodeDetails from '../components/node/Details';
import NodeList from '../components/node/List';
import OIDCAuth from '../components/oidcauth';
import PodDetails from '../components/pod/Details';
import PodList from '../components/pod/List';
import PodDisruptionBudgetDetails from '../components/poddisruptionbudgets/Details';
import PodDisruptionBudgetList from '../components/poddisruptionbudgets/List';
import ReplicaSetList from '../components/replicaset/List';
import ResourceQuotaDetails from '../components/resourcequotas/Details';
import ResourceQuotaList from '../components/resourcequotas/List';
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
import StatefulSetDetails from '../components/statefulset/Details';
import StatefulSetList from '../components/statefulset/List';
import PersistentVolumeClaimDetails from '../components/storage/ClaimDetails';
import PersistentVolumeClaimList from '../components/storage/ClaimList';
import StorageClassDetails from '../components/storage/ClassDetails';
import StorageClassList from '../components/storage/ClassList';
import PersistentVolumeDetails from '../components/storage/VolumeDetails';
import PersistentVolumeList from '../components/storage/VolumeList';
import WorkloadDetails from '../components/workload/Details';
import WorkloadOverview from '../components/workload/Overview';
import LocaleSelect from '../i18n/LocaleSelect/LocaleSelect';
import store from '../redux/stores/store';
import Deployment from './k8s/deployment';
import Job from './k8s/job';
import ReplicaSet from './k8s/replicaSet';
import { getCluster, getClusterPrefixedPath } from './util';

export interface Route {
  /** Any valid URL path or array of paths that path-to-regexp@^1.7.0 understands. */
  path: string;
  /** When true, will only match if the path matches the location.pathname exactly. */
  exact?: boolean;
  /** Human readable name. Capitalized and short. */
  name?: string;
  /**
   * In case this route does *not* need a cluster prefix and context.
   * @deprecated please use useClusterURL.
   */
  noCluster?: boolean;
  /**
   * Should URL have the cluster prefix? (default=true)
   */
  useClusterURL?: boolean;
  /** This route does not require Authentication. */
  noAuthRequired?: boolean;
  /** The sidebar group this Route should be in, or null if it is in no group. */
  sidebar: string | null;
  /** Shown component for this route. */
  component: () => JSX.Element;
  /** Hide the appbar at the top. */
  hideAppBar?: boolean;
}

const defaultRoutes: {
  [routeName: string]: Route;
} = {
  cluster: {
    path: '/',
    exact: true,
    name: 'Cluster',
    sidebar: 'cluster',
    component: () => <Overview />,
  },
  chooser: {
    path: '/',
    exact: true,
    name: 'Choose a cluster',
    sidebar: null,
    useClusterURL: false,
    noAuthRequired: true,
    component: () => (
      <Chooser useCover open>
        <LocaleSelect />
      </Chooser>
    ),
  },
  namespaces: {
    path: '/namespaces',
    name: 'Namespaces',
    exact: true,
    sidebar: 'namespaces',
    component: () => <NamespacesList />,
  },
  namespace: {
    path: '/namespaces/:name',
    sidebar: 'namespaces',
    component: () => <NamespaceDetails />,
  },
  nodes: {
    path: '/nodes',
    name: 'Nodes',
    exact: true,
    sidebar: 'nodes',
    component: () => <NodeList />,
  },
  node: {
    path: '/nodes/:name',
    sidebar: 'nodes',
    component: () => <NodeDetails />,
  },
  storageClasses: {
    path: '/storage/classes',
    exact: true,
    sidebar: 'storageClasses',
    name: 'Storage Classes',
    component: () => <StorageClassList />,
  },
  storageClass: {
    path: '/storage/classes/:name',
    name: 'Storage Classes',
    sidebar: 'storageClasses',
    component: () => <StorageClassDetails />,
  },
  persistentVolumes: {
    path: '/storage/persistentvolumes',
    exact: true,
    sidebar: 'persistentVolumes',
    name: 'Storage Volumes',
    component: () => <PersistentVolumeList />,
  },
  persistentVolume: {
    path: '/storage/persistentvolumes/:name',
    exact: true,
    sidebar: 'persistentVolumes',
    name: 'Storage Volume',
    component: () => <PersistentVolumeDetails />,
  },
  persistentVolumeClaims: {
    path: '/storage/persistentvolumeclaims',
    exact: true,
    sidebar: 'persistentVolumeClaims',
    name: 'Persistent Volume Claims',
    component: () => <PersistentVolumeClaimList />,
  },
  persistentVolumeClaim: {
    path: '/storage/persistentvolumeclaims/:namespace/:name',
    sidebar: 'persistentVolumeClaims',
    exact: true,
    component: () => <PersistentVolumeClaimDetails />,
  },
  workloads: {
    path: '/workloads',
    exact: true,
    name: 'Workloads',
    sidebar: 'workloads',
    component: () => <WorkloadOverview />,
  },
  DaemonSet: {
    path: '/daemonsets/:namespace/:name',
    exact: true,
    sidebar: 'DaemonSets',
    component: () => <DaemonSetDetails />,
  },
  StatefulSet: {
    path: '/statefulsets/:namespace/:name',
    exact: true,
    sidebar: 'StatefulSets',
    component: () => <StatefulSetDetails />,
  },
  Deployment: {
    path: '/deployments/:namespace/:name',
    exact: true,
    sidebar: 'Deployments',
    component: () => <WorkloadDetails workloadKind={Deployment} />,
  },
  Job: {
    path: '/jobs/:namespace/:name',
    exact: true,
    sidebar: 'Jobs',
    component: () => <WorkloadDetails workloadKind={Job} />,
  },
  CronJob: {
    path: '/cronjobs/:namespace/:name',
    exact: true,
    sidebar: 'CronJobs',
    component: () => <CronJobDetails />,
  },
  Pods: {
    path: '/pods',
    exact: true,
    name: 'Pods',
    sidebar: 'Pods',
    component: () => <PodList />,
  },
  Pod: {
    path: '/pods/:namespace/:name',
    exact: true,
    sidebar: 'Pods',
    component: () => <PodDetails />,
  },
  services: {
    path: '/services',
    exact: true,
    name: 'Services',
    sidebar: 'services',
    component: () => <ServiceList />,
  },
  service: {
    path: '/services/:namespace/:name',
    exact: true,
    sidebar: 'services',
    component: () => <ServiceDetails />,
  },
  ingresses: {
    path: '/ingresses',
    exact: true,
    name: 'Ingresses',
    sidebar: 'ingresses',
    component: () => <IngressList />,
  },
  ingress: {
    path: '/ingresses/:namespace/:name',
    exact: true,
    sidebar: 'ingresses',
    component: () => <IngressDetails />,
  },
  DaemonSets: {
    path: '/daemonsets',
    exact: true,
    sidebar: 'DaemonSets',
    name: 'DaemonSets',
    component: () => <DaemonSetList />,
  },
  Jobs: {
    path: '/jobs',
    exact: true,
    sidebar: 'Jobs',
    name: 'Jobs',
    component: () => <JobsList />,
  },
  CronJobs: {
    path: '/cronjobs',
    exact: true,
    sidebar: 'CronJobs',
    name: 'CronJobs',
    component: () => <CronJobList />,
  },
  Deployments: {
    path: '/deployments',
    exact: true,
    sidebar: 'Deployments',
    name: 'Deployments',
    component: () => <DeploymentsList />,
  },
  StatefulSets: {
    path: '/statefulsets',
    exact: true,
    sidebar: 'StatefulSets',
    name: 'StatefulSets',
    component: () => <StatefulSetList />,
  },
  ReplicaSets: {
    path: '/replicasets',
    exact: true,
    name: 'ReplicaSets',
    sidebar: 'ReplicaSets',
    component: () => <ReplicaSetList />,
  },
  ReplicaSet: {
    path: '/replicasets/:namespace/:name',
    exact: true,
    sidebar: 'ReplicaSets',
    component: () => <WorkloadDetails workloadKind={ReplicaSet} />,
  },
  configMaps: {
    path: '/configmaps',
    exact: true,
    name: 'Config Maps',
    sidebar: 'configMaps',
    component: () => <ConfigMapList />,
  },
  configMap: {
    path: '/configmaps/:namespace/:name',
    exact: true,
    sidebar: 'configMaps',
    component: () => <ConfigDetails />,
  },
  serviceAccounts: {
    path: '/serviceaccounts',
    exact: true,
    name: 'Service Accounts',
    sidebar: 'serviceAccounts',
    component: () => <ServiceAccountList />,
  },
  serviceAccount: {
    path: '/serviceaccounts/:namespace/:name',
    exact: true,
    sidebar: 'serviceAccounts',
    component: () => <ServiceAccountDetails />,
  },
  roles: {
    path: '/roles',
    exact: true,
    name: 'Roles',
    sidebar: 'roles',
    component: () => <RoleList />,
  },
  role: {
    path: '/roles/:namespace/:name',
    exact: true,
    sidebar: 'roles',
    component: () => <RoleDetails />,
  },
  clusterrole: {
    path: '/clusterroles/:name',
    exact: true,
    sidebar: 'roles',
    component: () => <RoleDetails />,
  },
  clusterRoles: {
    path: '/roles',
    exact: true,
    sidebar: 'roles',
    component: () => <RoleList />,
  },
  roleBindings: {
    path: '/rolebindings',
    exact: true,
    name: 'Role Bindings',
    sidebar: 'roleBindings',
    component: () => <RoleBindingList />,
  },
  roleBinding: {
    path: '/rolebinding/:namespace/:name',
    exact: true,
    name: 'Role Binding',
    sidebar: 'roleBindings',
    component: () => <RoleBindingDetails />,
  },
  clusterRoleBinding: {
    path: '/clusterrolebinding/:name',
    exact: true,
    name: 'Role Binding',
    sidebar: 'roleBindings',
    component: () => <RoleBindingDetails />,
  },
  clusterRoleBindings: {
    path: '/rolebindings',
    exact: true,
    sidebar: 'roleBindings',
    component: () => <RoleBindingDetails />,
  },
  secrets: {
    path: '/secrets',
    exact: true,
    name: 'Secrets',
    sidebar: 'secrets',
    component: () => <SecretList />,
  },
  secret: {
    path: '/secrets/:namespace/:name',
    exact: true,
    sidebar: 'secrets',
    component: () => <SecretDetails />,
  },
  token: {
    path: '/token',
    exact: true,
    name: 'Token',
    sidebar: null,
    noAuthRequired: true,
    component: () => <AuthToken />,
  },
  oidcAuth: {
    path: '/auth',
    name: 'OidcAuth',
    sidebar: null,
    noAuthRequired: true,
    component: () => <OIDCAuth />,
  },
  login: {
    path: '/login',
    exact: true,
    name: 'Login',
    sidebar: null,
    noAuthRequired: true,
    component: () => (
      <AuthChooser>
        <LocaleSelect />
      </AuthChooser>
    ),
  },
  crds: {
    path: '/crds',
    exact: true,
    name: 'CRDs',
    sidebar: 'crds',
    component: () => <CustomResourceDefinitionList />,
  },
  crd: {
    path: '/crds/:name',
    exact: true,
    name: 'CRD',
    sidebar: 'crds',
    component: () => <CustomResourceDefinitionDetails />,
  },
  customresource: {
    path: '/customresources/:crd/:namespace/:crName',
    exact: true,
    name: 'Custom Resource',
    sidebar: 'crds',
    component: () => <CustomResourceDetails />,
  },
  horizontalPodAutoscalers: {
    path: '/horizontalpodautoscalers',
    exact: true,
    name: 'HPAs',
    sidebar: 'horizontalPodAutoscalers',
    component: () => <HorizontalPodAutoscalerList />,
  },
  horizontalPodAutoscaler: {
    path: '/horizontalpodautoscaler/:namespace/:name',
    exact: true,
    name: 'HPA',
    sidebar: 'horizontalPodAutoscalers',
    component: () => <HorizontalPodAutoscalerDetails />,
  },
  podDisruptionBudgets: {
    path: '/poddisruptionbudgets',
    exact: true,
    name: 'PDBs',
    sidebar: 'podDisruptionBudgets',
    component: () => <PodDisruptionBudgetList />,
  },
  podDisruptionBudget: {
    path: '/poddisruptionbudget/:namespace/:name',
    exact: true,
    name: 'PDBs',
    sidebar: 'podDisruptionBudgets',
    component: () => <PodDisruptionBudgetDetails />,
  },
  resourceQuotas: {
    path: '/resourcequotas',
    exact: true,
    name: 'Resource Quotas',
    sidebar: 'resourceQuotas',
    component: () => <ResourceQuotaList />,
  },
  resourceQuota: {
    path: '/resourcequota/:namespace/:name',
    exact: true,
    name: 'Resource Quotas',
    sidebar: 'resourceQuotas',
    component: () => <ResourceQuotaDetails />,
  },
};

// The NotFound route  needs to be considered always in the last place when used
// with the router switch, as any routes added after this one will never be considered.
// So we do not include it in the default routes in order to always "manually" consider it.
export const NotFoundRoute = {
  path: '*',
  exact: true,
  name: `Whoops! This page doesn't exist`,
  component: () => <NotFoundComponent />,
  sidebar: null,
  noAuthRequired: true,
};

export function getRoute(routeName: string) {
  let routeKey = routeName;
  for (const key in defaultRoutes) {
    if (key.toLowerCase() === routeName.toLowerCase()) {
      if (key !== routeName) {
        console.warn(`Route name ${routeName} and ${key} are not matching`);
      }
      routeKey = key;
      break;
    }
  }
  return defaultRoutes[routeKey];
}

/**
 * Should the route use a cluster URL?
 *
 * @param route
 * @returns true when a cluster URL contains cluster in the URL. eg. /c/minikube/my-url
 *   false, the URL does not contain the cluster. eg. /my-url
 */
export function getRouteUseClusterURL(route: Route): boolean {
  if (route.useClusterURL === undefined && route.noCluster !== undefined) {
    console.warn('Route.noCluster is deprecated. Please use route.useClusterURL instead.');
    return route.noCluster;
  }
  if (route.useClusterURL === undefined) {
    // default is true, so undefined === true.
    return true;
  }
  return route.useClusterURL;
}

export function getRoutePath(route: Route) {
  if (route.path === NotFoundRoute.path) {
    return route.path;
  }
  if (!getRouteUseClusterURL(route)) {
    return route.path;
  }

  return getClusterPrefixedPath(route.path);
}

export interface RouteURLProps {
  cluster?: string;
  [prop: string]: any;
}

export function createRouteURL(routeName: string, params: RouteURLProps = {}) {
  const storeRoutes = store.getState().ui.routes;
  const route = (storeRoutes && storeRoutes[routeName]) || getRoute(routeName);

  if (!route) {
    return '';
  }

  let cluster: string | null = params.cluster || null;
  if (!cluster && getRouteUseClusterURL(route)) {
    cluster = getCluster();
    if (!cluster) {
      return '/';
    }
  }
  const fullParams = {
    ...params,
  };

  // Add cluster to the params if it is not already there
  if (!fullParams.cluster && !!cluster) {
    fullParams.cluster = cluster;
  }
  // if fullParams is empty it means it is a request for generating choser
  // route
  if (_.isEmpty(fullParams)) {
    return generatePath(defaultRoutes['chooser'].path);
  }
  const url = getRoutePath(route);
  return generatePath(url, fullParams);
}

export function getDefaultRoutes() {
  return defaultRoutes;
}
