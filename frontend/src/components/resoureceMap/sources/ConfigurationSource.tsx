import { GraphEdge, GraphSource } from '../GraphModel';

const secretsSource: GraphSource = {
  id: 'secrets',
  label: 'Secrets',
  nodes: ({ resources }) =>
    resources.secrets.map(secret => ({
      type: 'kubeObject',
      id: secret.metadata.uid,
      data: {
        resource: secret,
      },
    })),
  edges: ({ resources }) => {
    const edges: GraphEdge[] = [];

    // find used secrets
    resources.pods.forEach(pod => {
      // container env
      pod.spec.containers.forEach((container: any) => {
        container.env?.forEach((env: any) => {
          if (env.valueFrom?.secretKeyRef) {
            const secret = resources.secrets.find(
              secret => secret.metadata.name === env.valueFrom.secretKeyRef!.name
            );
            if (secret) {
              if (
                edges.find(it => it.id === `${secret.metadata.uid}-${pod.metadata.uid}`) ===
                undefined
              ) {
                edges.push({
                  id: `${secret.metadata.uid}-${pod.metadata.uid}`,
                  source: secret.metadata.uid,
                  target: pod.metadata.uid,
                });
              }
            }
          }
        });
      });

      // volumes projected sources
      pod.spec.volumes?.forEach((volume: any) => {
        if (volume.projected) {
          volume.projected.sources.forEach((source: any) => {
            if (source.secret) {
              const secret = resources.secrets.find(
                secret => secret.metadata.name === source.secret!.name
              );
              if (secret) {
                edges.push({
                  id: `${secret.metadata.uid}-${pod.metadata.uid}`,
                  source: secret.metadata.uid,
                  target: pod.metadata.uid,
                });
              }
            }
          });
        }
      });
    });

    return edges;
  },
};

const configMapsSource: GraphSource = {
  id: 'configMaps',
  label: 'Config Maps',
  nodes: ({ resources }) =>
    resources.configMaps.map(cm => ({
      type: 'kubeObject',
      id: cm.metadata.uid,
      data: {
        resource: cm,
      },
    })),
  edges: ({ resources }) => {
    const edges: GraphEdge[] = [];

    // find used configmaps
    resources.pods.forEach(pod => {
      pod.spec.volumes?.forEach((volume: any) => {
        if (volume.configMap) {
          const cm = resources.configMaps.find(cm => cm.metadata.name === volume.configMap!.name);
          if (cm) {
            edges.push({
              id: `${cm.metadata.uid}-${pod.metadata.uid}`,
              source: cm.metadata.uid,
              target: pod.metadata.uid,
            });
          }
        }
      });
    });

    // in jobs
    resources.jobs.forEach(job => {
      job.spec.template.spec.volumes?.forEach((volume: any) => {
        if (volume.configMap) {
          const cm = resources.configMaps.find(cm => cm.metadata.name === volume.configMap!.name);
          if (cm) {
            edges.push({
              id: `${cm.metadata.uid}-${job.metadata.uid}`,
              source: cm.metadata.uid,
              target: job.metadata.uid,
            });
          }
        }
      });
    });

    return edges;
  },
};

const validatingWebhookConfigurationSource: GraphSource = {
  id: 'validatingWebhookConfigurations',
  label: 'Validating Webhook Configurations',
  nodes: ({ resources }) =>
    resources.validatingWebhookConfigurations.map(vwc => ({
      type: 'kubeObject',
      id: vwc.metadata.uid,
      data: {
        resource: vwc,
      },
    })),
  edges: ({ resources }) => {
    const edges: GraphEdge[] = [];

    resources.validatingWebhookConfigurations.forEach(vwc => {
      vwc.webhooks.forEach((webhook: any) => {
        const service = resources.services.find(
          service => service.metadata.name === webhook.clientConfig.service?.name
        );
        if (service) {
          edges.push({
            id: `${service.metadata.uid}-${vwc.metadata.uid}`,
            source: service.metadata.uid,
            target: vwc.metadata.uid,
          });
        }
      });
    });

    return edges;
  },
};

const mutatingWebhookConfigurationSource: GraphSource = {
  id: 'mutatingWebhookConfigurations',
  label: 'Mutating Webhook Configurations',
  nodes: ({ resources }) =>
    resources.mutatingWebhookConfigurations.map(mwc => ({
      type: 'kubeObject',
      id: mwc.metadata.uid,
      data: {
        resource: mwc,
      },
    })),
  edges: ({ resources }) => {
    const edges: GraphEdge[] = [];

    resources.mutatingWebhookConfigurations.forEach(mwc => {
      mwc.webhooks.forEach((webhook: any) => {
        const service = resources.services.find(
          service => service.metadata.name === webhook.clientConfig.service?.name
        );
        if (service) {
          edges.push({
            id: `${service.metadata.uid}-${mwc.metadata.uid}`,
            source: service.metadata.uid,
            target: mwc.metadata.uid,
          });
        }
      });
    });

    return edges;
  },
};

export const ConfigurationSource: GraphSource = {
  id: 'configuration',
  label: 'Configuration',
  sources: [
    configMapsSource,
    // secretsSource,
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
