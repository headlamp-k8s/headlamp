import { Icon } from '@iconify/react';
import { useMemo } from 'react';
import Endpoints from '../../../../lib/k8s/endpoints';
import Ingress, { IngressRule } from '../../../../lib/k8s/ingress';
import IngressClass from '../../../../lib/k8s/ingressClass';
import NetworkPolicy from '../../../../lib/k8s/networkpolicy';
import Pod from '../../../../lib/k8s/pod';
import Secret from '../../../../lib/k8s/secret';
import Service from '../../../../lib/k8s/service';
import { useNamespaces } from '../../../../redux/filterSlice';
import { GraphEdge, GraphSource } from '../../graph/graphModel';
import { getKindGroupColor, KubeIcon } from '../../kubeIcon/KubeIcon';
import { makeKubeObjectNode, makeKubeToKubeEdge } from '../GraphSources';
import { matchesSelector } from './workloadSource';

const serviceSource: GraphSource = {
  id: 'services',
  label: 'Services',
  icon: <KubeIcon kind={'Service'} />,
  useData() {
    const [services] = Service.useList({ namespace: useNamespaces() });
    const [pods] = Pod.useList({ namespace: useNamespaces() });

    return useMemo(() => {
      if (!services || !pods) return null;

      const edges: GraphEdge[] = [];

      services.forEach(service => {
        const matchingPods = pods.filter(matchesSelector(service.spec.selector));

        matchingPods?.forEach(pod => {
          edges.push(makeKubeToKubeEdge(service, pod));
        });
      });

      return {
        edges,
        nodes: services.map(makeKubeObjectNode) ?? [],
      };
    }, [services, pods]);
  },
};

const endpointsSource: GraphSource = {
  id: 'endpoints',
  label: 'Endpoints',
  icon: <KubeIcon kind="Endpoint" />,
  useData() {
    const [endpoints] = Endpoints.useList({ namespace: useNamespaces() });
    const [services] = Service.useList({ namespace: useNamespaces() });

    return useMemo(() => {
      const nodes = endpoints?.map(makeKubeObjectNode) ?? [];
      const edges: GraphEdge[] = [];

      services?.forEach(service => {
        endpoints?.forEach(endpoint => {
          if (endpoint.getName() === service.getName()) {
            edges.push(makeKubeToKubeEdge(service, endpoint));
          }
        });
      });

      return { nodes, edges };
    }, [endpoints, services]);
  },
};

const ingressListSource: GraphSource = {
  id: 'ingressList',
  label: 'Ingress',
  icon: <KubeIcon kind={'Ingress'} />,
  useData() {
    const [ingresses] = Ingress.useList({ namespace: useNamespaces() });
    const [services] = Service.useList({ namespace: useNamespaces() });
    const [secrets] = Secret.useList({ namespace: useNamespaces() });

    return useMemo(() => {
      if (!ingresses || !services || !secrets) return null;

      const edges: GraphEdge[] = [];

      ingresses.forEach(ingress => {
        ingress.spec.rules.forEach((rule: IngressRule) => {
          rule.http?.paths?.forEach(path => {
            const service = services.find(
              service => service.metadata.name === path?.backend?.service?.name
            );
            if (service) {
              edges.push(makeKubeToKubeEdge(service, ingress));
            }
          });
        });

        ingress.spec.tls?.forEach(tls => {
          if (tls.secretName) {
            const secret = secrets.find(secret => secret.metadata.name === tls.secretName);
            if (secret) {
              edges.push(makeKubeToKubeEdge(secret, ingress));
            }
          }
        });
      });

      return {
        edges,
        nodes: ingresses.map(makeKubeObjectNode) ?? [],
      };
    }, [ingresses, services, secrets]);
  },
};

const networkPoliciesSource: GraphSource = {
  id: 'networkPolicies',
  label: 'Network Policies',
  icon: <KubeIcon kind="NetworkPolicy" />,
  useData() {
    const [networkPolicies] = NetworkPolicy.useList({ namespace: useNamespaces() });
    const [pods] = Pod.useList({ namespace: useNamespaces() });

    return useMemo(() => {
      if (!networkPolicies || !pods) return null;

      const edges: GraphEdge[] = [];

      networkPolicies.forEach(np => {
        const matchingPods = pods.filter(matchesSelector(np.jsonData.spec.podSelector.matchLabels));

        matchingPods?.forEach(pod => {
          edges.push(makeKubeToKubeEdge(np, pod));
        });
      });

      return {
        nodes: networkPolicies.map(makeKubeObjectNode) ?? [],
        edges,
      };
    }, [networkPolicies, pods]);
  },
};

const ingressClassesSource: GraphSource = {
  id: 'ingressClasses',
  label: 'Ingress Classes',
  icon: <KubeIcon kind="Ingress" />,
  useData() {
    const [ingressClasses] = IngressClass.useList({ namespace: useNamespaces() });

    return useMemo(() => {
      return {
        nodes: ingressClasses?.map(makeKubeObjectNode) ?? [],
        edges: [],
      };
    }, [ingressClasses]);
  },
};

export const networkSource = {
  id: 'network',
  label: 'Network',
  icon: <Icon icon="mdi:lan" width="100%" height="100%" color={getKindGroupColor('network')} />,
  sources: [
    serviceSource,
    endpointsSource,
    ingressListSource,
    ingressClassesSource,
    networkPoliciesSource,
  ],
};
