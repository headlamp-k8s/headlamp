import { Headlamp, Plugin, Registry } from '@kinvolk/headlamp-plugin/lib';
import { Button } from '@material-ui/core';
import React from 'react';

function ClusterCreationButton() {
  return (
    <Button
      onClick={() => {
        Headlamp.setCluster({
          name: 'my-plugin-set-cluster',
          server: 'http://phony.abcde-example-k8s-cluster.k8scluster',
        })
        .then(() => {
          window.location.reload();
        })
        .catch((e) => {
          console.log('Error setting cluster', e)
        });
      }}
    >
      New cluster
    </Button>
  );
}

class MyPlugin extends Plugin {
  initialize(registry: Registry) {
    console.log('dynamic-clusters initialized');

    registry.registerAppBarAction('dynamic-clusters-create', () => <ClusterCreationButton />);

    return true;
  }
}

Headlamp.registerPlugin('dynamic-clusters', new MyPlugin());
