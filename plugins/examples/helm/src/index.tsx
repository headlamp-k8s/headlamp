import { registerRoute, registerSidebarEntry } from '@kinvolk/headlamp-plugin/lib';
import ChartDetails from './components/charts/Details';
import { ChartsList } from './components/charts/List';
import ReleaseDetail from './components/releases/Detail';
import ReleaseList from './components/releases/List';

registerSidebarEntry({
  name: 'Helm',
  url: '/helm/releases',
  icon: 'simple-icons:helm',
  parent: null,
  label: 'Helm',
});

registerSidebarEntry({
  name: 'Releases',
  url: '/helm/releases',
  icon: null,
  parent: 'Helm',
  label: 'Releases',
});

registerSidebarEntry({
  name: 'Charts',
  url: '/helm/charts',
  icon: null,
  parent: 'Helm',
  label: 'Charts',
});

// This component rendered at URL: /c/mycluster/feedback3
registerRoute({
  path: '/helm/releases',
  sidebar: 'Releases',
  name: 'Releases',
  exact: true,
  component: () => <ReleaseList />,
});

registerRoute({
  path: '/helm/:namespace/releases/:releaseName',
  sidebar: 'Releases',
  name: 'Release Detail',
  exact: true,
  component: () => <ReleaseDetail />,
});

registerRoute({
  path: '/helm/charts',
  sidebar: 'Charts',
  name: 'Charts',
  exact: true,
  component: () => <ChartsList />,
});

registerRoute({
  path: '/helm/charts/:chartName',
  sidebar: 'Charts',
  name: 'Charts',
  exact: true,
  component: () => <ChartDetails />,
});
