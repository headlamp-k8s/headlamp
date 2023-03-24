---
title: Installation / Deployment
linktitle: Installation
weight: 2
---

Headlamp can be deployed in a Kubernetes [cluster](./in-cluster), or run as a [desktop](./desktop/) application.

Please check the guides in this section for [installing the desktop application](./desktop/)
or deploying Headlamp [in your cluster](./in-cluster/).

## Authentication / Log-in

Currently you can log in Headlamp by using a **client-certificate** (as you may have configured with e.g. minikube), or a **bearer token**.

Headlamp uses [RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac) for checking whether and how users can access resources. This means that the
recommended way to log in into Headlamp is to use a Service Account token.

### Create a Service Account token

As an example, you can create a service account for using Headlamp and retrieve its token to
authenticate:

1. Create a Service Account:

```shell
kubectl -n kube-system create serviceaccount headlamp-admin
```

2. Give admin rights to the account (check the
[RBAC docs](https://kubernetes.io/docs/reference/access-authn-authz/rbac) if you want to set more
restrictive permissions):

```shell
kubectl create clusterrolebinding headlamp-admin --serviceaccount=kube-system:headlamp-admin --clusterrole=cluster-admin
```

3. If you are running Headlamp in a Kubernetes cluster with version greater than 1.24, create the token using the following command:

```shell
kubectl create token headlamp-admin -n kube-system
```

Otherwise, run the following command to get the token associated with the service account:

```shell
export HEADLAMP_SECRET=$(kubectl get secrets --namespace kube-system -o custom-columns=":metadata.name" | grep "headlamp-admin-token")
kubectl get secret $HEADLAMP_SECRET --namespace kube-system --template=\{\{.data.token\}\} | base64 --decode
```

Once you have the Service Account token, paste it when prompted by Headlamp.

### Use OIDC

For OpenIDConnect, please see the [in-cluster installation](./in-cluster/oidc.md#accessing-using-oidc) docs.
