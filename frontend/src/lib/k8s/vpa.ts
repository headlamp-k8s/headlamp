import { ResourceClasses } from '.';
import { apiFactoryWithNamespace } from './apiProxy';
import { request } from './apiProxy';
import { KubeObject, KubeObjectInterface, makeKubeObject } from './cluster';

type ResourceName = 'cpu' | 'memory' | 'storage' | 'ephemeral-storage';

type UpdateMode = 'Off' | 'Initial' | 'Auto' | 'Recreate';

type EvictionChangeRequirement = 'TargetHigherThanRequests' | 'TargetLowerThanRequests';

interface VpaSpec {
  targetRef: {
    apiVersion: string;
    kind: string;
    name: string;
    namespace?: string;
  };
  updatePolicy?: {
    updateMode: UpdateMode;
    minReplicas?: number;
    evictionRequirements?: {
      resources: {
        resourceName: ResourceName;
      }[];
      changeRequirement: EvictionChangeRequirement;
    }[];
  };
  resourcePolicy?: {
    containerPolicies: {
      containerName: string;
      mode?: UpdateMode;
      minAllowed?: {};
      maxAllowed?: {};
      controlledResources?: ResourceName[];
      controlledValues?: 'RequestsAndLimits' | 'RequestsOnly';
    }[];
  };
  recommenders?: {
    name: string;
  }[];
}

interface VpaStatus {
  conditions: VpaCondition[];
  recommendation?: VpaRecommendation;
}

interface VpaCondition {
  type: string;
  status: string;
  lastTransitionTime: string;
  reason?: string;
  message?: string;
}

interface RecommendationValue {
  cpu?: string;
  memory?: string;
  storage?: string;
  ephemeralStorage?: string;
}

interface VpaRecommendation {
  containerRecommendations: {
    containerName: string;
    lowerBound: RecommendationValue;
    target: RecommendationValue;
    uncappedTarget: RecommendationValue;
    upperBound: RecommendationValue;
  }[];
}

export interface KubeVPA extends KubeObjectInterface {
  spec: VpaSpec;
  status: VpaStatus;
}

class VPA extends makeKubeObject<KubeVPA>('verticalPodAutoscaler') {
  static apiEndpoint = apiFactoryWithNamespace(
    'autoscaling.k8s.io',
    'v1',
    'verticalpodautoscalers'
  );

  static async isEnabled(): Promise<boolean> {
    let res;
    try {
      res = await request('/apis/autoscaling.k8s.io/v1');
    } catch (e) {
      return false;
    }
    if (
      res?.resources?.find(
        (r: { name: string; [key: string]: any }) => r?.name === 'verticalpodautoscalers'
      )
    ) {
      return true;
    } else {
      return false;
    }
  }

  get spec(): VpaSpec {
    return this.jsonData!.spec;
  }

  get status(): VpaStatus {
    return this.jsonData!.status;
  }

  get referenceObject(): KubeObject | null {
    const target = this?.spec?.targetRef;
    if (!target) {
      return null;
    }

    const TargetObjectClass = ResourceClasses[target.kind];
    let objInstance: KubeObject | null = null;
    if (!!TargetObjectClass) {
      objInstance = new TargetObjectClass({
        metadata: {
          name: target.name,
          namespace: target.namespace || this.metadata.namespace,
        },
        kind: target.kind,
      });
    }
    return objInstance;
  }

  get targetRecommendations(): RecommendationValue | null | undefined {
    if (!this?.status?.recommendation) {
      return null;
    }

    const target = this?.status?.recommendation?.containerRecommendations?.[0]?.target;
    return target;
  }
}

export default VPA;
