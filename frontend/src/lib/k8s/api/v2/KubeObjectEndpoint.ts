export interface KubeObjectEndpoint {
  group?: string;
  version: string;
  resource: string;
}

export const KubeObjectEndpoint = {
  /**
   * Formats endpoints information into a URL path
   *
   * @param endpoint - Kubernetes resource endpoint definition
   * @param namespace - Namespace, optional
   * @returns Formatted URL path
   */
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
