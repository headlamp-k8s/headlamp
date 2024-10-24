import { Box } from '@mui/system';
import { memo } from 'react';
import { KubeObject } from '../../../lib/k8s/cluster';
import Deployment from '../../../lib/k8s/deployment';
import Job from '../../../lib/k8s/job';
import ReplicaSet from '../../../lib/k8s/replicaSet';
import ConfigDetails from '../../configmap/Details';
import CronJobDetails from '../../cronjob/Details';
import DaemonSetDetails from '../../daemonset/Details';
import EndpointDetails from '../../endpoints/Details';
import HpaDetails from '../../horizontalPodAutoscaler/Details';
import IngressClassDetails from '../../ingress/ClassDetails';
import IngressDetails from '../../ingress/Details';
import { LeaseDetails } from '../../lease/Details';
import { LimitRangeDetails } from '../../limitRange/Details';
import NamespaceDetails from '../../namespace/Details';
import { NetworkPolicyDetails } from '../../networkpolicy/Details';
import NodeDetails from '../../node/Details';
import PodDetails from '../../pod/Details';
import PDBDetails from '../../podDisruptionBudget/Details';
import PriorityClassDetails from '../../priorityClass/Details';
import ResourceQuotaDetails from '../../resourceQuota/Details';
import RoleBindingDetails from '../../role/BindingDetails';
import RoleDetails from '../../role/Details';
import { RuntimeClassDetails } from '../../runtimeClass/Details';
import SecretDetails from '../../secret/Details';
import ServiceDetails from '../../service/Details';
import ServiceAccountDetails from '../../serviceaccount/Details';
import StatefulSetDetails from '../../statefulset/Details';
import VolumeClaimDetails from '../../storage/ClaimDetails';
import StorageClassDetails from '../../storage/ClassDetails';
import VolumeDetails from '../../storage/VolumeDetails';
import VpaDetails from '../../verticalPodAutoscaler/Details';
import MutatingWebhookConfigList from '../../webhookconfiguration/MutatingWebhookConfigDetails';
import ValidatingWebhookConfigurationDetails from '../../webhookconfiguration/ValidatingWebhookConfigDetails';
import WorkloadDetails from '../../workload/Details';

/**
 * Shows details page for a given Kube resource
 */
export const KubeObjectDetails = memo(({ resource }: { resource: KubeObject }) => {
  const kind = resource.kind;
  const { name, namespace } = resource.metadata;

  return (
    <Box sx={{ overflow: 'hidden' }}>
      <Box sx={{ marginTop: '-70px' }}>
        {kind === 'Pod' && <PodDetails name={name} namespace={namespace} />}
        {kind === 'Deployment' && (
          <WorkloadDetails name={name} namespace={namespace} workloadKind={Deployment} />
        )}
        {kind === 'ReplicaSet' && (
          <WorkloadDetails name={name} namespace={namespace} workloadKind={ReplicaSet} />
        )}
        {kind === 'Job' && <WorkloadDetails name={name} namespace={namespace} workloadKind={Job} />}
        {kind === 'Service' && <ServiceDetails name={name} namespace={namespace} />}
        {kind === 'CronJob' && <CronJobDetails name={name} namespace={namespace} />}
        {kind === 'DaemonSet' && <DaemonSetDetails name={name} namespace={namespace} />}
        {kind === 'ConfigMap' && <ConfigDetails name={name} namespace={namespace} />}
        {kind === 'Endpoints' && <EndpointDetails name={name} namespace={namespace} />}
        {kind === 'HorizontalPodAutoscaler' && <HpaDetails name={name} namespace={namespace} />}
        {kind === 'Ingress' && <IngressDetails name={name} namespace={namespace} />}
        {kind === 'Lease' && <LeaseDetails name={name} namespace={namespace} />}
        {kind === 'LimitRange' && <LimitRangeDetails name={name} namespace={namespace} />}
        {kind === 'Namespace' && <NamespaceDetails name={name} />}
        {kind === 'NetworkPolicy' && <NetworkPolicyDetails name={name} namespace={namespace} />}
        {kind === 'Node' && <NodeDetails name={name} />}
        {kind === 'PodDisruptionBudget' && <PDBDetails name={name} namespace={namespace} />}
        {kind === 'PriorityClass' && <PriorityClassDetails name={name} />}
        {kind === 'ResourceQuota' && <ResourceQuotaDetails name={name} namespace={namespace} />}
        {kind === 'ClusterRole' && <RoleDetails name={name} />}
        {kind === 'Role' && <RoleDetails name={name} namespace={namespace} />}
        {kind === 'RoleBinding' && <RoleBindingDetails name={name} namespace={namespace} />}
        {kind === 'RuntimeClass' && <RuntimeClassDetails name={name} namespace={namespace} />}
        {kind === 'Secret' && <SecretDetails name={name} namespace={namespace} />}
        {kind === 'ServiceAccount' && <ServiceAccountDetails name={name} namespace={namespace} />}
        {kind === 'StatefulSet' && <StatefulSetDetails name={name} namespace={namespace} />}
        {kind === 'PersistentVolumeClaim' && (
          <VolumeClaimDetails name={name} namespace={namespace} />
        )}
        {kind === 'StorageClass' && <StorageClassDetails name={name} />}
        {kind === 'PersistentVolume' && <VolumeDetails name={name} />}
        {kind === 'VerticalPodAutoscaler' && <VpaDetails name={name} namespace={namespace} />}
        {kind === 'MutatingWebhookConfiguration' && <MutatingWebhookConfigList name={name} />}
        {kind === 'ValidatingWebhookConfiguration' && (
          <ValidatingWebhookConfigurationDetails name={name} />
        )}
        {kind === 'IngressClass' && <IngressClassDetails name={name} />}
      </Box>
    </Box>
  );
});
