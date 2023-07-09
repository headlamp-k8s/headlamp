---
title: Kubernetes Metrics Server
linkTitle: Metrics Server
---

Headlamp can show information for resources usage if the Metrics Server is
installed. If the Metrics Server is not installed, then a related notice is
displayed as shown in the following screenshot:

![screenshot for no-metrics-notice](./no-metrics-server.png)

To read more about metrics server check out the
[metrics-server documentation](https://kubernetes.io/docs/tasks/debug-application-cluster/resource-metrics-pipeline/#metrics-server).

## Minikube

If you are running Minikube, then you can install the Metrics Server by
enabling the
[respective add-on](https://kubernetes.io/docs/tutorials/hello-minikube/#enable-addons). i.e.:

```shell
minikube addons enable metrics-server
```

