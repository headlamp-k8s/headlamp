# Type Alias: WorkloadClass

```ts
type WorkloadClass: 
  | typeof Pod
  | typeof DaemonSet
  | typeof ReplicaSet
  | typeof StatefulSet
  | typeof Job
  | typeof CronJob
  | typeof Deployment;
```

## Defined in

[frontend/src/lib/k8s/Workload.ts:10](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/Workload.ts#L10)
