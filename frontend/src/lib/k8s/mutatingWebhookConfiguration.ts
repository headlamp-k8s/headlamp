import { apiFactory } from './apiProxy';
import { KubeObjectInterface, LabelSelector, makeKubeObject } from './cluster';

export interface KubeRuleWithOperations {
  apiGroups: string[];
  apiVersions: string[];
  operations: string[];
  resources: string[];
  scope?: string;
}

export interface KubeWebhookClientConfig {
  caBundle: string;
  url?: string;
  service?: {
    name: string;
    namespace: string;
    path?: string;
    port?: number;
  };
}

export interface KubeMutatingWebhookConfiguration extends KubeObjectInterface {
  webhooks: {
    admissionReviewVersions: string[];
    clientConfig: KubeWebhookClientConfig;
    failurePolicy?: string;
    matchPolicy?: string;
    name: string;
    namespaceSelector?: {
      matchExpressions: LabelSelector['matchExpressions'];
      matchLabels: LabelSelector['matchLabels'];
    };
    objectSelector?: {
      matchExpressions: LabelSelector['matchExpressions'];
      matchLabels: LabelSelector['matchLabels'];
    };
    reinvocationPolicy?: string;
    rules?: KubeRuleWithOperations[];
    sideEffects?: string;
    timeoutSeconds?: number;
  }[];
}

class MutatingWebhookConfiguration extends makeKubeObject<KubeMutatingWebhookConfiguration>(
  'MutatingWebhookConfiguration'
) {
  static apiEndpoint = apiFactory(
    'admissionregistration.k8s.io',
    'v1',
    'mutatingwebhookconfigurations'
  );

  get webhooks(): KubeMutatingWebhookConfiguration['webhooks'] {
    return this.jsonData!.webhooks;
  }
}

export default MutatingWebhookConfiguration;
