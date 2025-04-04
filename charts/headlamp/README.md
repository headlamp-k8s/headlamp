# Headlamp Helm Chart

Headlamp is an easy-to-use and extensible Kubernetes web UI that provides:
- 🚀 Modern, fast, and responsive interface
- 🔒 OIDC authentication support
- 🔌 Plugin system for extensibility
- 🎯 Real-time cluster state updates

## Prerequisites

- Kubernetes 1.21+
- Helm 3.x
- Cluster admin access for initial setup

## Quick Start

Add the Headlamp repository and install the chart:

```console
$ helm repo add headlamp https://kubernetes-sigs.github.io/headlamp/
$ helm repo update
$ helm install my-headlamp headlamp/headlamp --namespace kube-system
```

Access Headlamp:
```console
$ kubectl port-forward -n kube-system svc/my-headlamp 8080:80
```
Then open http://localhost:8080 in your browser.

## Installation

### Basic Installation
```console
$ helm install my-headlamp headlamp/headlamp --namespace kube-system
```

### Installation with OIDC
```console
$ helm install my-headlamp headlamp/headlamp \
  --namespace kube-system \
  --set config.oidc.clientID=your-client-id \
  --set config.oidc.clientSecret=your-client-secret \
  --set config.oidc.issuerURL=https://your-issuer-url
```

### Installation with Ingress
```console
$ helm install my-headlamp headlamp/headlamp \
  --namespace kube-system \
  --set ingress.enabled=true \
  --set ingress.hosts[0].host=headlamp.example.com \
  --set ingress.hosts[0].paths[0].path=/
```

## Configuration

### Core Parameters

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| replicaCount | int | `1` | Number of desired pods |
| image.registry | string | `"ghcr.io"` | Container image registry |
| image.repository | string | `"kubernetes-sigs/headlamp"` | Container image name |
| image.tag | string | `""` | Container image tag (defaults to Chart appVersion) |
| image.pullPolicy | string | `"IfNotPresent"` | Image pull policy |

### Application Configuration

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| config.inCluster | bool | `true` | Run Headlamp in-cluster |
| config.baseURL | string | `""` | Base URL path for Headlamp UI |
| config.pluginsDir | string | `"/headlamp/plugins"` | Directory to load Headlamp plugins from |
| config.extraArgs | array | `[]` | Additional arguments for Headlamp server |

### OIDC Configuration

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| config.oidc.clientID | string | `""` | OIDC client ID |
| config.oidc.clientSecret | string | `""` | OIDC client secret |
| config.oidc.issuerURL | string | `""` | OIDC issuer URL |
| config.oidc.scopes | string | `""` | OIDC scopes to be used |
| config.oidc.secret.create | bool | `true` | Create OIDC secret using provided values |
| config.oidc.secret.name | string | `"oidc"` | Name of the OIDC secret |
| config.oidc.externalSecret.enabled | bool | `false` | Enable using external secret for OIDC |
| config.oidc.externalSecret.name | string | `""` | Name of external OIDC secret |

There are three ways to configure OIDC:

1. Using direct configuration:
```yaml
config:
  oidc:
    clientID: "your-client-id"
    clientSecret: "your-client-secret"
    issuerURL: "https://your-issuer"
    scopes: "openid profile email"
```

2. Using automatic secret creation:
```yaml
config:
  oidc:
    secret:
      create: true
      name: oidc
```

3. Using external secret:
```yaml
config:
  oidc:
    secret:
      create: false
    externalSecret:
      enabled: true
      name: your-oidc-secret
```

### Deployment Configuration

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| replicaCount | int | `1` | Number of desired pods |
| image.registry | string | `"ghcr.io"` | Container image registry |
| image.repository | string | `"kubernetes-sigs/headlamp"` | Container image name |
| image.tag | string | `""` | Container image tag (defaults to Chart appVersion) |
| image.pullPolicy | string | `"IfNotPresent"` | Image pull policy |
| imagePullSecrets | list | `[]` | Image pull secrets references |
| nameOverride | string | `""` | Override the name of the chart |
| fullnameOverride | string | `""` | Override the full name of the chart |
| initContainers | list | `[]` | Init containers to run before main container |

### Security Configuration

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| serviceAccount.create | bool | `true` | Create service account |
| serviceAccount.name | string | `""` | Service account name |
| serviceAccount.annotations | object | `{}` | Service account annotations |
| clusterRoleBinding.create | bool | `true` | Create cluster role binding |
| clusterRoleBinding.clusterRoleName | string | `"cluster-admin"` | Kubernetes ClusterRole name |
| clusterRoleBinding.annotations | object | `{}` | Cluster role binding annotations |
| podSecurityContext | object | `{}` | Pod security context (e.g., fsGroup: 2000) |
| securityContext.runAsNonRoot | bool | `true` | Run container as non-root |
| securityContext.privileged | bool | `false` | Run container in privileged mode |
| securityContext.runAsUser | int | `100` | User ID to run container |
| securityContext.runAsGroup | int | `101` | Group ID to run container |
| securityContext.capabilities | object | `{}` | Container capabilities (e.g., drop: [ALL]) |
| securityContext.readOnlyRootFilesystem | bool | `false` | Mount root filesystem as read-only |

### Storage Configuration

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| persistentVolumeClaim.enabled | bool | `false` | Enable PVC |
| persistentVolumeClaim.annotations | object | `{}` | PVC annotations |
| persistentVolumeClaim.size | string | `""` | PVC size (required if enabled) |
| persistentVolumeClaim.storageClassName | string | `""` | Storage class name |
| persistentVolumeClaim.accessModes | list | `[]` | PVC access modes |
| persistentVolumeClaim.selector | object | `{}` | PVC selector |
| persistentVolumeClaim.volumeMode | string | `""` | PVC volume mode |
| volumeMounts | list | `[]` | Container volume mounts |
| volumes | list | `[]` | Pod volumes |

### Network Configuration

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| service.type | string | `"ClusterIP"` | Kubernetes service type |
| service.port | int | `80` | Kubernetes service port |
| ingress.enabled | bool | `false` | Enable ingress |
| ingress.ingressClassName | string | `""` | Ingress class name |
| ingress.annotations | object | `{}` | Ingress annotations (e.g., kubernetes.io/tls-acme: "true") |
| ingress.labels | object | `{}` | Additional labels for the Ingress resource |
| ingress.hosts | list | `[]` | Ingress hosts configuration |
| ingress.tls | list | `[]` | Ingress TLS configuration |

Example ingress configuration:
```yaml
ingress:
  enabled: true
  annotations:
    kubernetes.io/tls-acme: "true"
  labels:
    app.kubernetes.io/part-of: traefik
    environment: prod
  hosts:
    - host: headlamp.example.com
      paths:
        - path: /
          type: ImplementationSpecific
  tls:
    - secretName: headlamp-tls
      hosts:
        - headlamp.example.com
```

### Resource Management

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| resources | object | `{}` | Container resource requests/limits |
| nodeSelector | object | `{}` | Node labels for pod assignment |
| tolerations | list | `[]` | Pod tolerations |
| affinity | object | `{}` | Pod affinity settings |
| podAnnotations | object | `{}` | Pod annotations |
| env | list | `[]` | Additional environment variables |

Example resource configuration:
```yaml
resources:
  limits:
    cpu: 100m
    memory: 128Mi
  requests:
    cpu: 100m
    memory: 128Mi
```

Example environment variables:
```yaml
env:
  - name: KUBERNETES_SERVICE_HOST
    value: "localhost"
  - name: KUBERNETES_SERVICE_PORT
    value: "6443"
```

## Links

- [GitHub Repository](https://github.com/kubernetes-sigs/headlamp)
- [Documentation](https://headlamp.dev/)
- [Maintainers](https://github.com/kubernetes-sigs/headlamp/blob/main/MAINTAINERS.md)
