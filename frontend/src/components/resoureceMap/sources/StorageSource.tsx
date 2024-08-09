import { GraphEdge, GraphSource } from '../GraphModel';

const pvcSource: GraphSource = {
  id: 'pvcs',
  label: 'PVCs',
  nodes: ({ resources }) =>
    resources.pvcs.map(pvc => ({
      type: 'kubeObject',
      id: pvc.metadata.uid,
      data: {
        resource: pvc,
      },
    })),
  edges: ({ resources }) => {
    const edges: GraphEdge[] = [];

    // find used pvc
    resources.pods.forEach(pod => {
      pod.spec.volumes?.forEach((volume: any) => {
        if (volume.persistentVolumeClaim) {
          const pvc = resources.pvcs.find(
            pvc => pvc.metadata.name === volume.persistentVolumeClaim!.claimName
          );
          if (pvc) {
            edges.push({
              id: `${pvc.metadata.uid}-${pod.metadata.uid}`,
              source: pvc.metadata.uid,
              target: pod.metadata.uid,
            });
          }
        }
      });
    });

    return edges;
  },
};

export const StorageSource: GraphSource = {
  id: 'storage',
  label: 'Storage',
  sources: [pvcSource],
};
