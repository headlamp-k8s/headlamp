---
title: Desktop App Installation
weight: 100
---

Headlamp can be run as a desktop application, for users who don't want to
deploy it in cluster, or those who want to manage unrelated clusters locally.

Currently there are desktop apps for [Linux](./linux-installation.md) and [Mac](./mac-installation.md). A Windows version is coming soon too.

Please check the following guides for the installation in your desired platform.

## Access using OIDC

OIDC has a feature makes more sense when
[running Headlamp in a cluster](../in-cluster.md) as it will allow cluster operators to just
give users a URL that they can use for logging in and access Headlamp.
However, if you have your kube config set to use OIDC for the authentication (because you already
authenticated and produced a kube config with that data), Headlamp will read those settings and
try to use them for offering the effortless login to the cluster.

Still, the kube config OIDC settings will not provide a OIDC callback URL, so make sure that your OIDC configuration for your cluster include Headlamp's OIDC callback in its redirect URIs. i.e. say you're using
Dex for the OIDC connection and you have it already configured in your
kube config, then be sure to add the `/oidc-callback` endpoint with Headlamp's the local address
to Dex's `staticClient.redirectURIs`: `http://localhost:6644/oidc-callback`.
