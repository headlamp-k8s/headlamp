import circleSlice2 from '@iconify/icons-mdi/circle-slice-2';
import databaseIcon from '@iconify/icons-mdi/database';
import folderNetworkOutline from '@iconify/icons-mdi/folder-network-outline';
import hexagonMultipleOutline from '@iconify/icons-mdi/hexagon-multiple-outline';
import lockIcon from '@iconify/icons-mdi/lock';
import { TFunction } from 'react-i18next';
import { SidebarEntry } from '../../redux/reducers/ui';
import store from '../../redux/stores/store';

function prepareRoutes(t: TFunction<'translation'>) {
  const LIST_ITEMS: SidebarEntry[] = [
    {
      name: 'cluster',
      label: t('glossary|Cluster'),
      icon: hexagonMultipleOutline,
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
      ],
    },
    {
      name: 'workloads',
      label: t('glossary|Workloads'),
      icon: circleSlice2,
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
      icon: databaseIcon,
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
      icon: folderNetworkOutline,
      subList: [
        {
          name: 'services',
          label: t('glossary|Services'),
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
      icon: lockIcon,
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
