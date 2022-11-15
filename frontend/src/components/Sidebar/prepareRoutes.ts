import _ from 'lodash';
import store from '../../redux/stores/store';
import { SidebarItemProps } from '../Sidebar';

function prepareRoutes(t: (arg: string) => string) {
  const LIST_ITEMS: SidebarItemProps[] = [
    {
      name: 'cluster',
      label: t('glossary|Cluster'),
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
          label: t('glossary|CRDs'),
        },
        {
          name: 'configMaps',
          label: t('glossary|Config Maps'),
        },
        {
          name: 'horizontalPodAutoscalers',
          label: t('glossary|HPAs'),
        },
        {
          name: 'resourceQuotas',
          label: t('glossary|Resource Quotas'),
        },
        {
          name: 'podDisruptionBudgets',
          label: t('glossary|Pod Disruption Budgets'),
        },
        {
          name: 'priorityClasses',
          label: t('glossary|Priority Classes'),
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
          name: 'ReplicaSets',
          label: t('glossary|Replica Sets'),
        },
        {
          name: 'DaemonSets',
          label: t('glossary|Daemon Sets'),
        },
        {
          name: 'StatefulSets',
          label: t('glossary|Stateful Sets'),
        },
        {
          name: 'Jobs',
          label: t('glossary|Jobs'),
        },
        {
          name: 'Deployments',
          label: t('glossary|Deployments'),
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
          name: 'storageClasses',
          label: t('glossary|Storage Classes'),
        },
        {
          name: 'persistentVolumes',
          label: t('glossary|Storage Volumes'),
        },
        {
          name: 'persistentVolumeClaims',
          label: t('glossary|Persistent Volume Claims'),
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
        {
          name: 'secrets',
          label: t('glossary|Secrets'),
        },
      ],
    },
  ];

  const items = store.getState().ui.sidebar.entries;
  const filters = store.getState().ui.sidebar.filters;
  // @todo: Find a better way to avoid modifying the objects in LIST_ITEMS.
  const routes: SidebarItemProps[] = JSON.parse(JSON.stringify(LIST_ITEMS));

  for (const i of Object.values(items)) {
    const item = _.cloneDeep(i);
    const parent = item.parent ? routes.find(({ name }) => name === item.parent) : null;
    let placement = routes;
    if (parent) {
      if (!parent['subList']) {
        parent['subList'] = [];
      }

      placement = parent['subList'];
    }

    placement.push(item);
  }
  // Filter the routes, if we have any filters.
  const filteredRoutes = [];
  for (const route of routes) {
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
  return filteredRoutes;
}

export default prepareRoutes;
