import { ResourceClasses } from '.';
import { apiFactoryWithNamespace } from './apiProxy';
import { KubeObject, KubeObjectInterface, makeKubeObject } from './cluster';

export interface KubeHorizontalPodAutoscaler extends KubeObjectInterface {}

class HorizontalPodAutoscaler extends makeKubeObject<KubeHorizontalPodAutoscaler>(
  'horizontalPodAutoscaler'
) {
  static apiEndpoint = apiFactoryWithNamespace(
    ['autoscaling', 'v2beta1', 'horizontalpodautoscalers'],
    ['autoscaling', 'v1', 'horizontalpodautoscalers']
  );

  get targetObjectInstance(): KubeObject | null {
    const target = this.jsonData?.spec?.scaleTargetRef;
    if (!target) {
      return null;
    }

    const TargetObjectClass = ResourceClasses[target.kind];
    let objInstance: KubeObject | null = null;
    if (!!TargetObjectClass) {
      objInstance = new TargetObjectClass({
        kind: target.kind,
        metadata: {
          name: target.name,
          namespace: this.getNamespace(),
        },
      });
    }

    return objInstance;
  }
}

export default HorizontalPodAutoscaler;
