import CronJob from './cronJob';
import DaemonSet from './daemonSet';
import Deployment from './deployment';
import Job from './job';
import Pod from './pod';
import ReplicaSet from './replicaSet';
import StatefulSet from './statefulSet';

export type Workload = Pod | DaemonSet | ReplicaSet | StatefulSet | Job | CronJob | Deployment;
export type WorkloadClass =
  | typeof Pod
  | typeof DaemonSet
  | typeof ReplicaSet
  | typeof StatefulSet
  | typeof Job
  | typeof CronJob
  | typeof Deployment;
