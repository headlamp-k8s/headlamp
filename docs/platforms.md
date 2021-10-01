---
title: Tested Kubernetes Platforms
linkTitle: Platforms
weight: 300
---

This section shows the different platforms where Headlamp has been tested (in-cluster) or is intended to be tested, and useful observations about it.
If you have tested Headlamp on a different flavor or Kubernetes, please file a PR or [issue](https://github.com/kinvolk/headlamp/issues/new/choose) to add your remarks to the list.

The "works" column refers to the overall Kubernetes related functionality when running in the respective platform; it may have 3 different values:
- ✔️ : Has been tried and works fine to the extent of what has been tested
- ❌ : Has been tried and didn't work or had issues that prevented a regular use of it
- ❔: Hasn't been tried/reported yet

Platform<div style="min-width: 300px"></div>    | Works | Comments
----------------------------------------------|:-----:|------------------------------------------------------------------------------------------
[Amazon EKS](https://aws.amazon.com/eks/)                     |  ✔️     | - As [reported](https://github.com/kinvolk/headlamp/issues/266)
[DigitalOcean Kubernetes](https://www.digitalocean.com/products/kubernetes/)        | ❔    | - Have you tried Headlamp on this platform? Please report your experience.
[Google Kubernetes Engine (GKE)](https://cloud.google.com/kubernetes-engine) | ❔    | - Have you tried Headlamp on this platform? Please report your experience.
[K3s](https://k3s.io/)                                         | ✔️     | - Simple to install / expose with the regular [in-cluster instructions](https://kinvolk.io/docs/headlamp/latest/installation/in-cluster/).
[Kind](https://kind.sigs.k8s.io/)                              | ✔️     | - Simple to install / expose with the regular [in-cluster instructions](https://kinvolk.io/docs/headlamp/latest/installation/in-cluster/).
[Lokomotive](https://kinvolk.io/lokomotive-kubernetes/)                     | ✔️     | - Works with the regular in-cluster instructions <br> - There's also the [Lokomotive Web UI](https://kinvolk.io/docs/lokomotive/latest/configuration-reference/components/web-ui/) as a component, which is
[Microsoft AKS](https://azure.microsoft.com/)                  | ✔️     | Testing (not suitable for production):<br/>- Deploy Headlamp from the [in-cluster instructions](https://kinvolk.io/docs/headlamp/latest/installation/in-cluster/)<br/>- [Enable the http_application_routing addon](https://docs.microsoft.com/en-us/azure/aks/http-application-routing#use-http-routing) (this creates a DNS zone)<br/>- Use the DNS zone name as the domain for Headlamp, i.e. if it is `1234567.eastus.aksapp.io`, then apply [Headlamp's ingress](https://raw.githubusercontent.com/kinvolk/headlamp/main/kubernetes-headlamp-ingress-sample.yaml) using `headlamp.1234567.eastus.aksapp.io` as the path and use ``kubernetes.io/ingress.class: addon-http-application-routing`` as the ingress class annotation.<br/><br/>For production, please follow the [intructions to deploy with an HTTPS ingress controller](https://docs.microsoft.com/en-us/azure/aks/ingress-tls).
[Minikube](https://minikube.sigs.k8s.io/)                     | ✔️     | - For exposing with an ingress, enable ingresses with `minikube addons enable ingress` <br> - There are docs about the [development](../development/) with Minikube.|
[Vultr Kubernetes Engine](https://www.vultr.com/kubernetes/)                     |  ✔️     |  - Simple to install / expose with the regular [in-cluster instructions](https://kinvolk.io/docs/headlamp/latest/installation/in-cluster/).

