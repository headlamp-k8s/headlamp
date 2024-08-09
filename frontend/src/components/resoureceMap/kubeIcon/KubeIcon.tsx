import { alpha, Box } from '@mui/material';
import CRoleIcon from './img/c-role.svg?react';
import CmIcon from './img/cm.svg?react';
import CrbIcon from './img/crb.svg?react';
import CrdIcon from './img/crd.svg?react';
import CronjobIcon from './img/cronjob.svg?react';
import DeployIcon from './img/deploy.svg?react';
import DsIcon from './img/ds.svg?react';
import EpIcon from './img/ep.svg?react';
import GroupIcon from './img/group.svg?react';
import HpaIcon from './img/hpa.svg?react';
import IngIcon from './img/ing.svg?react';
import JobIcon from './img/job.svg?react';
import LimitsIcon from './img/limits.svg?react';
import NetpolIcon from './img/netpol.svg?react';
import NsIcon from './img/ns.svg?react';
import PodIcon from './img/pod.svg?react';
import PspIcon from './img/psp.svg?react';
import PvIcon from './img/pv.svg?react';
import PvcIcon from './img/pvc.svg?react';
import QuotaIcon from './img/quota.svg?react';
import RbIcon from './img/rb.svg?react';
import RoleIcon from './img/role.svg?react';
import RsIcon from './img/rs.svg?react';
import SaIcon from './img/sa.svg?react';
import ScIcon from './img/sc.svg?react';
import SecretIcon from './img/secret.svg?react';
import StsIcon from './img/sts.svg?react';
import SvcIcon from './img/svc.svg?react';
import UserIcon from './img/user.svg?react';
import VolIcon from './img/vol.svg?react';

const kindToIcon: Record<string, any> = {
  ClusterRole: CRoleIcon,
  ClusterRoleBinding: CrbIcon,
  CronJob: CronjobIcon,
  DaemonSet: DsIcon,
  Group: GroupIcon,
  Ingress: IngIcon,
  LimitRange: LimitsIcon,
  Namespace: NsIcon,
  PodSecurityPolicy: PspIcon,
  PersistentVolumeClaim: PvcIcon,
  RoleBinding: RbIcon,
  ReplicaSet: RsIcon,
  StorageClass: ScIcon,
  StatefulSet: StsIcon,
  User: UserIcon,
  ConfigMap: CmIcon,
  CustomResourceDefinition: CrdIcon,
  Deployment: DeployIcon,
  Endpoint: EpIcon,
  HorizontalPodAutoscaler: HpaIcon,
  Job: JobIcon,
  NetworkPolicy: NetpolIcon,
  Pod: PodIcon,
  PersistentVolume: PvIcon,
  ResourceQuota: QuotaIcon,
  Role: RoleIcon,
  ServiceAccount: SaIcon,
  Secret: SecretIcon,
  Service: SvcIcon,
  Volume: VolIcon,
};

export function KubeIcon({
  kind,
  width,
  height,
  variant = 'green',
}: {
  kind: string;
  width?: string;
  height?: string;
  variant?: 'green' | 'yellow' | 'red';
}) {
  const IconComponent = kindToIcon[kind] ?? kindToIcon['Pod'];

  const color = {
    green: '#57A300',
    yellow: '#FFC107',
    red: '#DC3545',
  }[variant];

  return (
    <Box
      sx={{
        borderRadius: '50%',
        width: width ?? '100%',
        height: height ?? '100%',
        background: alpha(color, 0.21),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color,
        // 'path[id=path3055]': {
        //   fill: color + ' !important',
        // },
        'path[id=path3054-2-9]': {
          fill: 'none !important',
        },
      }}
    >
      <IconComponent width="65%" height="65%" />
    </Box>
  );
}
