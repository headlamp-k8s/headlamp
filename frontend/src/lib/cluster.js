export function podIsReady(pod) {
  return pod.status.phase == 'Running';
}
