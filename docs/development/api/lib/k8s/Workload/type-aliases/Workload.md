# Type Alias: Workload

```ts
type Workload: 
  | Pod
  | DaemonSet
  | ReplicaSet
  | StatefulSet
  | Job
  | CronJob
  | Deployment;
```

## Defined in

[frontend/src/lib/k8s/Workload.ts:9](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/Workload.ts#L9)
