export function podIsReady(pod) {
  return pod.status.phase == 'Running';
}

export const CLUSTER_ACTION_GRACE_PERIOD = 5000; // ms
