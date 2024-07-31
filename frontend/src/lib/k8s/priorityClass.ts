import { apiFactory } from './apiProxy';
import { KubeObject, KubeObjectInterface } from './cluster';

export interface KubePriorityClass extends KubeObjectInterface {
  value: number;
  preemptionPolicy: string;
  globalDefault?: boolean | null;
  description: string;
}

class PriorityClass extends KubeObject<KubePriorityClass> {
  static objectName = 'priorityClass';
  static apiEndpoint = apiFactory('scheduling.k8s.io', 'v1', 'priorityclasses');

  static get pluralName(): string {
    return 'priorityclasses';
  }

  static get listRoute() {
    return 'priorityclasses';
  }

  get value(): number {
    return this.jsonData.value;
  }

  get globalDefault(): boolean | null {
    return this.jsonData.globalDefault!;
  }

  get description(): string {
    return this.jsonData.description;
  }

  get preemptionPolicy(): string {
    return this.jsonData.preemptionPolicy;
  }
}

export default PriorityClass;
