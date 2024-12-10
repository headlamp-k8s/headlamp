import { KubeObject, KubeObjectInterface } from './KubeObject';

export interface KubePriorityClass extends KubeObjectInterface {
  value: number;
  preemptionPolicy: string;
  globalDefault?: boolean | null;
  description: string;
}

class PriorityClass extends KubeObject<KubePriorityClass> {
  static kind = 'PriorityClass';
  static apiName = 'priorityclasses';
  static apiVersion = 'scheduling.k8s.io/v1';
  static isNamespaced = false;

  static getBaseObject(): KubePriorityClass {
    const baseObject = super.getBaseObject() as KubePriorityClass;
    baseObject.value = 0;
    baseObject.preemptionPolicy = '';
    baseObject.globalDefault = false;
    baseObject.description = '';
    return baseObject;
  }

  get value(): number {
    return this.jsonData!.value;
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
