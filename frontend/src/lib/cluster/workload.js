export class Controller {
  static getReadyReplicas(item) {
    return (item.status.readyReplicas || item.status.numberReady || 0);
  }

  static getTotalReplicas(item) {
    return (item.spec.replicas || item.status.currentNumberScheduled || 0);
  }
}
