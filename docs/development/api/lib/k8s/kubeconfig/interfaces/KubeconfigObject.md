# Interface: KubeconfigObject

KubeconfigObject is the object that is stored in indexDB as string format.
It is a JSON encoded version of the kubeconfig file.
It is used to store the kubeconfig for stateless clusters.
This is basically a k8s client - go Kubeconfig object.
KubeconfigObject holds the information needed to build connect to remote kubernetes clusters as a given user
*

## See

 - [more info](https://kubernetes.io/docs/reference/config-api/kubeconfig.v1/)
 - storeStatelessClusterKubeconfig
 - getStatelessClusterKubeConfigs
 - findKubeconfigByClusterName

## Properties

### apiVersion

```ts
apiVersion: string;
```

version of the kubeconfig file.

#### Defined in

[frontend/src/lib/k8s/kubeconfig.ts:14](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/kubeconfig.ts#L14)

***

### clusters

```ts
clusters: object[];
```

Clusters is a map of referencable names to cluster configs.

#### cluster

```ts
cluster: object;
```

cluster is the cluster information.

##### See

[more info](https://kubernetes.io/docs/reference/config-api/kubeconfig.v1/#Cluster)

##### cluster.certificateAuthority?

```ts
optional certificateAuthority: string;
```

CertificateAuthority is the path to a cert file for the certificate authority.

##### cluster.certificateAuthorityData?

```ts
optional certificateAuthorityData: string;
```

CertificateAuthorityData contains PEM-encoded certificate authority certificates. Overrides CertificateAuthority

##### cluster.disableCompression?

```ts
optional disableCompression: boolean;
```

DisableCompression allows client to opt-out of response compression for all requests to the server. This is useful to speed up requests (specifically lists) when client-server network bandwidth is ample, by saving time on compression (server-side) and decompression (client-side): https://github.com/kubernetes/kubernetes/issues/112296.

##### cluster.extensions?

```ts
optional extensions: object[];
```

##### cluster.insecureSkipTLSVerify?

```ts
optional insecureSkipTLSVerify: boolean;
```

InsecureSkipTLSVerify skips the validity check for the server's certificate. This will make your HTTPS connections insecure.

##### cluster.proxyURL?

```ts
optional proxyURL: string;
```

ProxyURL is the URL to the proxy to be used for requests to this cluster.

##### cluster.server

```ts
server: string;
```

Server is the address of the kubernetes cluster (https://hostname:port).

##### cluster.tlsServerName?

```ts
optional tlsServerName: string;
```

TLSServerName is used to check server certificate. If TLSServerName is empty, the hostname used to contact the server is used.

#### name

```ts
name: string;
```

name is the name of the cluster.

#### See

[more info](https://kubernetes.io/docs/reference/config-api/kubeconfig.v1/#NamedCluster)

#### Defined in

[frontend/src/lib/k8s/kubeconfig.ts:34](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/kubeconfig.ts#L34)

***

### contexts

```ts
contexts: object[];
```

Contexts is a map of referencable names to context configs.

#### context

```ts
context: object;
```

context is the context information.

##### context.cluster

```ts
cluster: string;
```

cluster is the cluster information.

##### context.extensions?

```ts
optional extensions: object[];
```

Extensions holds additional information. This is useful for extenders so that reads and writes don't clobber unknown fields on the Context object.

##### context.namespace?

```ts
optional namespace: string;
```

namespace is the default namespace.

##### context.user

```ts
user: string;
```

user is the user information.

#### name

```ts
name: string;
```

name is the name of the context.

#### See

[more info](https://kubernetes.io/docs/reference/config-api/kubeconfig.v1/#NamedContext)

#### Defined in

[frontend/src/lib/k8s/kubeconfig.ts:130](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/kubeconfig.ts#L130)

***

### current-context

```ts
current-context: string;
```

CurrentContext is the name of the context that you would like to use by default

#### Defined in

[frontend/src/lib/k8s/kubeconfig.ts:154](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/kubeconfig.ts#L154)

***

### extensions?

```ts
optional extensions: object[];
```

Extensions holds additional information. This is useful for extenders so that reads and writes don't clobber unknown fields

#### extension

```ts
extension: object;
```

Extension holds the extension information

#### name

```ts
name: string;
```

name is the nickname of the extension.

#### See

[more info](https://kubernetes.io/docs/reference/config-api/kubeconfig.v1/#NamedExtension)

#### Defined in

[frontend/src/lib/k8s/kubeconfig.ts:158](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/kubeconfig.ts#L158)

***

### kind

```ts
kind: string;
```

kind is the type of the kubeconfig file. It is always 'Config'.

#### Defined in

[frontend/src/lib/k8s/kubeconfig.ts:16](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/kubeconfig.ts#L16)

***

### preferences?

```ts
optional preferences: object;
```

Preferences holds general information to be use for cli interactions

#### colors?

```ts
optional colors: boolean;
```

colors specifies whether output should use colors.

#### extensions?

```ts
optional extensions: object[];
```

extensions holds additional information. This is useful for extenders so that reads and writes don't clobber unknown fields on the Preferences object.

#### See

[more info](https://kubernetes.io/docs/reference/config-api/kubeconfig.v1/#Preferences)

#### Defined in

[frontend/src/lib/k8s/kubeconfig.ts:20](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/kubeconfig.ts#L20)

***

### users

```ts
users: object[];
```

AuthInfos is a map of referencable names to user configs.

#### name

```ts
name: string;
```

name is the name of the user.

#### user

```ts
user: object;
```

holds the auth information

##### See

[more info](https://kubernetes.io/docs/reference/config-api/kubeconfig.v1/#AuthInfo)

##### user.authProvider?

```ts
optional authProvider: object;
```

AuthProvider is a reference to a specific auth provider.

##### user.authProvider.config

```ts
config: object;
```

config is a map of strings to objects. The contents of the map are dependent on the provider:

###### Index Signature

 \[`key`: `string`\]: `string`

##### user.authProvider.name

```ts
name: string;
```

name is the name of the auth provider.

##### user.clientCertificate?

```ts
optional clientCertificate: string;
```

ClientCertificate is the path to a client key file for TLS.

##### user.clientCertificateData?

```ts
optional clientCertificateData: string;
```

ClientCertificateData contains PEM-encoded data from a client key file for TLS.

##### user.clientKey?

```ts
optional clientKey: string;
```

ClientKey is the path to a client key file for TLS.

##### user.clientKeyData?

```ts
optional clientKeyData: string;
```

ClientKeyData contains PEM-encoded data from a client key file for TLS.

##### user.exec?

```ts
optional exec: object;
```

Exec specifies a command to provide client credentials.

##### user.exec.args?

```ts
optional args: string[];
```

Arguments to pass to the command when executing it.

##### user.exec.command

```ts
command: string;
```

Command to execute.

##### user.exec.env?

```ts
optional env: object;
```

Env defines additional environment variables to expose to the process.

###### Index Signature

 \[`key`: `string`\]: `string`

##### user.extensions?

```ts
optional extensions: object[];
```

Extensions holds additional information. This is useful for extenders so that reads and writes don't clobber unknown fields on the AuthInfo object.

##### user.impersonate?

```ts
optional impersonate: string;
```

Impersonate is the username to imperonate.

##### user.impersonateGroups?

```ts
optional impersonateGroups: string[];
```

ImpersonateGroups is the groups to imperonate.

##### user.impersonateUserExtra?

```ts
optional impersonateUserExtra: object;
```

ImpersonateUserExtra contains additional information for impersonated user.

###### Index Signature

 \[`key`: `string`\]: `string`[]

##### user.password?

```ts
optional password: string;
```

Password is the password for basic authentication to the kubernetes cluster.

##### user.token?

```ts
optional token: string;
```

Token is the bearer token for authentication to the kubernetes cluster.

##### user.tokenFile?

```ts
optional tokenFile: string;
```

TokenFile is a pointer to a file that contains a bearer token (as described above).

##### user.username?

```ts
optional username: string;
```

Username is the username for basic authentication to the kubernetes cluster.

#### See

[more info](https://kubernetes.io/docs/reference/config-api/kubeconfig.v1/#NamedAuthInfo)

#### Defined in

[frontend/src/lib/k8s/kubeconfig.ts:67](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/kubeconfig.ts#L67)
