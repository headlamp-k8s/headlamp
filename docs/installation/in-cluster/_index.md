---
title: In-cluster Deployment
weight: 10
---

A common use-case for any Kubernetes web UI is to deploy it in-cluster and
set up an ingress server for having it available to users.

The easiest way to install headlamp in your existing cluster is to use our [helm chart](../../../charts/headlamp/).

```bash
# first add our custom repo to your local helm repositories
helm repo add headlamp https://headlamp-k8s.github.io/headlamp/

# now you should be able to install headlamp via helm
helm install my-headlamp headlamp/headlamp --namespace kube-system
```

As usual it is possible to configure the helm release via the [values file](../../../charts/headlamp/values.yaml) or setting your preferred values directly.

```bash
# install headlamp with your own values.yaml
helm install my-headlamp headlamp/headlamp --namespace kube-system -f values.yaml

# install headlamp by setting your values directly

helm install my-headlamp headlamp/headlamp --namespace kube-system --set replicaCount=2
```

We also maintain a simple/vanilla [file](https://github.com/kinvolk/headlamp/blob/main/kubernetes-headlamp.yaml)
for setting up a Headlamp deployment and service. Be sure to review it and change
anything you need.

If you're happy with the options in this deployment file, and assuming
you have a running Kubernetes cluster and your `kubeconfig` pointing to it,
you can run:

```bash
kubectl apply -f https://raw.githubusercontent.com/kinvolk/headlamp/main/kubernetes-headlamp.yaml
```

## Exposing Headlamp with an ingress server

With the instructions in the previous section, the Headlamp service should be
running, but you still need the
ingress server as mentioned. We provide an example sample ingress yaml file
for this purpose, but you have to manually replace the __URL__ placeholder
with the desired URL (the ingress file also assumes that you have contour
and a cert-manager set up, but if you don't then you'll just not have TLS).

Assuming your URL is `headlamp.mydeployment.io`, getting the sample ingress
file and changing the URL can quickly be done by:

```bash
curl -s https://raw.githubusercontent.com/kinvolk/headlamp/main/kubernetes-headlamp-ingress-sample.yaml | sed -e s/__URL__/headlamp.mydeployment.io/ > headlamp-ingress.yaml
```

and with that, you'll have a configured ingress file, so verify it and apply it:
```bash
kubectl apply -f ./headlamp-ingress.yaml
```

## Exposing Headlamp with port-forwarding

If you want to quickly access Headlamp (after having its service running) and
don't want to set up an ingress for it, you can run use port-forwarding as follows:

```bash
kubectl port-forward -n kube-system service/headlamp 8080:80
```

and then you can access `localhost:8080` in your browser.

## Accessing Headlamp

Once Headlamp is up and running, be sure to enable access to it either by creating
a [service account](../#create-a-service-account-token) or by setting up
[OIDC](./oidc).
