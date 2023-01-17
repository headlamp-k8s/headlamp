import { registerAppBarAction, registerRoute, registerSidebarEntry } from '@kinvolk/headlamp-plugin/lib';
import { ActionButton, SectionBox } from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { useCluster, useClustersConf } from '@kinvolk/headlamp-plugin/lib/k8s';
import ReactMarkdown from 'react-markdown';

// Below are some imports you may want to use.
//   See README.md for links to plugin development documentation.
// import { K8s } from '@kinvolk/headlamp-plugin/lib/K8s';

const helpMd = `Before reaching out to support, try to find the answer to your question in the [Azure documentation](https://docs.microsoft.com/en-us/azure/aks/).

Common topics:
* [Upgrade a cluster](https://learn.microsoft.com/en-us/azure/aks/upgrade-cluster)
* [Azure CLI](https://learn.microsoft.com/en-us/azure/aks/learn/quick-kubernetes-deploy-cli)
* ...
`;

function useAzureChecker() {
  const cluster = useCluster();
  const clustersConf = useClustersConf();

  if (cluster && clustersConf) {
    const clusterConf = clustersConf[cluster];
    // This is a bad hack to check if the cluster is an AKS cluster...
    if (clusterConf && clusterConf.server.includes('azmk')) {
      return true;
    }
  }

  return false;
}

function TopBarHelpIcon() {
  const isAKS = useAzureChecker();

  if (!isAKS) {
    return null;
  }

  return (
    <ActionButton
      description="Open Azure Portal"
      icon="mdi:microsoft-azure"
      onClick={() => window.open('https://portal.azure.com')}
    />
  );
}

function AzureHelp() {
  const isAKS = useAzureChecker();
  if (!isAKS) {
    return null;
  }

  return (
    <SectionBox title="Azure Help" paddingTop={2}>
      <ReactMarkdown children={helpMd} />
    </SectionBox>
  );
}

registerRoute({
  path: '/azure-help',
  sidebar: 'feedback',
  name: 'feedback',
  exact: true,
  component: () => (
    <AzureHelp />
  ),
});
registerSidebarEntry({
  parent: null,
  name: 'feedback',
  label: 'Azure Help',
  url: '/azure-help',
  icon: 'mdi:help-circle',
});

registerAppBarAction(TopBarHelpIcon);
