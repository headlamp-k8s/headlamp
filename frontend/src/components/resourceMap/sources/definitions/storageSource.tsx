import { Icon } from '@iconify/react';
import { useMemo } from 'react';
import PersistentVolumeClaim from '../../../../lib/k8s/persistentVolumeClaim';
import Pod from '../../../../lib/k8s/pod';
import { useNamespaces } from '../../../../redux/filterSlice';
import { GraphEdge, GraphSource } from '../../graph/graphModel';
import { getKindGroupColor, KubeIcon } from '../../kubeIcon/KubeIcon';
import { makeKubeObjectNode, makeKubeToKubeEdge } from '../GraphSources';

const pvcSource: GraphSource = {
  id: 'pvcs',
  label: 'PVCs',
  icon: <KubeIcon kind="PersistentVolumeClaim" />,
  useData() {
    const [pvcs] = PersistentVolumeClaim.useList({ namespace: useNamespaces() });
    const [pods] = Pod.useList({ namespace: useNamespaces() });

    return useMemo(() => {
      if (!pvcs || !pods) return null;

      const edges: GraphEdge[] = [];

      // find used pvc
      pods.forEach(pod => {
        pod.spec.volumes?.forEach(volume => {
          if (volume.persistentVolumeClaim) {
            const pvc = pvcs.find(
              pvc => pvc.metadata.name === volume.persistentVolumeClaim!.claimName
            );
            if (pvc) {
              edges.push(makeKubeToKubeEdge(pvc, pod));
            }
          }
        });
      });

      return {
        nodes: pvcs.map(makeKubeObjectNode) ?? [],
        edges,
      };
    }, [pvcs, pods]);
  },
};

export const storageSource: GraphSource = {
  id: 'storage',
  label: 'Storage',
  icon: (
    <Icon icon="mdi:database" width="100%" height="100%" color={getKindGroupColor('storage')} />
  ),
  sources: [pvcSource],
};
