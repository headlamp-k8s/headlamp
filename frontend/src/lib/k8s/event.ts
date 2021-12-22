import { ResourceClasses } from '.';
import { apiFactoryWithNamespace } from './apiProxy';
import { KubeMetadata, KubeObject, makeKubeObject } from './cluster';

export interface KubeEvent {
  type: string;
  reason: string;
  message: string;
  metadata: KubeMetadata;
  involvedObject: {
    kind: string;
    namespace: string;
    name: string;
    uid: string;
    apiVersion: string;
    resourceVersion: string;
    fieldPath: string;
  };
  [otherProps: string]: any;
}

class Event extends makeKubeObject<KubeEvent>('Event') {
  static apiEndpoint = apiFactoryWithNamespace('', 'v1', 'events');

  get spec() {
    return this.getValue('spec');
  }

  get status() {
    return this.getValue('status');
  }

  get involvedObject() {
    return this.getValue('involvedObject');
  }

  get type() {
    return this.getValue('type');
  }

  get reason() {
    return this.getValue('reason');
  }

  get message() {
    return this.getValue('message');
  }

  get involvedObjectInstance(): KubeObject | null {
    if (!this.involvedObject) {
      return null;
    }

    const InvolvedObjectClass = ResourceClasses[this.involvedObject.kind];
    let objInstance: KubeObject | null = null;
    if (!!InvolvedObjectClass) {
      objInstance = new InvolvedObjectClass({
        kind: this.involvedObject.kind,
        metadata: {
          name: this.involvedObject.name,
          namespace: this.involvedObject.namespace,
        },
      });
    }

    return objInstance;
  }
}

export default Event;
