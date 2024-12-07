# Interface: KubeContainer

## Link

https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.27/#container-v1-core

## Properties

### args?

```ts
optional args: string[];
```

Arguments to the entrypoint. The container image's CMD is used if this is not provided.
Variable references $(VAR_NAME) are expanded using the container's environment.
If a variable cannot be resolved, the reference in the input string will be unchanged.
Double $$ are reduced to a single $, which allows for escaping the $(VAR_NAME)
syntax: i.e. "$$(VAR_NAME)" will produce the string literal "$(VAR_NAME)".
Escaped references will never be expanded, regardless of whether the variable exists or not.
Cannot be updated.

#### See

[more information](https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell)

#### Defined in

[frontend/src/lib/k8s/cluster.ts:178](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L178)

***

### command?

```ts
optional command: string[];
```

Entrypoint array. Not executed within a shell. The container image's ENTRYPOINT is used if
this is not provided. Variable references $(VAR_NAME) are expanded using the container's environment.
If a variable cannot be resolved, the reference in the input string will be unchanged.
Double $$ are reduced to a single $, which allows for escaping the $(VAR_NAME)
syntax: i.e. "$$(VAR_NAME)" will produce the string literal "$(VAR_NAME)".
Escaped references will never be expanded, regardless of whether the variable exists or not.
Cannot be updated.

#### See

[more information](https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell)

#### Defined in

[frontend/src/lib/k8s/cluster.ts:190](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L190)

***

### env?

```ts
optional env: object[];
```

List of environment variables to set in the container. Cannot be updated.

#### name

```ts
name: string;
```

Name of the environment variable. Must be a C_IDENTIFIER.

#### value?

```ts
optional value: string;
```

Variable references $(VAR_NAME) are expanded using the previously defined environment variables
in the container and any service environment variables. If a variable cannot be resolved, the
reference in the input string will be unchanged. Double $$ are reduced to a single $, which
allows for escaping the $(VAR_NAME) syntax: i.e. "$$(VAR_NAME)" will produce the
string literal "$(VAR_NAME)". Escaped references will never be expanded, regardless of whether
the variable exists or not. Defaults to "".

#### valueFrom?

```ts
optional valueFrom: object;
```

Source for the environment variable's value. Cannot be used if value is not empty.

##### valueFrom.configMapKeyRef?

```ts
optional configMapKeyRef: object;
```

Selects a key of a ConfigMap.

##### valueFrom.configMapKeyRef.key

```ts
key: string;
```

The key to select.

##### valueFrom.configMapKeyRef.name

```ts
name: string;
```

Name of the referent.

##### valueFrom.configMapKeyRef.optional?

```ts
optional optional: boolean;
```

Specify whether the ConfigMap or its key must be defined

##### valueFrom.fieldRef?

```ts
optional fieldRef: object;
```

Selects a field of the pod: supports metadata.name, metadata.namespace, `metadata.labels['<KEY>']`,
`metadata.annotations['<KEY>']`, spec.nodeName, spec.serviceAccountName, status.hostIP,
status.podIP, status.podIPs.

##### valueFrom.fieldRef.apiVersion

```ts
apiVersion: string;
```

Version of the schema the FieldPath is written in terms of, defaults to "v1".

##### valueFrom.fieldRef.fieldPath

```ts
fieldPath: string;
```

Path of the field to select in the specified API version.

##### valueFrom.resourceFieldRef?

```ts
optional resourceFieldRef: object;
```

Selects a resource of the container: only resources limits and requests
(limits.cpu, limits.memory, limits.ephemeral-storage, requests.cpu, requests.memory
 and requests.ephemeral-storage) are currently supported.

##### valueFrom.resourceFieldRef.containerName?

```ts
optional containerName: string;
```

Container name: required for volumes, optional for env vars

##### valueFrom.resourceFieldRef.divisor?

```ts
optional divisor: string;
```

Specifies the output format of the exposed resources, defaults to "1".

###### See

[Quantity](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.27/#quantity-resource-core)

##### valueFrom.resourceFieldRef.resource

```ts
resource: string;
```

Required: resource to select

##### valueFrom.secretKeyRef?

```ts
optional secretKeyRef: object;
```

Selects a key of a secret in the pod's namespace

##### valueFrom.secretKeyRef.key

```ts
key: string;
```

The key of the secret to select from. Must be a valid secret key.

##### valueFrom.secretKeyRef.name

```ts
name: string;
```

Name of the referent.

##### valueFrom.secretKeyRef.optional?

```ts
optional optional: boolean;
```

Specify whether the Secret or its key must be defined

#### Defined in

[frontend/src/lib/k8s/cluster.ts:193](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L193)

***

### envFrom?

```ts
optional envFrom: object[];
```

#### configMapRef?

```ts
optional configMapRef: object;
```

##### configMapRef.name

```ts
name: string;
```

Name of the referent.

##### configMapRef.optional?

```ts
optional optional: boolean;
```

Specify whether the ConfigMap must be defined

#### prefix?

```ts
optional prefix: string;
```

An optional identifier to prepend to each key in the ConfigMap. Must be a C_IDENTIFIER.

#### secretRef?

```ts
optional secretRef: object;
```

SecretEnvSource	The Secret to select from

##### secretRef.name

```ts
name: string;
```

Name of the referent.

##### secretRef.optional?

```ts
optional optional: boolean;
```

Specify whether the Secret must be defined

#### Defined in

[frontend/src/lib/k8s/cluster.ts:255](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L255)

***

### image

```ts
image: string;
```

Container image name. This field is optional to allow higher level config management to
default or override container images in workload controllers like Deployments and StatefulSets.

#### See

[more info](https://kubernetes.io/docs/concepts/containers/images)

#### Defined in

[frontend/src/lib/k8s/cluster.ts:279](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L279)

***

### imagePullPolicy

```ts
imagePullPolicy: string;
```

Image pull policy. One of Always, Never, IfNotPresent. Defaults to Always if :latest tag is
specified, or IfNotPresent otherwise. Cannot be updated.

#### See

[more info](https://kubernetes.io/docs/concepts/containers/images#updating-images)

#### Defined in

[frontend/src/lib/k8s/cluster.ts:287](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L287)

***

### livenessProbe?

```ts
optional livenessProbe: KubeContainerProbe;
```

Periodic probe of container liveness. Container will be restarted if the probe fails.
Cannot be updated.

#### See

[more info](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes)

#### Defined in

[frontend/src/lib/k8s/cluster.ts:297](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L297)

***

### name

```ts
name: string;
```

Name of the container specified as a DNS_LABEL.
Each container in a pod must have a unique name (DNS_LABEL).

Cannot be updated.

#### Defined in

[frontend/src/lib/k8s/cluster.ts:305](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L305)

***

### ports?

```ts
optional ports: object[];
```

List of ports to expose from the container. Not specifying a port here DOES NOT prevent that
port from being exposed. Any port which is listening on the default "0.0.0.0" address inside
a container will be accessible from the network. Modifying this array with strategic merge
patch may corrupt the data. For more information See https://github.com/kubernetes/kubernetes/issues/108255.

Cannot be updated.

https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.27/#containerport-v1-core

#### containerPort

```ts
containerPort: number;
```

Number of port to expose on the pod's IP address. This must be a valid port number, 0 < x < 65536.

#### hostIP?

```ts
optional hostIP: string;
```

What host IP to bind the external port to.

#### hostPort?

```ts
optional hostPort: number;
```

Number of port to expose on the host. If specified, this must be a valid port number, 0 < x < 65536.
If HostNetwork is specified, this must match ContainerPort. Most containers do not need this.

#### name?

```ts
optional name: string;
```

If specified, this must be an IANA_SVC_NAME and unique within the pod. Each named port in a pod must have a unique name. Name for the port that can be referred to by services.

#### protocol?

```ts
optional protocol: string;
```

Protocol for port. Must be UDP, TCP, or SCTP. Defaults to "TCP".

#### Defined in

[frontend/src/lib/k8s/cluster.ts:317](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L317)

***

### readinessProbe?

```ts
optional readinessProbe: KubeContainerProbe;
```

Periodic probe of container service readiness. Container will be removed from service endpoints
if the probe fails.

Cannot be updated.

#### See

[more info](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes)

#### Defined in

[frontend/src/lib/k8s/cluster.ts:340](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L340)

***

### resizePolicy?

```ts
optional resizePolicy: object[];
```

Resources resize policy for the container.

#### resourceName

```ts
resourceName: string;
```

Name of the resource to which this resource resize policy applies.
Supported values: cpu, memory.

#### restartPolicy?

```ts
optional restartPolicy: string;
```

Restart policy to apply when specified resource is resized.
If not specified, it defaults to NotRequired.

#### Defined in

[frontend/src/lib/k8s/cluster.ts:342](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L342)

***

### resources?

```ts
optional resources: object;
```

Compute Resources required by this container. Cannot be updated.

#### claims?

```ts
optional claims: object;
```

##### claims.name

```ts
name: string;
```

Name must match the name of one entry in pod.spec.resourceClaims of the Pod where
this field is used. It makes that resource available inside a container.

#### limits?

```ts
optional limits: object;
```

Limits describes the maximum amount of compute resources allowed.

##### See

[more info](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/)

Can also have hugpages like: "hugepages-2Mi": "100Mi" // Requesting 100 Mebibytes of 2 MiB HugePages

##### limits.cpu?

```ts
optional cpu: string;
```

example "100m", 100 milliCPU (0.1 CPU core)

##### limits.memory?

```ts
optional memory: string;
```

example , "256Mi" 256 Mebibytes

#### requests?

```ts
optional requests: object;
```

##### requests.cpu?

```ts
optional cpu: string;
```

example "500m", 500 milliCPU (0.5 CPU core)

##### requests.memory?

```ts
optional memory: string;
```

example , "1Gi" 1 Gibibyte

#### See

[more info](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/)

https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.27/#resourcerequirements-v1-core

#### Defined in

[frontend/src/lib/k8s/cluster.ts:361](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L361)

***

### stdin?

```ts
optional stdin: boolean;
```

Whether this container should allocate a buffer for stdin in the container runtime.
If this is not set, reads from stdin in the container will always result in EOF.

Default is false.

#### Defined in

[frontend/src/lib/k8s/cluster.ts:428](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L428)

***

### stdinOnce?

```ts
optional stdinOnce: boolean;
```

Whether the container runtime should close the stdin channel after it has been opened
by a single attach. When stdin is true the stdin stream will remain open across
multiple attach sessions. If stdinOnce is set to true, stdin is opened on container start,
is empty until the first client attaches to stdin, and then remains open and accepts data
until the client disconnects, at which time stdin is closed and remains closed until the
container is restarted. If this flag is false, a container processes that reads from stdin
will never receive an EOF.

Default is false

#### Defined in

[frontend/src/lib/k8s/cluster.ts:440](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L440)

***

### terminationMessagePath?

```ts
optional terminationMessagePath: string;
```

Path at which the file to which the container's termination message will be written is mounted
into the container's filesystem. Message written is intended to be brief final status, such as
an assertion failure message. Will be truncated by the node if greater than 4096 bytes.
The total message length across all containers will be limited to 12kb.
Defaults to /dev/termination-log.

Cannot be updated.

#### Defined in

[frontend/src/lib/k8s/cluster.ts:403](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L403)

***

### terminationMessagePolicy?

```ts
optional terminationMessagePolicy: string;
```

Indicate how the termination message should be populated. File will use the contents of
terminationMessagePath to populate the container status message on both success and failure.
FallbackToLogsOnError will use the last chunk of container log output if the termination message
file is empty and the container exited with an error. The log output is limited to 2048 bytes or
80 lines, whichever is smaller. Defaults to File.

Cannot be updated.

#### Defined in

[frontend/src/lib/k8s/cluster.ts:414](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L414)

***

### tty?

```ts
optional tty: boolean;
```

Whether this container should allocate a TTY for itself, also requires
'stdin' to be true.

Default is false.

#### Defined in

[frontend/src/lib/k8s/cluster.ts:447](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L447)

***

### volumeDevices?

```ts
optional volumeDevices: object[];
```

volumeDevices is the list of block devices to be used by the container.

patch strategy: merge
patch merge key: devicePath

#### devicePath

```ts
devicePath: string;
```

devicePath is the path inside of the container that the device will be mapped to.

#### name

```ts
name: string;
```

name must match the name of a persistentVolumeClaim in the pod

#### Defined in

[frontend/src/lib/k8s/cluster.ts:454](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L454)

***

### volumeMounts?

```ts
optional volumeMounts: object[];
```

#### mountPath

```ts
mountPath: string;
```

#### name

```ts
name: string;
```

#### readOnly

```ts
readOnly: boolean;
```

#### Defined in

[frontend/src/lib/k8s/cluster.ts:416](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L416)

***

### workingDir?

```ts
optional workingDir: string;
```

Container's working directory. If not specified, the container runtime's default
will be used, which might be configured in the container image.
Cannot be updated.

#### Defined in

[frontend/src/lib/k8s/cluster.ts:465](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L465)
