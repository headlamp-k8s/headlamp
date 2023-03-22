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
        req.push(
          `${key}: ${this.normalizeUnit(key, this.status.used[key])}/${this.normalizeUnit(
            key,
            this.spec.hard[key]
          )}`
        );
      }
    });
    return req;
  }

  get limits(): string[] {
    const limits: string[] = [];
    Object.keys(this.spec.hard).forEach(key => {
      if (key.startsWith('limits.')) {
        limits.push(
          `${key}: ${this.normalizeUnit(key, this.status.used[key])}/${this.normalizeUnit(
            key,
            this.spec.hard[key]
          )}`
        );
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

  normalizeUnit(key: string, quantity: string) {
    const keySegments = key.split('.');
    const type = keySegments[1];
    let normalizedQuantity = '';
    switch (type) {
      case 'cpu':
        normalizedQuantity =
          (quantity?.endsWith('m')
            ? Number(quantity.substring(0, quantity.length - 1)) / 1000
            : quantity) + 'core';
        break;

      case 'memory':
        /**
         * Decimal: m | n | "" | k | M | G | T | P | E
         * Binary: Ki | Mi | Gi | Ti | Pi | Ei
         * Refer https://github.com/kubernetes-client/csharp/blob/840a90e24ef922adee0729e43859cf6b43567594/src/KubernetesClient.Models/ResourceQuantity.cs#L211
         */
        let bytes = parseInt(quantity);
        if (quantity.endsWith('Ki')) {
          bytes *= 1024;
        } else if (quantity.endsWith('Mi')) {
          bytes *= 1024 * 1024;
        } else if (quantity.endsWith('Gi')) {
          bytes *= 1024 * 1024 * 1024;
        } else if (quantity.endsWith('Ti')) {
          bytes *= 1024 * 1024 * 1024 * 1024;
        } else if (quantity.endsWith('Ei')) {
          bytes *= 1024 * 1024 * 1024 * 1024 * 1024;
        } else if (quantity.endsWith('m')) {
          bytes /= 1000;
        } else if (quantity.endsWith('u')) {
          bytes /= 1000 * 1000;
        } else if (quantity.endsWith('n')) {
          bytes /= 1000 * 1000 * 1000;
        } else if (quantity.endsWith('k')) {
          bytes *= 1000;
        } else if (quantity.endsWith('M')) {
          bytes *= 1000 * 1000;
        } else if (quantity.endsWith('G')) {
          bytes *= 1000 * 1000 * 1000;
        } else if (quantity.endsWith('T')) {
          bytes *= 1000 * 1000 * 1000 * 1000;
        } else if (quantity.endsWith('E')) {
          bytes *= 1000 * 1000 * 1000 * 1000 * 1000;
        }

        if (bytes === 0) {
          normalizedQuantity = '0 Bytes';
        } else {
          const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
          const k = 1024;
            const dm = 2;
          const i = Math.floor(Math.log(bytes) / Math.log(k));
          normalizedQuantity = parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
        }
        break;

      default:
        normalizedQuantity = quantity;
        break;
    }
    return normalizedQuantity;
  }
}

export default ResourceQuota;
