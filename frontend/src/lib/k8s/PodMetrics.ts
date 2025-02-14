import { KubeObject, KubeObjectInterface } from './KubeObject';

interface KubePodMetrics extends KubeObjectInterface {
  timestamp: string;
  window: string;
  containers: Array<{
    name: string;
    usage: {
      cpu: string;
      memory: string;
    };
  }>;
}

export const METRIC_REFETCH_INTERVAL_MS = 5_000;

export class PodMetrics extends KubeObject<KubePodMetrics> {
  static kind = 'PodMetric';
  static apiName = 'pods';
  static apiVersion = 'metrics.k8s.io/v1beta1';
  static isNamespaced = true;
}
