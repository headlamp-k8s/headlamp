import _ from 'lodash';
import { KubeMetadata, KubeObjectClass, KubeObjectInterface } from '../lib/k8s/cluster';

interface K8sResourceListGeneratorOptions<T extends KubeObjectClass> {
  numResults?: number;
  instantiateAs?: T;
}

export function generateK8sResourceList<T extends KubeObjectInterface, C extends KubeObjectClass>(
  baseJson: Partial<T>,
  options: K8sResourceListGeneratorOptions<C> = {}
) {
  const { numResults = 5, instantiateAs } = options;
  const list = [];
  for (let i = 0; i < numResults; i++) {
    const json = {
      metadata: {
        name: '',
      } as KubeMetadata,
      ..._.cloneDeep(baseJson),
    } as T;

    json.metadata.creationTimestamp = new Date('2020-01-01').toISOString();

    if (json.metadata.name) {
      json.metadata.name = json.metadata.name.replace('{{i}}', i.toString());
    }

    if (!json.metadata.name) {
      json.metadata.name = json.kind.toLowerCase() + `-${i}`;
    }

    if (json.metadata.namespace !== undefined) {
      json.metadata.namespace.replace('{{i}}', i.toString());
      if (!json.metadata.namespace) {
        json.metadata.namespace = 'my-namespace';
      }
    }

    json.metadata.resourceVersion = i.toString();
    json.metadata.selfLink = `/${json.kind.toLowerCase()}/${json.metadata.name}`;
    json.metadata.uid = 'abcde-' + i;

    list.push(!!instantiateAs ? new instantiateAs(json as T) : json);
  }

  return list;
}
