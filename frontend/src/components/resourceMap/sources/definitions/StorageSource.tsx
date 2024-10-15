import { Icon } from '@iconify/react';
import { useMemo } from 'react';
import PersistentVolumeClaim from '../../../../lib/k8s/persistentVolumeClaim';
import Pod from '../../../../lib/k8s/pod';
import { GraphEdge, GraphSource } from '../../graph/graphModel';
import { getKindGroupColor, KubeIcon } from '../../kubeIcon/KubeIcon';
import { makeKubeObjectNode, makeKubeToKubeEdge } from '../GraphSources';

const pvcSource: GraphSource = {
  id: 'pvcs',
  label: 'PVCs',
  icon: <KubeIcon kind="PersistentVolumeClaim" />,
  useData() {
    const { data: pvcs } = PersistentVolumeClaim.useList();
    const { data: pods } = Pod.useList();

    return useMemo(() => {
      const edges: GraphEdge[] = [];

      // find used pvc
      pods?.items?.forEach(pod => {
        pod.spec.volumes?.forEach((volume: any) => {
          if (volume.persistentVolumeClaim) {
            const pvc = pvcs?.items?.find(
              pvc => pvc.metadata.name === volume.persistentVolumeClaim!.claimName
            );
            if (pvc) {
              edges.push(makeKubeToKubeEdge(pvc, pod));
            }
          }
        });
      });

      return {
        nodes: pvcs?.items?.map(makeKubeObjectNode) ?? [],
        edges,
      };
    }, [pvcs, pods]);
  },
};

export const StorageSource: GraphSource = {
  id: 'storage',
  label: 'Storage',
  icon: (
    <Icon icon="mdi:database" width="100%" height="100%" color={getKindGroupColor('storage')} />
  ),
  sources: [pvcSource],
};
