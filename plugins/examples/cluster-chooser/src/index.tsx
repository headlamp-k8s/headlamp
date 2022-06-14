import { Headlamp, Plugin, Registry } from '@kinvolk/headlamp-plugin/lib';
import React from 'react';

class ClusterChooser extends Plugin {
  initialize(registry: Registry) {
    console.log('clusterchooser initialized');
    registry.registerClusterChooser((props: any) => {
      const { clickHandler } = props;
      return <button onClick={clickHandler}>Chooser</button>;
    });
    return true;
  }
}

Headlamp.registerPlugin('clusterchooser', new ClusterChooser());
