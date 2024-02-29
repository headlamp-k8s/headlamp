import _ from 'lodash';
import helpers from '../../helpers';
import { createRouteURL } from '../../lib/router';
import { getCluster } from '../../lib/util';
import store from '../../redux/stores/store';
import { DefaultSidebars, SidebarItemProps } from '../Sidebar';

// @todo: We should convert this to a hook so we can update it automatically when
// needed.
function prepareRoutes(
  t: (arg: string) => string,
  sidebarToReturn: string = DefaultSidebars.IN_CLUSTER
) {
  // We do not show the home view if there is only one cluster and we cannot
  // add new clusters, as it is redundant.
  const clusters = store.getState()?.config?.clusters || {};
  const showHome = helpers.isElectron() || Object.keys(clusters).length !== 1;
  const defaultClusterURL = createRouteURL('cluster', { cluster: Object.keys(clusters)[0] });

  const homeItems: SidebarItemProps[] = [
    {
      name: 'home',
      icon: showHome ? 'mdi:home' : 'mdi:hexagon-multiple-outline',
      label: showHome ? t('translation|Home') : t('glossary|Cluster'),
      url: showHome ? '/' : defaultClusterURL,
      divider: !showHome,
    },
    {
      name: 'notifications',
      icon: 'mdi:bell',
      label: t('translation|Notifications'),
      url: '/notifications',
    },
    {
      name: 'settings',
      icon: 'mdi:cog',
      label: t('translation|Settings'),
      url: '/settings',
      subList: [
        {
          name: 'plugins',
          label: t('translation|Plugins'),
          url: '/settings/plugins',
        },
      ],
    },
  ];
  const inClusterItems: SidebarItemProps[] = [
    {
      name: 'home',
      icon: 'mdi:home',
      label: t('translation|Home'),
      url: '/',
      divider: true,
      hide: !showHome,
    },
    {
      name: 'cluster',
      label: t('glossary|Cluster'),
      subtitle: getCluster() || undefined,
      icon: 'mdi:hexagon-multiple-outline',
      subList: [
        {
          name: 'namespaces',
          label: t('glossary|Namespaces'),
        },
        {
          name: 'nodes',
          label: t('glossary|Nodes'),
        },
        {
          name: 'crds',
          label: t('glossary|Custom Resources'),
        },
      ],
    },
    {
      name: 'workloads',
      label: t('glossary|Workloads'),
      icon: 'mdi:circle-slice-2',
      subList: [
        {
          name: 'Pods',
          label: t('glossary|Pods'),
        },
        {
          name: 'Deployments',
          label: t('glossary|Deployments'),
        },
        {
          name: 'StatefulSets',
          label: t('glossary|Stateful Sets'),
        },
        {
          name: 'DaemonSets',
          label: t('glossary|Daemon Sets'),
        },
        {
          name: 'ReplicaSets',
          label: t('glossary|Replica Sets'),
        },
        {
          name: 'Jobs',
          label: t('glossary|Jobs'),
        },
        {
          name: 'CronJobs',
          label: t('glossary|CronJobs'),
        },
      ],
    },
    {
      name: 'storage',
      label: t('glossary|Storage'),
      icon: 'mdi:database',
      subList: [
        {
          name: 'persistentVolumeClaims',
          label: t('glossary|Persistent Volume Claims'),
        },
        {
          name: 'persistentVolumes',
          label: t('glossary|Persistent Volumes'),
        },
        {
          name: 'storageClasses',
          label: t('glossary|Storage Classes'),
        },
      ],
    },
    {
      name: 'network',
      label: t('glossary|Network'),
      icon: 'mdi:folder-network-outline',
      subList: [
        {
          name: 'services',
          label: t('glossary|Services'),
        },
        {
          name: 'endpoints',
          label: t('glossary|Endpoints'),
        },
        {
          name: 'ingresses',
          label: t('glossary|Ingresses'),
        },
        {
          name: 'ingressclasses',
          label: t('glossary|Ingress Classes'),
        },
        {
          name: 'portforwards',
          label: t('glossary|Port Forwarding'),
          hide: !helpers.isElectron(),
        },
        {
          name: 'NetworkPolicies',
          label: t('glossary|Network Policies'),
        },
      ],
    },
    {
      name: 'security',
      label: t('glossary|Security'),
      icon: 'mdi:lock',
      subList: [
        {
          name: 'serviceAccounts',
          label: t('glossary|Service Accounts'),
        },
        {
          name: 'roles',
          label: t('glossary|Roles'),
        },
        {
          name: 'roleBindings',
          label: t('glossary|Role Bindings'),
        },
      ],
    },
    {
      name: 'config',
      label: t('glossary|Configuration'),
      icon: 'mdi:format-list-checks',
      subList: [
        {
          name: 'configMaps',
          label: t('glossary|Config Maps'),
        },
        {
          name: 'secrets',
          label: t('glossary|Secrets'),
        },
        {
          name: 'horizontalPodAutoscalers',
          label: t('glossary|HPAs'),
        },
        {
          name: 'verticalPodAutoscalers',
          label: t('glossary|VPAs'),
        },
        {
          name: 'podDisruptionBudgets',
          label: t('glossary|Pod Disruption Budgets'),
        },
        {
          name: 'resourceQuotas',
          label: t('glossary|Resource Quotas'),
        },
        {
          name: 'limitRanges',
          label: t('glossary|Limit Ranges'),
        },
        {
          name: 'priorityClasses',
          label: t('glossary|Priority Classes'),
        },
        {
          name: 'runtimeClasses',
          label: t('glossary|Runtime Classes'),
        },
        {
          name: 'leases',
          label: t('glossary|Leases'),
        },
        {
          name: 'mutatingWebhookConfigurations',
          label: t('glossary|Mutating Webhook Configurations'),
        },
        {
          name: 'validatingWebhookConfigurations',
          label: t('glossary|Validating Webhook Configurations'),
        },
      ],
    },
  ];

  const sidebars: { [key: string]: SidebarItemProps[] } = {
    [DefaultSidebars.IN_CLUSTER]: _.cloneDeep(inClusterItems),
    [DefaultSidebars.HOME]: _.cloneDeep(homeItems),
  };

  const items = store.getState().sidebar.entries;
  const filters = store.getState().sidebar.filters;

  for (const i of Object.values(items)) {
    const item = _.cloneDeep(i);
    // For back-compatibility reasons, the default sidebar is the in-cluster one.
    const desiredSidebar = item.sidebar || DefaultSidebars.IN_CLUSTER;
    let itemsSidebar = sidebars[desiredSidebar];
    if (!itemsSidebar) {
      itemsSidebar = [];
      sidebars[desiredSidebar] = itemsSidebar;
    }

    const parent = item.parent ? itemsSidebar.find(({ name }) => name === item.parent) : null;
    let placement = itemsSidebar;
    if (parent) {
      if (!parent['subList']) {
        parent['subList'] = [];
      }

      placement = parent['subList'];
    }

    placement.push(item);
  }

  // Filter the routes, if we have any filters.
  // @todo: We need to deprecate this and implement a list processor.
  const filteredRoutes = [];
  const defaultRoutes: SidebarItemProps[] = sidebars[DefaultSidebars.IN_CLUSTER];
  for (const route of defaultRoutes) {
    const routeFiltered =
      filters.length > 0 && filters.filter(f => f(route)).length !== filters.length;
    if (routeFiltered) {
      continue;
    }

    const newSubList = route.subList?.filter(
      subRoute =>
        !(filters.length > 0 && filters.filter(f => f(subRoute)).length !== filters.length)
    );
    route.subList = newSubList;

    filteredRoutes.push(route);
  }

  if (!sidebarToReturn || sidebarToReturn === DefaultSidebars.IN_CLUSTER) {
    return filteredRoutes;
  }

  return sidebars[sidebarToReturn];
}

export default prepareRoutes;
