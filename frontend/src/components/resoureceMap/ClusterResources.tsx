import { useMemo } from 'react';
import ClusterRole from '../../lib/k8s/clusterRole';
import ClusterRoleBinding from '../../lib/k8s/clusterRoleBinding';
import ConfigMap from '../../lib/k8s/configMap';
import DaemonSet from '../../lib/k8s/daemonSet';
import Deployment from '../../lib/k8s/deployment';
import Ingress from '../../lib/k8s/ingress';
import Job from '../../lib/k8s/job';
import MutatingWebhookConfiguration from '../../lib/k8s/mutatingWebhookConfiguration';
import Namespace from '../../lib/k8s/namespace';
import NetworkPolicy from '../../lib/k8s/networkpolicy';
import Node from '../../lib/k8s/node';
import PersistentVolumeClaim from '../../lib/k8s/persistentVolumeClaim';
import Pod from '../../lib/k8s/pod';
import ReplicaSet from '../../lib/k8s/replicaSet';
import Role from '../../lib/k8s/role';
import RoleBinding from '../../lib/k8s/roleBinding';
import Secret from '../../lib/k8s/secret';
import Service from '../../lib/k8s/service';
import ServiceAccount from '../../lib/k8s/serviceAccount';
import StatefulSet from '../../lib/k8s/statefulSet';
import ValidatingWebhookConfiguration from '../../lib/k8s/validatingWebhookConfiguration';
import { ClusterResources } from './GraphModel';

export const useClusterResources = (namespace: string = '') => {
  const [nodes] = Node.useList();
  const [networkPolicies] = NetworkPolicy.useList({ namespace });
  const [pods] = Pod.useList({ namespace });
  const [serviceAccounts] = ServiceAccount.useList({ namespace });
  const [secrets] = Secret.useList({ namespace });
  const [configMaps] = ConfigMap.useList({ namespace });
  const [pvcs] = PersistentVolumeClaim.useList({ namespace });
  const [services] = Service.useList({ namespace });
  const [roleBindings] = RoleBinding.useList({ namespace });
  const [roles] = Role.useList({ namespace });
  const [jobs] = Job.useList({ namespace });
  const [ingressList] = Ingress.useList({ namespace });
  const [mutatingWebhookConfigurations] = MutatingWebhookConfiguration.useList({ namespace });
  const [validatingWebhookConfigurations] = ValidatingWebhookConfiguration.useList({ namespace });
  const [clusterRoles] = ClusterRole.useList({ namespace });
  const [clusterRoleBindings] = ClusterRoleBinding.useList({ namespace });
  const [deployments] = Deployment.useList({ namespace });
  const [statefulSets] = StatefulSet.useList({ namespace });
  const [replicaSets] = ReplicaSet.useList({ namespace });
  const [daemonSets] = DaemonSet.useList({ namespace });
  const [namespaces] = Namespace.useList();

  const resources: ClusterResources | undefined = useMemo(() => {
    if (
      !networkPolicies ||
      !pods ||
      !serviceAccounts ||
      !secrets ||
      !configMaps ||
      !pvcs ||
      !services ||
      !replicaSets ||
      !deployments ||
      !statefulSets ||
      !daemonSets ||
      !roleBindings ||
      !roles ||
      !jobs ||
      !ingressList ||
      !mutatingWebhookConfigurations ||
      !validatingWebhookConfigurations ||
      !clusterRoles ||
      !clusterRoleBindings ||
      !nodes ||
      !namespaces
    )
      return undefined;

    return {
      networkPolicies,
      pods,
      serviceAccounts,
      secrets,
      configMaps,
      pvcs,
      services,
      roleBindings,
      roles,
      jobs,
      ingressList,
      mutatingWebhookConfigurations,
      validatingWebhookConfigurations,
      clusterRoles,
      clusterRoleBindings,
      deployments,
      statefulSets,
      replicaSets,
      daemonSets,
      nodes,
      namespaces,
    };
  }, [
    networkPolicies,
    pods,
    serviceAccounts,
    secrets,
    configMaps,
    pvcs,
    services,
    roleBindings,
    roles,
    jobs,
    ingressList,
    mutatingWebhookConfigurations,
    validatingWebhookConfigurations,
    clusterRoles,
    clusterRoleBindings,
    deployments,
    statefulSets,
    replicaSets,
    daemonSets,
    namespace,
    nodes,
    namespaces,
  ]);

  return resources;
};
