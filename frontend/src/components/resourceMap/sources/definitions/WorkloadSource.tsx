/* eslint-disable no-unused-vars */
import { Icon } from '@iconify/react';
import { useMemo } from 'react';
import CronJob from '../../../../lib/k8s/cronJob';
import DaemonSet from '../../../../lib/k8s/daemonSet';
import Deployment from '../../../../lib/k8s/deployment';
import Job from '../../../../lib/k8s/job';
import Node from '../../../../lib/k8s/node';
import Pod from '../../../../lib/k8s/pod';
import ReplicaSet from '../../../../lib/k8s/replicaSet';
import Secret from '../../../../lib/k8s/secret';
import StatefulSet from '../../../../lib/k8s/statefulSet';
import { GraphEdge, GraphSource } from '../../graph/graphModel';
import { getKindGroupColor, KubeIcon } from '../../kubeIcon/KubeIcon';
import { kubeOwnersEdges, makeKubeObjectNode, makeKubeToKubeEdge } from '../GraphSources';

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
  icon: <KubeIcon kind="Pod" />,
  useData: () => {
    const { data: podsList } = Pod.useList();
    const { data: nodesList } = Node.useList();

    return useMemo(() => {
      if (!podsList || !nodesList) return null;

      const edges: GraphEdge[] = [];

      podsList?.items?.forEach(pod => {
        pod.metadata.ownerReferences?.forEach((owner: any) => {
          edges.push({
            id: `${owner.uid}-${pod.metadata.uid}`,
            type: 'kubeRelation',
            source: owner.uid,
            target: pod.metadata.uid,
          });
        });

        const node = nodesList?.items?.find(node => node.metadata.name === pod.spec.nodeName);

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
          podsList?.items?.map(pod => ({
            type: 'kubeObject',
            id: pod.metadata.uid,
            data: {
              resource: pod,
            },
          })) ?? [],
      };
    }, [podsList, nodesList]);
  },
};

const deploymentsSource: GraphSource = {
  id: 'deployments',
  label: 'Deployments',
  icon: <KubeIcon kind="Deployment" />,
  useData() {
    const { data: deploymentsList } = Deployment.useList();

    return useMemo(() => {
      if (!deploymentsList) return null;
      return {
        nodes: deploymentsList?.items?.map(makeKubeObjectNode) ?? [],
      };
    }, [deploymentsList]);
  },
};

const cronJobSource: GraphSource = {
  id: 'cronJobs',
  label: 'CronJobs',
  icon: <KubeIcon kind="CronJob" />,
  useData() {
    const { data: cronJobs } = CronJob.useList();

    return useMemo(() => {
      return {
        edges: [],
        nodes: cronJobs?.items?.map(it => makeKubeObjectNode(it)) ?? [],
      };
    }, [cronJobs]);
  },
};

const jobsSource: GraphSource = {
  id: 'jobs',
  label: 'Jobs',
  icon: <KubeIcon kind="Job" />,
  useData() {
    const { data: jobsList } = Job.useList();
    const { data: secretsList } = Secret.useList();

    return useMemo(() => {
      if (!jobsList || !secretsList) return null;

      const edges: GraphEdge[] = [];

      jobsList?.items?.forEach(job => {
        edges.push(...kubeOwnersEdges(job));

        job.spec.template.spec.containers.forEach((container: any) => {
          container.env?.forEach((env: any) => {
            if (env.valueFrom?.secretKeyRef) {
              const secret = secretsList?.items?.find(
                secret => secret.metadata.name === env.valueFrom.secretKeyRef!.name
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
          jobsList?.items?.map(job => ({
            type: 'kubeObject',
            id: job.metadata.uid,
            data: {
              resource: job,
            },
          })) ?? [],
      };
    }, [jobsList, secretsList]);
  },
};

const replicaSetsSource: GraphSource = {
  id: 'replicaSets',
  label: 'Replica Sets',
  icon: <KubeIcon kind="ReplicaSet" />,
  useData() {
    const { data: replicaSetsList } = ReplicaSet.useList();

    return useMemo(() => {
      if (!replicaSetsList) return null;

      const edges: GraphEdge[] = [];

      replicaSetsList?.items?.forEach(replicaSet => {
        edges.push(...kubeOwnersEdges(replicaSet));
      });

      return {
        edges,
        nodes: replicaSetsList?.items?.map(makeKubeObjectNode) ?? [],
      };
    }, [replicaSetsList]);
  },
};

const statefulSetSource: GraphSource = {
  id: 'statefulSets',
  label: 'Stateful Sets',
  icon: <KubeIcon kind="StatefulSet" />,
  useData() {
    const { data: statefulSetsList } = StatefulSet.useList();

    return useMemo(() => {
      return {
        nodes: statefulSetsList?.items?.map(makeKubeObjectNode) ?? [],
      };
    }, [statefulSetsList]);
  },
};

const daemonSetSource: GraphSource = {
  id: 'daemonSets',
  label: 'Daemon Sets',
  icon: <KubeIcon kind="DaemonSet" />,
  useData() {
    const { data: daemonSetsList } = DaemonSet.useList();

    return useMemo(() => {
      if (!daemonSetsList) return null;

      return {
        nodes: daemonSetsList?.items?.map(makeKubeObjectNode) ?? [],
      };
    }, [daemonSetsList]);
  },
};

export const WorkloadsSource: GraphSource = {
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
