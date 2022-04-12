import { Headlamp, K8s, Plugin, Registry } from '@kinvolk/headlamp-plugin/lib';
// import { apply } from '@kinvolk/headlamp-plugin/types/lib/k8s';
// import { KubeObjectInterface, makeKubeObject } from '@kinvolk/headlamp-plugin/types/lib/k8s/cluster';
import React from 'react';

// let sampleCR1: KubeObjectInterface  = {
//     apiVersion: 'stable.example.com/v1',
//     kind: 'CronTab',
//     metadata: {
//         name: 'my-new-cron-object',
//         namespace: 'default'
//     },
//     spec: {
//         cronSpec: '* * * * */5',
//         image: 'my-awesome-cron-image'
//     }
// }
function CustomResources() {
  const Customresource = K8s.crd.makeCustomResourceClass(
    [['stable.example.com', 'v1', 'crontabs']],
    true
  );
  Customresource.useApiGet(
    item => {
      console.log('Customresource.useApiGet', item);
    },
    'my-new-cron-object',
    'default',
    error => {
      console.error('error: Customresource.useApiGet', error);
    }
  );
  return <div>Hello</div>;
}

class CustomResourceExample extends Plugin {
  initialize(registry: Registry) {
    console.log('CustomResourceExample...');
    registry.registerSidebarItem(
      'cluster',
      'customresources',
      'Custom Resources',
      '/customresources'
    );
    registry.registerRoute({
      path: '/customresources',
      sidebar: 'crs',
      component: () => <CustomResources />,
    });
    return true;
  }
}

Headlamp.registerPlugin('custom-resource-test', new CustomResourceExample());
