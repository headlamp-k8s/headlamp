import { KubeObject } from '../../../lib/k8s/cluster';
import Pod from '../../../lib/k8s/pod';
import { getReadyReplicas, getTotalReplicas } from '../../../lib/util';

type KubeObjectStatus = 'error' | 'success' | 'warning';

function getPodStatus(pod: Pod): KubeObjectStatus {
  const phase = pod.status.phase;

  if (phase === 'Failed') {
    return 'error';
  } else if (phase === 'Succeeded' || phase === 'Running') {
    const readyCondition = pod.status.conditions.find(condition => condition.type === 'Ready');
    if (readyCondition?.status === 'True' || phase === 'Succeeded') {
      return 'success';
    } else {
      return 'warning';
    }
  } else if (phase === 'Pending') {
    return 'warning';
  }
  return 'success';
}

export function getStatus(w: KubeObject): KubeObjectStatus {
  if (w.kind === 'Pod') return getPodStatus(w);

  if (['DaemonSet', 'ReplicaSet', 'StatefulSet', 'Job', 'CronJob', 'Deployment'].includes(w.kind)) {
    const notReady = getReadyReplicas(w) < getTotalReplicas(w);

    return notReady ? 'error' : 'success';
  }

  return 'success';
}
