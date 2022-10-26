import { apiFactoryWithNamespace } from './apiProxy';
import { KubeObjectInterface, makeKubeObject } from './cluster';

export interface KubePriorityClasses extends KubeObjectInterface {
  value: number;
  preemptionPolicy: string;
  globalDefault?: boolean;
  description: string;
}

class PriorityClasses extends makeKubeObject<KubePriorityClasses>('priorityClass') {
  static apiEndpoint = apiFactoryWithNamespace('scheduling.k8s.io', 'v1', 'priorityclasses');

  static get pluralName(): string {
    return 'priorityclasses';
  }

  get listRoute() {
    return 'priorityclasses';
  }

  get value(): string {
    return this.jsonData!.value;
  }

  get globalDefault(): boolean | null {
    return this.jsonData.globalDefault;
  }

  get description(): string {
    return this.jsonData!.description;
  }

  get preemptionPolicy(): string {
    return this.jsonData!.preemptionPolicy;
  }
}

export default PriorityClasses;
