import _ from 'lodash';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import helpers from '../../helpers';
import { createRouteURL } from '../../lib/router';
import { getCluster } from '../../lib/util';
import { useTypedSelector } from '../../redux/reducers/reducers';
import { DefaultSidebars, SidebarEntry, SidebarItemProps } from '.';

export const useSidebarItems = (sidebarName: string = DefaultSidebars.IN_CLUSTER) => {
  const clusters = useTypedSelector(state => state.config.clusters) ?? {};
  const customSidebarEntries = useTypedSelector(state => state.sidebar.entries);
  const customSidebarFilters = useTypedSelector(state => state.sidebar.filters);
  const shouldShowHomeItem = helpers.isElectron() || Object.keys(clusters).length !== 1;
  const { t } = useTranslation();

  const sidebars = useMemo(() => {
    const homeItems: SidebarItemProps[] = [
      {
        name: 'home',
        icon: shouldShowHomeItem ? 'mdi:home' : 'mdi:hexagon-multiple-outline',
        label: shouldShowHomeItem ? t('translation|Home') : t('glossary|Cluster'),
        url: shouldShowHomeItem
          ? '/'
          : createRouteURL('cluster', { cluster: Object.keys(clusters)[0] }),
        divider: !shouldShowHomeItem,
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
        url: '/settings/general',
        subList: [
          {
            name: 'settingsGeneral',
            label: t('translation|General'),
            url: '/settings/general',
          },
          {
            name: 'plugins',
            label: t('translation|Plugins'),
            url: '/settings/plugins',
          },
          {
            name: 'settingsCluster',
            label: t('glossary|Cluster'),
            url: '/settings/cluster',
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
        hide: !shouldShowHomeItem,
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
        name: 'gatewayapi',
        label: t('glossary|Gateway (beta)'),
        icon: 'mdi:lan-connect',
        subList: [
          {
            name: 'gateways',
            label: t('glossary|Gateways'),
          },
          {
            name: 'gatewayclasses',
            label: t('glossary|Gateway Classes'),
          },
          {
            name: 'httproutes',
            label: t('glossary|HTTP Routes'),
          },
          {
            name: 'grpcroutes',
            label: t('glossary|GRPC Routes'),
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
      {
        name: 'crds',
        label: t('glossary|Custom Resources'),
        icon: 'mdi:puzzle',
        subList: [
          {
            name: 'crs',
            label: t('translation|Instances'),
          },
        ],
      },
      {
        name: 'map',
        icon: 'mdi:map',
        label: t('glossary|Map (beta)'),
      },
    ];

    const sidebars: Record<string, SidebarItemProps[]> = {
      [DefaultSidebars.HOME]: homeItems,
      [DefaultSidebars.IN_CLUSTER]: inClusterItems,
    };

    // Set of all the entries that need to be added
    const entriesToAdd = new Set<SidebarEntry>(_.cloneDeep(Object.values(customSidebarEntries)));

    // Takes entry from the set and places it in the appropriate sidebar or a parent item
    // Recursively looks for child items
    const placeSidebarEntry = (entry: SidebarItemProps, parentEntry?: SidebarItemProps) => {
      // Skip entries with parents, they're handled in a separate loop
      if (entry.parent && !parentEntry) return;

      // Add entry to the sidebar or parent item
      if (parentEntry) {
        parentEntry.subList ??= [];
        parentEntry.subList.push(entry);
      } else {
        const entrySidebarName = entry.sidebar ?? DefaultSidebars.IN_CLUSTER;
        sidebars[entrySidebarName] ??= [];
        sidebars[entrySidebarName].push(entry);
      }
      entriesToAdd.delete(entry);

      // Find and place all child entries
      entriesToAdd.forEach(maybeChildEntry => {
        if (maybeChildEntry.parent === entry.name) {
          placeSidebarEntry(maybeChildEntry, entry);
        }
      });
    };

    entriesToAdd.forEach(entry => placeSidebarEntry(entry));

    if (entriesToAdd.size > 0) {
      console.error(`Couldn't find where to put some sidebar entries`, entriesToAdd.values());
    }

    // Filter in-cluster sidebar
    if (customSidebarFilters.length > 0) {
      const filterSublist = (item: SidebarItemProps, filter: any) => {
        if (item.subList) {
          item.subList = item.subList.filter(it => filter(it));
          item.subList = item.subList.map(it => filterSublist(it, filter));
        }

        return item;
      };

      customSidebarFilters.forEach(customFilter => {
        sidebars[DefaultSidebars.IN_CLUSTER] = sidebars[DefaultSidebars.IN_CLUSTER]
          .filter(it => customFilter(it))
          .map(it => filterSublist(it, customFilter));
      });
    }

    return sidebars;
  }, [customSidebarEntries, shouldShowHomeItem, Object.keys(clusters).join(',')]);

  return sidebars[sidebarName === '' ? DefaultSidebars.IN_CLUSTER : sidebarName] ?? [];
};
