---
title: In-cluster Deployment
weight: 10
---

A common use-case for any Kubernetes web UI is to deploy it in-cluster and
set up an ingress server for having it available to users.

We maintain a simple/vanilla [file](https://github.com/kinvolk/headlamp/blob/master/kubernetes-headlamp.yaml)
for setting up a Headlamp deployment and service. Be sure to review it and change
anything you need.

If you're happy with the options in the this deployment file, and assuming
you have a running Kubernetes cluster and your `kubeconfig` pointing to it,
you can run:

```bash
kubectl apply -f https://raw.githubusercontent.com/kinvolk/headlamp/master/kubernetes-headlamp.yaml
```

With this, the Headlamp service should be running, but you still need the
ingress server as mentioned. We provide an example sample ingress yaml file
for this purpose, but you have to manually replace the __URL__ placeholder
with the desired URL (the ingress file also assumes that you have contour
and a cert-manager set up, but if you don't then you'll just not have TLS).

Assuming your URL is `headlamp.mydeployment.io`, getting the sample ingress
file and changing the URL can quickly be done by:

```bash
curl -s https://raw.githubusercontent.com/kinvolk/headlamp/jrocha/wip/delme/kubernetes-headlamp-ingress-sample.yaml | sed -e s/__URL__/headlamp.mydeployment.io/ > headlamp-ingress.yaml
```

and with that, you'll have a configured ingress file, so verify it and apply it:
```bash
kubectl apply -f ./headlamp-ingress.yaml
```
