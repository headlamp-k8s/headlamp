import circleSlice2 from '@iconify/icons-mdi/circle-slice-2';
import databaseIcon from '@iconify/icons-mdi/database';
import folderNetworkOutline from '@iconify/icons-mdi/folder-network-outline';
import hexagonMultipleOutline from '@iconify/icons-mdi/hexagon-multiple-outline';
import lockIcon from '@iconify/icons-mdi/lock';
import i18next from 'i18next';
import { SidebarEntry } from '../../redux/reducers/ui';
import store from '../../redux/stores/store';

const LIST_ITEMS: SidebarEntry[] = [
  {
    name: 'cluster',
    label: i18next.t('glossary|Cluster'),
    icon: hexagonMultipleOutline,
    subList: [
      {
        name: 'namespaces',
        label: i18next.t('glossary|Namespaces'),
      },
      {
        name: 'nodes',
        label: i18next.t('glossary|Nodes'),
      },
      {
        name: 'crds',
        label: i18next.t('glossary|CRDs'),
      },
      {
        name: 'configMaps',
        label: i18next.t('glossary|Config Maps'),
      },
    ],
  },
  {
    name: 'workloads',
    label: i18next.t('glossary|Workloads'),
    icon: circleSlice2,
    subList: [
      {
        name: 'Pods',
        label: i18next.t('glossary|Pods'),
      },
      {
        name: 'ReplicaSets',
        label: i18next.t('glossary|Replica Sets'),
      },
      {
        name: 'DaemonSets',
        label: i18next.t('glossary|Daemon Sets'),
      },
      {
        name: 'StatefulSets',
        label: i18next.t('glossary|Stateful Sets'),
      },
      {
        name: 'Jobs',
        label: i18next.t('glossary|Jobs'),
      },
      {
        name: 'Deployments',
        label: i18next.t('glossary|Deployments'),
      },
      {
        name: 'CronJobs',
        label: i18next.t('glossary|CronJobs'),
      },
    ],
  },
  {
    name: 'storage',
    label: i18next.t('glossary|Storage'),
    icon: databaseIcon,
    subList: [
      {
        name: 'storageClasses',
        label: i18next.t('glossary|Storage Classes'),
      },
      {
        name: 'persistentVolumes',
        label: i18next.t('glossary|Storage Volumes'),
      },
      {
        name: 'persistentVolumeClaims',
        label: i18next.t('glossary|Persistent Volume Claims'),
      },
    ],
  },
  {
    name: 'network',
    label: i18next.t('glossary|Network'),
    icon: folderNetworkOutline,
    subList: [
      {
        name: 'services',
        label: i18next.t('glossary|Services'),
      },
      {
        name: 'ingresses',
        label: i18next.t('glossary|Ingresses'),
      },
    ],
  },
  {
    name: 'security',
    label: i18next.t('glossary|Security'),
    icon: lockIcon,
    subList: [
      {
        name: 'serviceAccounts',
        label: i18next.t('glossary|Service Accounts'),
      },
      {
        name: 'roles',
        label: i18next.t('glossary|Roles'),
      },
      {
        name: 'roleBindings',
        label: i18next.t('glossary|Role Bindings'),
      },
      {
        name: 'secrets',
        label: i18next.t('glossary|Secrets'),
      },
    ],
  },
];

function prepareRoutes() {
  const items = store.getState().ui.sidebar.entries;
  // @todo: Find a better way to avoid modifying the objects in LIST_ITEMS.
  const routes: SidebarEntry[] = JSON.parse(JSON.stringify(LIST_ITEMS));

  for (const item of Object.values(items)) {
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

  return routes;
}

export default prepareRoutes;
