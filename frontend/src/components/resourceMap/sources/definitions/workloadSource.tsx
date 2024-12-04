import { Icon } from '@iconify/react';
import { useMemo } from 'react';
import CronJob from '../../../../lib/k8s/cronJob';
import DaemonSet from '../../../../lib/k8s/daemonSet';
import Deployment from '../../../../lib/k8s/deployment';
import Job from '../../../../lib/k8s/job';
import { KubeObject } from '../../../../lib/k8s/KubeObject';
import Node from '../../../../lib/k8s/node';
import Pod from '../../../../lib/k8s/pod';
import ReplicaSet from '../../../../lib/k8s/replicaSet';
import Secret from '../../../../lib/k8s/secret';
import StatefulSet from '../../../../lib/k8s/statefulSet';
import { useNamespaces } from '../../../../redux/filterSlice';
import { GraphEdge, GraphSource } from '../../graph/graphModel';
import { getKindGroupColor, KubeIcon } from '../../kubeIcon/KubeIcon';
import { kubeOwnersEdges, makeKubeObjectNode, makeKubeToKubeEdge } from '../GraphSources';

export const matchesSelector = (matchLabels: Record<string, string>) => (item: KubeObject) => {
  return (
    matchLabels &&
    item.metadata.labels &&
    Object.entries(matchLabels).every(([key, value]) => item.metadata?.labels?.[key] === value)
  );
};

const podsSource: GraphSource = {
  id: 'pods',
  label: 'Pods',
  icon: <KubeIcon kind="Pod" />,
  useData: () => {
    const [pods] = Pod.useList({ namespace: useNamespaces() });
    const [nodes] = Node.useList({ namespace: useNamespaces() });

    return useMemo(() => {
      if (!pods || !nodes) return null;

      const edges: GraphEdge[] = [];

      pods.forEach(pod => {
        pod.metadata.ownerReferences?.forEach(owner => {
          edges.push({
            id: `${owner.uid}-${pod.metadata.uid}`,
            type: 'kubeRelation',
            source: owner.uid,
            target: pod.metadata.uid,
          });
        });

        const node = nodes.find(node => node.metadata.name === pod.spec.nodeName);

        if (node) {
          edges.push({
            id: `${node.metadata.uid}-${pod.metadata.uid}`,
            type: 'kubeRelation',
            source: node.metadata.uid,
            target: pod.metadata.uid,
          });
        }
      });

      return {
        edges,
        nodes:
          pods.map(pod => ({
            type: 'kubeObject',
            id: pod.metadata.uid,
            data: {
              resource: pod,
            },
          })) ?? [],
      };
    }, [pods, nodes]);
  },
};

const deploymentsSource: GraphSource = {
  id: 'deployments',
  label: 'Deployments',
  icon: <KubeIcon kind="Deployment" />,
  useData() {
    const [deployments] = Deployment.useList({ namespace: useNamespaces() });

    return useMemo(() => {
      if (!deployments) return null;
      return {
        nodes: deployments?.map(makeKubeObjectNode) ?? [],
      };
    }, [deployments]);
  },
};

const cronJobSource: GraphSource = {
  id: 'cronJobs',
  label: 'CronJobs',
  icon: <KubeIcon kind="CronJob" />,
  useData() {
    const [cronJobs] = CronJob.useList({ namespace: useNamespaces() });

    return useMemo(() => {
      if (!cronJobs) return null;
      return {
        edges: [],
        nodes: cronJobs?.map(it => makeKubeObjectNode(it)) ?? [],
      };
    }, [cronJobs]);
  },
};

const jobsSource: GraphSource = {
  id: 'jobs',
  label: 'Jobs',
  icon: <KubeIcon kind="Job" />,
  useData() {
    const [jobs] = Job.useList({ namespace: useNamespaces() });
    const [secrets] = Secret.useList({ namespace: useNamespaces() });

    return useMemo(() => {
      if (!jobs || !secrets) return null;

      const edges: GraphEdge[] = [];

      jobs?.forEach(job => {
        edges.push(...kubeOwnersEdges(job));

        job.spec.template.spec.containers.forEach(container => {
          container.env?.forEach(env => {
            if (env.valueFrom?.secretKeyRef) {
              const secret = secrets?.find(
                secret => secret.metadata.name === env.valueFrom?.secretKeyRef?.name
              );
              if (
                secret &&
                edges.find(it => it.id === `${secret.metadata.uid}-${job.metadata.uid}`) ===
                  undefined
              ) {
                edges.push(makeKubeToKubeEdge(secret, job));
              }
            }
          });
        });
      });

      return {
        edges,
        nodes:
          jobs?.map(job => ({
            type: 'kubeObject',
            id: job.metadata.uid,
            data: {
              resource: job,
            },
          })) ?? [],
      };
    }, [jobs, secrets]);
  },
};

const replicaSetsSource: GraphSource = {
  id: 'replicaSets',
  label: 'Replica Sets',
  icon: <KubeIcon kind="ReplicaSet" />,
  useData() {
    const [replicaSets] = ReplicaSet.useList({ namespace: useNamespaces() });

    return useMemo(() => {
      if (!replicaSets) return null;

      const edges: GraphEdge[] = [];

      replicaSets?.forEach(replicaSet => {
        edges.push(...kubeOwnersEdges(replicaSet));
      });

      return {
        edges,
        nodes: replicaSets?.map(makeKubeObjectNode) ?? [],
      };
    }, [replicaSets]);
  },
};

const statefulSetSource: GraphSource = {
  id: 'statefulSets',
  label: 'Stateful Sets',
  icon: <KubeIcon kind="StatefulSet" />,
  useData() {
    const [statefulSets] = StatefulSet.useList({ namespace: useNamespaces() });

    return useMemo(() => {
      if (!statefulSets) return null;
      return {
        nodes: statefulSets?.map(makeKubeObjectNode) ?? [],
      };
    }, [statefulSets]);
  },
};

const daemonSetSource: GraphSource = {
  id: 'daemonSets',
  label: 'Daemon Sets',
  icon: <KubeIcon kind="DaemonSet" />,
  useData() {
    const [daemonSets] = DaemonSet.useList({ namespace: useNamespaces() });

    return useMemo(() => {
      if (!daemonSets) return null;

      return {
        nodes: daemonSets?.map(makeKubeObjectNode) ?? [],
      };
    }, [daemonSets]);
  },
};

export const workloadsSource: GraphSource = {
  id: 'workloads',
  label: 'Workloads',
  icon: (
    <Icon
      icon="mdi:circle-slice-2"
      width="100%"
      height="100%"
      color={getKindGroupColor('workloads')}
    />
  ),
  sources: [
    podsSource,
    deploymentsSource,
    statefulSetSource,
    daemonSetSource,
    replicaSetsSource,
    jobsSource,
    cronJobSource,
  ],
};
