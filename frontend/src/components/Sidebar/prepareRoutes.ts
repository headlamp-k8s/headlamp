import circleSlice2 from '@iconify/icons-mdi/circle-slice-2';
import databaseIcon from '@iconify/icons-mdi/database';
import folderNetworkOutline from '@iconify/icons-mdi/folder-network-outline';
import hexagonMultipleOutline from '@iconify/icons-mdi/hexagon-multiple-outline';
import lockIcon from '@iconify/icons-mdi/lock';
import { SidebarEntry } from '../../redux/reducers/ui';
import store from '../../redux/stores/store';

const LIST_ITEMS: SidebarEntry[] = [
  {
    name: 'cluster',
    label: 'Cluster',
    icon: hexagonMultipleOutline,
    subList: [
      {
        name: 'namespaces',
        label: 'Namespaces',
      },
      {
        name: 'nodes',
        label: 'Nodes',
      },
      {
        name: 'crds',
        label: 'CRDs',
      },
      {
        name: 'configMaps',
        label: 'Config Maps',
      },
    ],
  },
  {
    name: 'workloads',
    label: 'Workloads',
    icon: circleSlice2,
    subList: [
      {
        name: 'Pods',
        label: 'Pods',
      },
      {
        name: 'ReplicaSets',
        label: 'Replica Sets',
      },
      {
        name: 'DaemonSets',
        label: 'Daemon Sets',
      },
      {
        name: 'StatefulSets',
        label: 'Stateful Sets',
      },
      {
        name: 'Jobs',
        label: 'Jobs',
      },
      {
        name: 'Deployments',
        label: 'Deployments',
      },
      {
        name: 'CronJobs',
        label: 'CronJobs',
      },
    ],
  },
  {
    name: 'storage',
    label: 'Storage',
    icon: databaseIcon,
    subList: [
      {
        name: 'storageClasses',
        label: 'Storage Classes',
      },
      {
        name: 'persistentVolumes',
        label: 'Storage Volumes',
      },
      {
        name: 'persistentVolumeClaims',
        label: 'Persistent Volume Claims',
      },
    ],
  },
  {
    name: 'network',
    label: 'Network',
    icon: folderNetworkOutline,
    subList: [
      {
        name: 'services',
        label: 'Services',
      },
      {
        name: 'ingresses',
        label: 'Ingresses',
      },
    ],
  },
  {
    name: 'security',
    label: 'Security',
    icon: lockIcon,
    subList: [
      {
        name: 'serviceAccounts',
        label: 'Service Accounts',
      },
      {
        name: 'roles',
        label: 'Roles',
      },
      {
        name: 'roleBindings',
        label: 'Role Bindings',
      },
      {
        name: 'secrets',
        label: 'Secrets',
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
