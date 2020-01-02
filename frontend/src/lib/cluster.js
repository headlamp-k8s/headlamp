export function podIsReady(pod) {
  return pod.status.phase == 'Running';
}

export const DELETION_GRACE_PERIOD = 5000; // ms
