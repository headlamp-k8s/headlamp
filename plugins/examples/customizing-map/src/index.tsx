import { registerMapSource } from '@kinvolk/headlamp-plugin/lib';
import { KubeObject } from '@kinvolk/headlamp-plugin/lib/K8s/cluster';
import { useMemo } from 'react';

registerMapSource({
  id: 'my-source', // ID of the source should be unique
  label: 'My Source', // label will be displayed in source picker
  // you can provide an icon
  icon: (
    <img
      src="https://headlamp.dev/img/favicon.png"
      alt="My Source logo"
      style={{ width: '100%', height: '100%' }}
    />
  ),
  /**
   * useData is a hook that will be called to load nodes and edges for your source
   * You can use hooks here that Headlamp provides to load Kubernetes resources
   * this hook should return an object with nodes and edges or `null` if it's loading
   * it's important that return object is not recreated every time, so useMemo is required
   */
  useData() {
    return useMemo(() => {
      // Hardcoded kubernetes object as an example
      const myResource = {
        kind: 'MyResourceKind',
        metadata: {
          uid: '1234',
          name: 'my-test-resource',
          namespace: 'test-namespace',
          creationTimestamp: '1234',
        },
      };

      return {
        nodes: [
          {
            id: myResource.metadata.uid, // ID should be unique
            kubeObject: new KubeObject(myResource),
            icon: <img src="https://headlamp.dev/img/favicon.png" alt="MyResourceKind icon" />,
          },
        ],
      };
    }, []);
  },
});
