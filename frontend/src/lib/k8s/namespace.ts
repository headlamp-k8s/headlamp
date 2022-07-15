import { apiFactory } from './apiProxy';
import { KubeObjectInterface, makeKubeObject } from './cluster';
import { IoK8sApiCoreV1Namespace } from './gen/model/IoK8sApiCoreV1Namespace';

export interface KubeNamespace extends KubeObjectInterface, IoK8sApiCoreV1Namespace {}

class Namespace extends makeKubeObject<KubeNamespace>('namespace') {
  static apiEndpoint = apiFactory('', 'v1', 'namespaces');

  get status() {
    return this.jsonData!.status;
  }
}

// export interface KubeNamespace extends KubeObjectInterface {
//   status: {
//     phase: string;
//   };
// }

// class Namespace extends makeKubeObject<KubeNamespace>('namespace') {
//   static apiEndpoint = apiFactory('', 'v1', 'namespaces');

//   get status() {
//     return this.jsonData!.status;
//   }
// }

export default Namespace;
