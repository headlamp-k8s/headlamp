import { ReactNode } from 'react';
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

export interface GraphNode {
  type: string;
  id: string;
  data?: any;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label?: ReactNode;
  animated?: boolean;
}

export interface GraphGroup {
  id: string;
  // Data will be provided to the node renderer
  data: { label: string } & (
    | { collapsed: true; elements: number; errors: number }
    | { collapsed?: false }
  );
  nodes: GraphNode[];
  edges: GraphEdge[];
  children?: GraphGroup[];
}

/**
 * Graph source is a way to add nodes and edges to the graph.
 */
export type GraphSource = {
  id: string;
  label: string;
  isEnabledByDefault?: boolean;
} & (
  | {
      nodes?: ({ resources }: { resources: ClusterResources }) => GraphNode[];
      edges?: ({ resources }: { resources: ClusterResources }) => GraphEdge[];
    }
  | {
      sources: GraphSource[];
    }
);

export interface ClusterResources {
  networkPolicies: NetworkPolicy[];
  pods: Pod[];
  serviceAccounts: ServiceAccount[];
  secrets: Secret[];
  configMaps: ConfigMap[];
  pvcs: PersistentVolumeClaim[];
  services: Service[];
  replicaSets: ReplicaSet[];
  deployments: Deployment[];
  statefulSets: StatefulSet[];
  daemonSets: DaemonSet[];
  roleBindings: RoleBinding[];
  roles: Role[];
  jobs: Job[];
  ingressList: Ingress[];
  mutatingWebhookConfigurations: MutatingWebhookConfiguration[];
  validatingWebhookConfigurations: ValidatingWebhookConfiguration[];
  clusterRoles: ClusterRole[];
  clusterRoleBindings: ClusterRoleBinding[];
  nodes: Node[];
  namespaces: Namespace[];
}
