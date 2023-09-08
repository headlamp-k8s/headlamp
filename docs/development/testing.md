---
title: Testing
weight: 5
---

## Load testing Headlamp

Can Headlamp work well with a busy cluster?

Limits we want to test for to begin with:
- 10,000 pods
- 1,000 nodes
- 10,000 events

Steps:
- Create load in a cluster
- Run Headlamp and see if it works well


### Kwok for low resource usage load testing of Headlamp

> [KWOK](https://github.com/kubernetes-sigs/kwok) is a toolkit that enables setting up a cluster of thousands of Nodes in seconds. Under the scene, all Nodes are simulated to behave like real ones, so the overall approach employs a pretty low resource footprint that you can easily play around on your laptop.

- [KWOK installation](https://kwok.sigs.k8s.io/docs/user/installation/)


### Creating lots of Kubernetes activity

Maybe you need to delete a cluster and create a fresh one.
```bash
kwokctl delete cluster
kwokctl create cluster
```

Make sure your kubectl context is set to 'kwok-kwok'.

```bash
kubectl config get-contexts
```

#### Generating Initial Data

This will create 900 nodes, 9000 pods, and 1000 events as fast as possible. Then it will create 1 event per second up to a total of 9000 events. Also one per second: 100 new nodes, and 1000 new pods.

```bash
cd load-testing
npm install

echo "Creating initial activity: 900 nodes, 9000 pods, and 1000 events"
node scripts/create-nodes.js 900 0
node scripts/create-pods.js 9000 0
node scripts/create-events.js 1000 0
```

#### Generating Activity

To make some activity after the initial data is loaded.

```bash
echo "---------------"
echo "creating 1 node, 1 pod, and 1 event per second"
node scripts/create-events.js 9000 1 & node scripts/create-nodes.js 100 1 & node scripts/create-pods.js 1000 1 &
```
