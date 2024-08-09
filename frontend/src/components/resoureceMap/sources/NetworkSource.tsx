import { GraphEdge, GraphSource } from '../GraphModel';
import { matchesSelector } from './WorkloadSource';

const serviceSource: GraphSource = {
  id: 'services',
  label: 'Services',
  nodes: ({ resources }) =>
    resources.services.map(service => ({
      type: 'kubeObject',
      id: service.metadata.uid,
      data: {
        resource: service,
      },
    })),

  edges: ({ resources }) => {
    const edges: GraphEdge[] = [];

    resources.services.forEach(service => {
      const matchingPods = resources.pods.filter(matchesSelector(service.spec.selector));

      matchingPods.forEach(pod => {
        edges.push({
          id: `${service.metadata.uid}-${pod.metadata.uid}`,
          source: service.metadata.uid,
          target: pod.metadata.uid,
        });
      });
    });
    return edges;
  },
};

const ingressListSource: GraphSource = {
  id: 'ingressList',
  label: 'Ingress',
  nodes: ({ resources }) =>
    resources.ingressList.map(ingress => ({
      type: 'kubeObject',
      id: ingress.metadata.uid,
      data: {
        resource: ingress,
      },
    })),
  edges: ({ resources }) => {
    const edges: GraphEdge[] = [];

    resources.ingressList.forEach(ingress => {
      ingress.spec.rules.forEach((rule: any) => {
        rule.http.paths.forEach((path: any) => {
          const service = resources.services.find(
            service => service.metadata.name === path?.backend?.service?.name
          );
          if (service) {
            edges.push({
              id: `${service.metadata.uid}-${ingress.metadata.uid}`,
              source: service.metadata.uid,
              target: ingress.metadata.uid,
            });
          }
        });
      });

      ingress.spec.tls?.forEach((tls: any) => {
        if (tls.secretName) {
          const secret = resources.secrets.find(secret => secret.metadata.name === tls.secretName);
          if (secret) {
            edges.push({
              id: `${secret.metadata.uid}-${ingress.metadata.uid}`,
              source: secret.metadata.uid,
              target: ingress.metadata.uid,
            });
          }
        }
      });
    });

    return edges;
  },
};

const networkPoliciesSource: GraphSource = {
  id: 'networkPolicies',
  label: 'Network Policies',
  nodes: ({ resources }) =>
    resources.networkPolicies.map(np => ({
      type: 'kubeObject',
      id: np.metadata.uid,
      data: {
        resource: np,
      },
    })),
  edges: ({ resources }) => {
    const edges: GraphEdge[] = [];

    resources.networkPolicies.forEach(np => {
      const matchingPods = resources.pods.filter(
        matchesSelector(np.jsonData.spec.podSelector.matchLabels)
      );

      matchingPods.forEach(pod => {
        edges.push({
          id: `${np.metadata.uid}-${pod.metadata.uid}`,
          source: np.metadata.uid,
          target: pod.metadata.uid,
        });
      });
    });

    return edges;
  },
};

export const NetworkSource = {
  id: 'network',
  label: 'Network',
  sources: [
    serviceSource,
    // endpointsSource,
    ingressListSource,
    // ingressClassesSource,
    networkPoliciesSource,
  ],
};
