import { Icon } from '@iconify/react';
import { useMemo } from 'react';
import ConfigMap from '../../../../lib/k8s/configMap';
import Job from '../../../../lib/k8s/job';
import MutatingWebhookConfiguration from '../../../../lib/k8s/mutatingWebhookConfiguration';
import Pod from '../../../../lib/k8s/pod';
import Secret from '../../../../lib/k8s/secret';
import Service from '../../../../lib/k8s/service';
import ValidatingWebhookConfiguration from '../../../../lib/k8s/validatingWebhookConfiguration';
import { GraphEdge, GraphSource } from '../../graph/graphModel';
import { getKindGroupColor, KubeIcon } from '../../kubeIcon/KubeIcon';
import { makeKubeObjectNode, makeKubeToKubeEdge } from '../GraphSources';

const secretsSource: GraphSource = {
  id: 'secrets',
  label: 'Secrets',
  icon: <KubeIcon kind="Secret" />,
  isEnabledByDefault: false,
  useData() {
    const [secrets] = Secret.useList();

    const [pods] = Pod.useList();

    return useMemo(() => {
      if (!secrets || !pods) return null;

      const edges: GraphEdge[] = [];

      // find used secrets
      pods.forEach(pod => {
        // container env
        pod.spec.containers.forEach(container => {
          container.env?.forEach(env => {
            if (env.valueFrom?.secretKeyRef) {
              const secret = secrets.find(
                secret => secret.metadata.name === env.valueFrom?.secretKeyRef?.name
              );
              if (secret) {
                if (
                  edges.find(it => it.id === `${secret.metadata.uid}-${pod.metadata.uid}`) ===
                  undefined
                ) {
                  edges.push(makeKubeToKubeEdge(secret, pod));
                }
              }
            }
          });
        });

        // volumes projected sources
        pod.spec.volumes?.forEach(volume => {
          if (volume.projected) {
            volume.projected.sources.forEach((source: any) => {
              if (source.secret) {
                const secret = secrets.find(secret => secret.metadata.name === source.secret!.name);
                if (secret) {
                  edges.push(makeKubeToKubeEdge(secret, pod));
                }
              }
            });
          }
        });
      });

      return {
        nodes: secrets.map(makeKubeObjectNode) ?? [],
        edges,
      };
    }, [pods, secrets]);
  },
};

const configMapsSource: GraphSource = {
  id: 'configMaps',
  label: 'Config Maps',
  isEnabledByDefault: false,
  icon: <KubeIcon kind="ConfigMap" />,
  useData() {
    const [configMaps] = ConfigMap.useList();
    const [pods] = Pod.useList();
    const [jobs] = Job.useList();

    return useMemo(() => {
      if (!configMaps || !pods || !jobs) return null;

      const edges: GraphEdge[] = [];

      // find used configmaps
      pods.forEach(pod => {
        pod.spec.volumes?.forEach(volume => {
          if (volume.configMap) {
            const cm = configMaps.find(cm => cm.metadata.name === volume.configMap!.name);
            if (cm) {
              edges.push(makeKubeToKubeEdge(cm, pod));
            }
          }
        });
      });

      // in jobs
      jobs.forEach(job => {
        job.spec.template.spec.volumes?.forEach(volume => {
          if (volume.configMap) {
            const cm = configMaps.find(cm => cm.metadata.name === volume.configMap!.name);
            if (cm) {
              edges.push(makeKubeToKubeEdge(cm, job));
            }
          }
        });
      });

      return {
        nodes: configMaps.map(makeKubeObjectNode) ?? [],
        edges,
      };
    }, [configMaps, pods, jobs]);
  },
};

const validatingWebhookConfigurationSource: GraphSource = {
  id: 'validatingWebhookConfigurations',
  label: 'Validating Webhook Configurations',
  icon: <KubeIcon kind="ConfigMap" />,
  isEnabledByDefault: false,
  useData() {
    const [vwc] = ValidatingWebhookConfiguration.useList();
    const [services] = Service.useList();

    return useMemo(() => {
      if (!vwc || !services) return null;

      const nodes = vwc.map(makeKubeObjectNode) ?? [];

      const edges: GraphEdge[] = [];

      vwc.forEach(vwc => {
        vwc.webhooks.forEach(webhook => {
          const service = services.find(
            service => service.metadata.name === webhook.clientConfig.service?.name
          );
          if (service) {
            edges.push(makeKubeToKubeEdge(service, vwc));
          }
        });
      });

      return { nodes, edges };
    }, [vwc, services]);
  },
};

const mutatingWebhookConfigurationSource: GraphSource = {
  id: 'mutatingWebhookConfigurations',
  label: 'Mutating Webhook Configurations',
  icon: <KubeIcon kind="ConfigMap" />,
  isEnabledByDefault: false,
  useData() {
    const [mwc] = MutatingWebhookConfiguration.useList();
    const [services] = Service.useList();

    return useMemo(() => {
      if (!mwc || !services) return null;

      const edges: GraphEdge[] = [];

      mwc.forEach(mwc => {
        mwc.webhooks.forEach(webhook => {
          const service = services.find(
            service => service.metadata.name === webhook.clientConfig.service?.name
          );
          if (service) {
            edges.push(makeKubeToKubeEdge(service, mwc));
          }
        });
      });

      return { nodes: mwc.map(makeKubeObjectNode) ?? [], edges };
    }, [mwc, services]);
  },
};

export const configurationSource: GraphSource = {
  id: 'configuration',
  label: 'Configuration',
  icon: (
    <Icon
      icon="mdi:format-list-checks"
      width="100%"
      height="100%"
      color={getKindGroupColor('configuration')}
    />
  ),
  sources: [
    configMapsSource,
    secretsSource,
    // TODO: Implement the rest of resources
    // hpa
    // vpa
    // pdb
    // rq
    // lr
    // priorityClass
    // runtimeClass
    // leases
    mutatingWebhookConfigurationSource,
    validatingWebhookConfigurationSource,
  ],
};
