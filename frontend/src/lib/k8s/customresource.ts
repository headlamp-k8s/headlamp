import { OpPatch } from 'json-patch';
import { apiFactoryWithNamespace } from './apiProxy';
import { KubeObject, makeKubeObject } from './cluster';

export default class CustomResource extends makeKubeObject<KubeObject>('CustomResource') {
  public apiEndpoint;
  constructor(private group: string, private version: string, private resource: string) {
    super({});
    this.apiEndpoint = apiFactoryWithNamespace(this.group, this.version, this.resource);
  }

  patch(body: OpPatch[], namespace: string, name: string) {
    return this.apiEndpoint.patch(body, namespace, name);
  }
}
