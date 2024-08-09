export interface KubeObjectEndpoint {
  group?: string;
  version: string;
  resource: string;
}

export const KubeObjectEndpoint = {
  toUrl: ({ group, version, resource }: KubeObjectEndpoint, namespace?: string) => {
    const parts = [];
    if (group) {
      parts.push('apis', group);
    } else {
      parts.push('api');
    }
    parts.push(version);

    if (namespace) {
      parts.push('namespaces', namespace);
    }

    parts.push(resource);

    return parts.join('/');
  },
};
