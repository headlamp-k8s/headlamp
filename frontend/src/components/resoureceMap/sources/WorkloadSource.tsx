import { GraphEdge, GraphNode, GraphSource } from '../GraphModel';

export const matchesSelector = (matchLabels: any) => (item: any) => {
  return (
    matchLabels &&
    item.metadata.labels &&
    Object.entries(matchLabels).every(([key, value]) => item.metadata.labels[key] === value)
  );
};

const podsSource: GraphSource = {
  id: 'pods',
  label: 'Pods',
  nodes: ({ resources }) => {
    const nodes: GraphNode[] = [];

    resources.pods.forEach(pod => {
      nodes.push({
        type: 'kubeObject',
        id: pod.metadata.uid,
        data: {
          resource: pod,
        },
      });
    });

    return nodes;
  },
  edges: ({ resources }) => {
    const edges: GraphEdge[] = [];

    resources.pods.forEach(pod => {
      pod.metadata.ownerReferences?.forEach((owner: any) => {
        edges.push({
          id: `${owner.uid}-${pod.metadata.uid}`,
          source: owner.uid,
          target: pod.metadata.uid,
        });
      });
    });

    // find node it runs on
    resources.pods.forEach(pod => {
      const node = resources.nodes.find(node => node.metadata.name === pod.spec.nodeName);
      if (node) {
        edges.push({
          id: `${node.metadata.uid}-${pod.metadata.uid}`,
          source: node.metadata.uid,
          target: pod.metadata.uid,
        });
      }
    });

    return edges;
  },
};

const podContainersSource: GraphSource = {
  id: 'podContainers',
  label: 'Pod Containers',
  isEnabledByDefault: false,
  nodes: ({ resources }) => {
    const nodes: GraphNode[] = [];

    resources.pods.forEach(pod => {
      pod.spec.containers.forEach((container: any) => {
        nodes.push({
          type: 'container',
          id: `${pod.metadata.uid}-${container.name}`,
          data: {
            container,
            containerStatus: pod.status.containerStatuses?.find(
              status => status.name === container.name
            ),
          },
        });
      });
    });

    return nodes;
  },
  edges: ({ resources }) => {
    const edges: GraphEdge[] = [];

    resources.pods.forEach(pod => {
      pod.spec.containers.forEach((container: any) => {
        edges.push({
          id: `edge-${pod.metadata.uid}-${container.name}`,
          source: pod.metadata.uid,
          target: `${pod.metadata.uid}-${container.name}`,
        });
      });
    });

    return edges;
  },
};

const podInitContainersSource: GraphSource = {
  id: 'podInitContainers',
  label: 'Pod Init Containers',
  isEnabledByDefault: false,
  nodes: ({ resources }) => {
    const nodes: GraphNode[] = [];

    resources.pods.forEach(pod => {
      pod.spec.initContainers?.forEach((container: any) => {
        nodes.push({
          type: 'container',
          id: `${pod.metadata.uid}-${container.name}`,
          data: {
            container,
            containerStatus: pod.status.initContainerStatuses?.find(
              status => status.name === container.name
            ),
          },
        });
      });
    });

    return nodes;
  },
  edges: ({ resources }) => {
    const edges: GraphEdge[] = [];

    resources.pods.forEach(pod => {
      pod.spec.initContainers?.forEach((container: any) => {
        edges.push({
          id: `edge-${pod.metadata.uid}-${container.name}`,
          source: pod.metadata.uid,
          target: `${pod.metadata.uid}-${container.name}`,
        });
      });
    });

    return edges;
  },
};

const deploymentsSource: GraphSource = {
  id: 'deployments',
  label: 'Deployments',
  nodes: ({ resources }) =>
    resources.deployments.map(deployment => ({
      type: 'kubeObject',
      id: deployment.metadata.uid,
      data: {
        resource: deployment,
      },
    })),
};

const jobsSource: GraphSource = {
  id: 'jobs',
  label: 'Jobs',
  nodes: ({ resources }) =>
    resources.jobs.map(job => ({
      type: 'kubeObject',
      id: job.metadata.uid,
      data: {
        resource: job,
      },
    })),
  edges: ({ resources }) => {
    const edges: GraphEdge[] = [];

    // find used secrets
    resources.jobs.forEach(job => {
      job.spec.template.spec.containers.forEach((container: any) => {
        container.env?.forEach((env: any) => {
          if (env.valueFrom?.secretKeyRef) {
            const secret = resources.secrets.find(
              secret => secret.metadata.name === env.valueFrom.secretKeyRef!.name
            );
            if (secret) {
              if (
                edges.find(it => it.id === `${secret.metadata.uid}-${job.metadata.uid}`) ===
                undefined
              ) {
                edges.push({
                  id: `${secret.metadata.uid}-${job.metadata.uid}`,
                  source: secret.metadata.uid,
                  target: job.metadata.uid,
                });
              }
            }
          }
        });
      });
    });

    resources.jobs.forEach(job => {
      job.metadata.ownerReferences?.forEach((owner: any) => {
        edges.push({
          id: `${owner.uid}-${job.metadata.uid}`,
          source: owner.uid,
          target: job.metadata.uid,
        });
      });
    });

    return edges;
  },
};

const replicaSetsSource: GraphSource = {
  id: 'replicaSets',
  label: 'Replica Sets',
  nodes: ({ resources }) =>
    resources.replicaSets.map(replicaSet => ({
      type: 'kubeObject',
      id: replicaSet.metadata.uid,
      data: {
        resource: replicaSet,
      },
    })),
  edges: ({ resources }) => {
    const edges: GraphEdge[] = [];

    resources.replicaSets.forEach(replicaSet => {
      edges.push({
        id: `${replicaSet.metadata.uid}-${replicaSet.metadata.namespace}`,
        source: replicaSet.metadata.uid,
        target: replicaSet.metadata.ownerReferences[0].uid,
      });
    });

    return edges;
  },
};

const statefulSetSource: GraphSource = {
  id: 'statefulSets',
  label: 'Stateful Sets',
  nodes: ({ resources }) =>
    resources.statefulSets.map(statefulSet => ({
      type: 'kubeObject',
      id: statefulSet.metadata.uid,
      data: {
        resource: statefulSet,
      },
    })),
};

const daemonSetSource: GraphSource = {
  id: 'daemonSets',
  label: 'Daemon Sets',
  nodes: ({ resources }) =>
    resources.daemonSets.map(ds => ({
      type: 'kubeObject',
      id: ds.metadata.uid,
      data: {
        resource: ds,
      },
    })),
};

export const WorkloadsSource = {
  id: 'workloads',
  label: 'Workloads',
  sources: [
    podsSource,
    {
      id: 'podElements',
      label: 'Pod elements',
      sources: [podContainersSource, podInitContainersSource],
    },
    deploymentsSource,
    statefulSetSource,
    daemonSetSource,
    replicaSetsSource,
    jobsSource,
    // cronJobSource
  ],
};
