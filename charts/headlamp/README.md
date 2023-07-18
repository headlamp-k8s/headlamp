# headlamp

Headlamp is an easy-to-use and extensible Kubernetes web UI.

**Homepage:** <https://github.com/headlamp-k8s/headlamp/tree/main/charts/headlamp>

## TL;DR

```console
$ helm repo add headlamp https://headlamp-k8s.github.io/headlamp/
$ helm install my-headlamp headlamp/headlamp --namespace kube-system
```


## Maintainers

See [MAINTAINERS.md](https://github.com/headlamp-k8s/headlamp/blob/main/MAINTAINERS.md) in the headlamp github repo.

## Source Code

* <https://github.com/headlamp-k8s/headlamp>
* <https://headlamp.dev/>

### Headlamp parameters

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| affinity | object | `{}` | Affinity settings for pod assignment |
| clusterRoleBinding.annotations | object | `{}` | Annotations to add to the cluster role binding |
| clusterRoleBinding.create | bool | `true` | Specified whether a cluster role binding should be created |
| fullnameOverride | string | `""` | Overrides the full name of the chart |
| image.pullPolicy | string | `"IfNotPresent"` | Image pull policy. One of Always, Never, IfNotPresent |
| image.registry | string | `"ghcr.io"` | Container image registry |
| image.repository | string | `"headlamp-k8s/headlamp"` | Container image name |
| image.tag | string | `""` | Container image tag, If "" uses appVersion in Chart.yaml |
| imagePullSecrets | list | `[]` | An optional list of references to secrets in the same namespace to use for pulling any of the images used |
| ingress.annotations | object | `{}` | Annotations for Ingress resource |
| ingress.enabled | bool | `false` | Enable ingress controller resource |
| ingress.hosts | list | `[]` | Hostname(s) for the Ingress resource |
| ingress.tls | list | `[]` | Ingress TLS configuration |
| initContainers | list | `[]` | An optional list of init containers to be run before the main containers. |
| nameOverride | string | `""` | Overrides the name of the chart |
| nodeSelector | object | `{}` | Node labels for pod assignment |
| persistentVolumeClaim.accessModes | list | `[]` | accessModes for the persistent volume claim, eg: ReadWriteOnce, ReadOnlyMany, ReadWriteMany etc. |
| persistentVolumeClaim.annotations | object | `{}` | Annotations to add to the persistent volume claim (if enabled) |
| persistentVolumeClaim.enabled | bool | `false` | Enable Persistent Volume Claim |
| persistentVolumeClaim.selector | object | `{}` | selector for the persistent volume claim. |
| persistentVolumeClaim.size | string | `""` | size of the persistent volume claim, eg: 10Gi. Required if enabled is true. |
| persistentVolumeClaim.storageClassName | string | `""` | storageClassName for the persistent volume claim. |
| persistentVolumeClaim.volumeMode | string | `""` | volumeMode for the persistent volume claim, eg: Filesystem, Block. |
| podAnnotations | object | `{}` | Annotations to add to the pod |
| podSecurityContext | object | `{}` | Headlamp pod's Security Context |
| replicaCount | int | `1` | Number of desired pods |
| resources | object | `{}` | CPU/Memory resource requests/limits |
| securityContext | object | `{}` | Headlamp containers Security Context |
| service.port | int | `80` | Kubernetes Service port |
| service.type | string | `"ClusterIP"` | Kubernetes Service type |
| serviceAccount.annotations | object | `{}` | Annotations to add to the service account |
| serviceAccount.create | bool | `true` | Specifies whether a service account should be created |
| serviceAccount.name | string | `""` | The name of the service account to use.(If not set and create is true, a name is generated using the fullname template) |
| tolerations | list | `[]` | Toleration labels for pod assignment |
| volumeMounts | list | `[]` | Headlamp containers volume mounts |
| volumes | list | `[]` | Headlamp pod's volumes |


### Headlamp Configuration

| Key                      | Type   | Default               | Description                                |
|--------------------------|--------|-----------------------|--------------------------------------------|
| config.baseURL           | string | `""`                  | base url path at which headlamp should run |
| config.oidc.clientID     | string | `""`                  | OIDC client ID                             |
| config.oidc.clientSecret | string | `""`                  | OIDC client secret                         |
| config.oidc.issuerURL    | string | `""`                  | OIDC issuer URL                            |
| config.oidc.scopes       | string | `""`                  | OIDC scopes to be used                     |
| config.pluginsDir        | string | `"/headlamp/plugins"` | directory to look for plugins              |
