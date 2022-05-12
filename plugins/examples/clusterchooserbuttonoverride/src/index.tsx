import { Headlamp, Plugin, Registry } from '@kinvolk/headlamp-plugin/lib';
import React from 'react';

class ClusterChooserButtonOverridePlugin extends Plugin {
  initialize(registry: Registry) {
    console.log('clusterbuttonoverride initialized');
    registry.registerClusterChooserComponent((props: any) => {
      const { clickHandler } = props;
      return <button onClick={clickHandler}>Chooser</button>;
    });
    return true;
  }
}

Headlamp.registerPlugin('clusterbuttonoverride', new ClusterChooserButtonOverridePlugin());
