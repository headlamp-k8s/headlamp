import { KubeObject, Workload } from '../../../lib/k8s/cluster';
import Pod from '../../../lib/k8s/pod';
import { getReadyReplicas, getTotalReplicas } from '../../../lib/util';

type KubeObjectStatus = 'error' | 'success' | 'warning';

/**
 * Returns a generic status for the given Pod
 * Status is determined based on phase and conditions
 */
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

/**
 * Returns status for a given Kube resource
 * Not all kinds of resources have a status and/or supported
 */
export function getStatus(w: KubeObject): KubeObjectStatus {
  if (w.kind === 'Pod') return getPodStatus(w as Pod);

  if (['DaemonSet', 'ReplicaSet', 'StatefulSet', 'Deployment'].includes(w.kind)) {
    const workload = w as Workload;
    const notReady = getReadyReplicas(workload) < getTotalReplicas(workload);
    return notReady ? 'warning' : 'success';
  }

  return 'success';
}
