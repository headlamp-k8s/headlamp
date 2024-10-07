import { apiFactory } from './apiProxy';
import { LabelSelector } from './cluster';
import { KubeObject, KubeObjectInterface } from './KubeObject';
import { KubeRuleWithOperations, KubeWebhookClientConfig } from './mutatingWebhookConfiguration';

export interface KubeValidatingWebhookConfiguration extends KubeObjectInterface {
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
    rules?: KubeRuleWithOperations[];
    sideEffects?: string;
    timeoutSeconds?: number;
  }[];
}

class ValidatingWebhookConfiguration extends KubeObject<KubeValidatingWebhookConfiguration> {
  static kind = 'ValidatingWebhookConfiguration';
  static apiName = 'validatingwebhookconfigurations';
  static apiVersion = 'admissionregistration.k8s.io/v1';
  static isNamespaced = false;

  static apiEndpoint = apiFactory(
    'admissionregistration.k8s.io',
    'v1',
    'validatingwebhookconfigurations'
  );

  get webhooks(): KubeValidatingWebhookConfiguration['webhooks'] {
    return this.jsonData.webhooks;
  }
}

export default ValidatingWebhookConfiguration;
