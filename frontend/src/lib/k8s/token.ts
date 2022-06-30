import { KubeObjectInterface } from './cluster';

export interface KubeToken extends KubeObjectInterface {
  status: {
    token: string;
    expirationTimestamp: string;
  };
  spec: {
    audiences: string[];
    expirationSeconds: number;
  };
}
