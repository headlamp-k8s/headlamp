import { Icon } from '@iconify/react';
import { useMemo } from 'react';
import Endpoints from '../../../../lib/k8s/endpoints';
import Ingress from '../../../../lib/k8s/ingress';
import IngressClass from '../../../../lib/k8s/ingressClass';
import NetworkPolicy from '../../../../lib/k8s/networkpolicy';
import Pod from '../../../../lib/k8s/pod';
import Secret from '../../../../lib/k8s/secret';
import Service from '../../../../lib/k8s/service';
import { GraphEdge, GraphSource } from '../../graph/graphModel';
import { getKindGroupColor, KubeIcon } from '../../kubeIcon/KubeIcon';
import { makeKubeObjectNode, makeKubeToKubeEdge } from '../GraphSources';
import { matchesSelector } from './WorkloadSource';

const serviceSource: GraphSource = {
  id: 'services',
  label: 'Services',
  icon: <KubeIcon kind={'Service'} />,
  useData() {
    const { data: serviceList } = Service.useList();
    const { data: podList } = Pod.useList();

    return useMemo(() => {
      const edges: GraphEdge[] = [];

      serviceList?.items?.forEach(service => {
        const matchingPods = podList?.items?.filter(matchesSelector(service.spec.selector));

        matchingPods?.forEach(pod => {
          edges.push(makeKubeToKubeEdge(service, pod));
        });
      });

      return {
        edges,
        nodes: serviceList?.items?.map(makeKubeObjectNode) ?? [],
      };
    }, [serviceList, podList]);
  },
};

const endpointsSource: GraphSource = {
  id: 'endpoints',
  label: 'Endpoints',
  icon: <KubeIcon kind="Endpoint" />,
  useData() {
    const [endpoints] = Endpoints.useList();
    const [services] = Service.useList();

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
    const { data: ingressList } = Ingress.useList();
    const { data: serviceList } = Service.useList();
    const { data: secretList } = Secret.useList();

    return useMemo(() => {
      const edges: GraphEdge[] = [];

      ingressList?.items?.forEach(ingress => {
        ingress.spec.rules.forEach((rule: any) => {
          rule.http.paths.forEach((path: any) => {
            const service = serviceList?.items?.find(
              service => service.metadata.name === path?.backend?.service?.name
            );
            if (service) {
              edges.push(makeKubeToKubeEdge(service, ingress));
            }
          });
        });

        ingress.spec.tls?.forEach((tls: any) => {
          if (tls.secretName) {
            const secret = secretList?.items?.find(
              secret => secret.metadata.name === tls.secretName
            );
            if (secret) {
              edges.push(makeKubeToKubeEdge(secret, ingress));
            }
          }
        });
      });

      return {
        edges,
        nodes: ingressList?.items?.map(makeKubeObjectNode) ?? [],
      };
    }, [ingressList, serviceList, secretList]);
  },
};

const networkPoliciesSource: GraphSource = {
  id: 'networkPolicies',
  label: 'Network Policies',
  icon: <KubeIcon kind="NetworkPolicy" />,
  useData() {
    const { data: networkPolicies } = NetworkPolicy.useList();
    const { data: pods } = Pod.useList();

    return useMemo(() => {
      const edges: GraphEdge[] = [];

      networkPolicies?.items?.forEach(np => {
        const matchingPods = pods?.items?.filter(
          matchesSelector(np.jsonData.spec.podSelector.matchLabels)
        );

        matchingPods?.forEach(pod => {
          edges.push(makeKubeToKubeEdge(np, pod));
        });
      });

      return {
        nodes: networkPolicies?.items?.map(makeKubeObjectNode) ?? [],
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
    const [ingressClasses] = IngressClass.useList();

    return useMemo(() => {
      return {
        nodes: ingressClasses?.map(makeKubeObjectNode) ?? [],
        edges: [],
      };
    }, [ingressClasses]);
  },
};

export const NetworkSource = {
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
