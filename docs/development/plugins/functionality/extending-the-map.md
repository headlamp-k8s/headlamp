---
title: Extending the Map
sidebar_label: Extending the Map
---

Map view displays cluster resource on a graph. Plugins can extend this graph by adding nodes and edges.

## Nodes, edges and sources

**Node** represents a Kubernetes resource. **Edges** connect different **nodes**, for example ReplicaSet connects to Pods it owns.

<figure>

![Screenshot of a Map with one ReplicaSet node connected to three Pods it owns](./images/map-rs-and-pods.png)

<figcaption>1 ReplicaSet and 3 Pods it owns</figcaption>
</figure>

To add your own nodes and edges you need to define a **Source**

A graph **Source** represents a collection of Nodes and Edges along with name and icon. Source may contain other Sources.

<figure style="text-align: center">

![Screenshot of a Source picker containing various Kubernetes resource sources](./images/source-picker-workloads.png)

<figcaption>Example: "Pods" is a source that contains Nodes for all the Pods in the cluster, "Workloads" is also a source containing other Sources.</figcaption>
</figure>

## Creating and registering a Source

To define a Source create an object with the following structure:

```tsx
const mySource = {
  id: "my-source", // ID of the source should be unique
  label: "My Source", // label will be displayed in source picker
  // you can provide an icon
  icon: (
    <img
      src="https://headlamp.dev/img/favicon.png"
      alt="My Source logo"
      style={{ width: "100%", height: "100%" }}
    />
  ),
  /**
   * useData is a hook that will be called to load nodes and edges for your source
   * You can use hooks here that Headlamp provides to load Kubernetes resources
   * this hook should return an object with nodes and edges or `null` if it's loading
   * it's important that return object is not recreated every time, so useMemo is required
   */
  useData() {
    return useMemo(() => {
      // This would come from kubernetes API but it's hardcoded here as an example
      const myResource = {
        kind: "MyResourceKind",
        metadata: {
          uid: "1234",
          name: "my-test-resource",
          namespace: "test-namespace",
          creationTimestamp: "1234",
        },
      };

      const edges = []; // no edges in this source
      const nodes = [
        {
          id: "1234", // ID should be unique
          type: "kubeObject", // 'kubeObject' type represnets a kubernetes resource
          data: {
            // resource field is required and should contain KubeObject
            resource: new KubeObject(myResource),
          },
        },
      ];

      return { edges, nodes };
    }, []);
  },
};
```

Then to register it call `registerMapSource`

```tsx
registerMapSource(mySource);
```

You'll now see it in the Source picker and the Node on the Map:

<figure style="text-align: center">

![Screenshot of a source picker](./images/source-picker.png)

<figcaption>"My Source" is listed on the bottom. Enabled by default.</figcaption>
</figure>

<figure style="text-align: center">

![Screenshot of a node with a default icon](./images/node-without-an-icon.png)

<figcaption>MyCustomResource Node displayed with default Icon</figcaption>
</figure>

## Node Icons

To add an icon to the Node you need to call `registerKindIcon`.

Note: This is different from the Source icon. One Source may contain multiple different kinds of objects.

```tsx
registerKindIcon("MyCustomResource", {
  // icon is a JSX element
  icon: <img src="https://headlamp.dev/img/favicon.png" />,
});
```

<figure style="text-align: center">

![Screenshot of a node with a custom icon](./images/node-with-an-icon.png)

<figcaption>Node with a custom Icon</figcaption>
</figure>
