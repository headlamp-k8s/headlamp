import { apiFactory } from './apiProxy';
import { KubeObjectInterface, makeKubeObject } from './cluster';

export interface KubePriorityClass extends KubeObjectInterface {
  value: number;
  preemptionPolicy: string;
  globalDefault?: boolean;
  description: string;
}

class PriorityClass extends makeKubeObject<KubePriorityClass>('priorityClass') {
  static apiEndpoint = apiFactory('scheduling.k8s.io', 'v1', 'priorityclasses');

  static get pluralName(): string {
    return 'priorityclasses';
  }

  static get listRoute() {
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

export default PriorityClass;
