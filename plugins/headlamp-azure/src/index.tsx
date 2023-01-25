import { registerAppBarAction, registerRoute } from '@kinvolk/headlamp-plugin/lib';;
// import { registerRoute } from '@kinvolk/headlamp-plugin/lib';;
import { AzureCallback } from './components/AzureCallback';
import { AzureLogin } from './components/AzureLogin';
import { SubscriptionList } from './components/SubscriptionList';



registerAppBarAction(AzureLogin);

registerRoute({
    path: '/azure/callback',
    name: 'Azure Callback',
    exact: true,
    noAuthRequired: true,
    useClusterURL: false,
    sidebar: null,
    hideAppBar: true,
    component: () => <AzureCallback />,
});

registerRoute({
    path: '/azure/clusters',
    name: 'Azure Cluster List',
    exact: true,
    noAuthRequired: true,
    useClusterURL: false,
    sidebar: null,
    // hideAppBar: true,
    component: () => <SubscriptionList />,
})
