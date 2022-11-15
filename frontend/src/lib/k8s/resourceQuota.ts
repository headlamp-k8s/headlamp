import { apiFactoryWithNamespace } from './apiProxy';
import { KubeObjectInterface, makeKubeObject } from './cluster';

interface spec {
  hard: {
    [key: string]: string;
  };
  scopes?: string[];
  scopeSelector?: {
    matchExpressions: {
      operator: string;
      scopeName: string;
      values: string[];
    }[];
  };
}

interface status {
  hard: {
    [key: string]: string;
  };
  used: {
    [key: string]: string;
  };
}

export interface KubeResourceQuota extends KubeObjectInterface {
  spec: spec;
  status: status;
}

class ResourceQuota extends makeKubeObject<KubeResourceQuota>('resourceQuota') {
  static apiEndpoint = apiFactoryWithNamespace('', 'v1', 'resourcequotas');

  get spec(): spec {
    return this.jsonData!.spec;
  }

  get status(): status {
    return this.jsonData!.status;
  }

  get requests(): string[] {
    const req: string[] = [];
    Object.keys(this.spec.hard).forEach(key => {
      if (key.startsWith('requests.')) {
        req.push(`${key}: ${this.status.used[key]}/${this.spec.hard[key]}`);
      }
    });
    return req;
  }

  get limits(): string[] {
    const limits: string[] = [];
    Object.keys(this.spec.hard).forEach(key => {
      if (key.startsWith('limits.')) {
        limits.push(`${key}: ${this.status.used[key]}/${this.spec.hard[key]}`);
      }
    });
    return limits;
  }

  get resourceStats() {
    const stats: { name: string; hard: string; used: string }[] = [];
    Object.keys(this.status.hard).forEach(key => {
      stats.push({
        name: key,
        hard: this.status.hard[key],
        used: this.status.used[key],
      });
    });
    return stats;
  }
}

export default ResourceQuota;
