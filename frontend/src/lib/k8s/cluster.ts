import React from 'react';
import { createRouteURL } from '../router';
import { timeAgo, useErrorState } from '../util';
import { useConnectApi } from '.';
import { ApiError, apiFactory, apiFactoryWithNamespace, post } from './apiProxy';
import CronJob from './cronJob';
import DaemonSet from './daemonSet';
import Deployment from './deployment';
import { KubeEvent } from './event';
import Job from './job';
import ReplicaSet from './replicaSet';
import StatefulSet from './statefulSet';

export interface Cluster {
  name: string;
  useToken?: boolean;
  [propName: string]: any;
}

export interface KubeObjectInterface {
  kind: string;
  apiVersion?: string;
  metadata: KubeMetadata;
  [otherProps: string]: any;
}

export interface StringDict {
  [key: string]: string;
}

export interface KubeMetadata {
  uid: string;
  name: string;
  namespace?: string;
  creationTimestamp: string;
  resourceVersion: string;
  selfLink: string;
  labels?: StringDict;
  annotations?: StringDict;
}

// We have to define a KubeObject implementation here because the KubeObject
// class is defined within the function and therefore not inferable.
export interface KubeObjectIface<T extends (KubeObjectInterface | KubeEvent)> {
  apiList: (onList: (arg: InstanceType<KubeObjectIface<T>>[]) => void) => any;
  useApiList: (onList: (arg: InstanceType<KubeObjectIface<T>>[]) => void,
               onError?: (err: ApiError) => void) => any;
  useApiGet: (onGet: (...args: any) => void, name: string,
              namespace?: string, onError?: (err: ApiError) => void) => void;
  useList: (onList?: (...arg: any[]) => any) => [any[], ApiError | null, (items: any[]) => void,
           (err: ApiError | null) => void];
  getErrorMessage: (err: ApiError | null) => string | null;
  new(json: T): any;
  className: string;
  [prop: string]: any;
}

export function
makeKubeObject<T extends (KubeObjectInterface | KubeEvent)>(objectName: string):
  KubeObjectIface<T> {
  class KubeObject {
    static apiEndpoint: ReturnType<(typeof apiFactoryWithNamespace) | (typeof apiFactory)>;
    jsonData: T | null = null;

    constructor(json: T) {
      this.jsonData = json;
    }

    static get className(): string {
      return objectName;
    }

    get detailsRoute(): string {
      return this._class().className;
    }

    get listRoute(): string {
      return this.detailsRoute + 's';
    }

    getDetailsLink() {
      const params = {
        namespace: this.getNamespace(),
        name: this.getName(),
      };
      const link = createRouteURL(this.detailsRoute, params);
      return link;
    }

    getListLink() {
      return createRouteURL(this.listRoute);
    }

    getName() {
      return this.metadata.name;
    }

    getNamespace() {
      return this.metadata.namespace;
    }

    getCreationTs() {
      return this.metadata.creationTimestamp;
    }

    getAge() {
      return timeAgo(this.getCreationTs());
    }

    getValue(prop: string) {
      return this.jsonData![prop];
    }

    get metadata() {
      return this.jsonData!.metadata;
    }

    get kind() {
      return this.jsonData!.kind;
    }

    static apiList<U extends KubeObject>(onList: (arg: U[]) => void,
                                         onError?: (err: ApiError) => void) {
      const createInstance = (item: T) => this.create(item) as U;

      const args: any[] = [(list: T[]) => onList(list.map((item: T) => createInstance(item) as U))];

      if (this.apiEndpoint.isNamespaced) {
        args.unshift(null);
      }

      if (onError) {
        args.push(onError);
      }

      return this.apiEndpoint.list.bind(null, ...args);
    }

    static useApiList<U extends KubeObject>(onList: (...arg: any[]) => any,
                                            onError?: (err: ApiError) => void) {
      const listCallback = onList as (arg: U[]) => void;
      useConnectApi(this.apiList(listCallback, onError));
    }

    static useList<U extends KubeObject>(onList?: (...arg: any[]) => any):
      [U[] | null, ApiError | null, (items: U[]) => void, (err: ApiError | null) => void] {
      const [objList, setObjList] = React.useState<U[] | null>(null);
      const [error, setError] = useErrorState(setObjList);

      function setList(items: U[] | null) {
        setObjList(items);
        if (items !== null) {
          setError(null);
        }
      }

      this.useApiList(setList, setError);

      // Return getters and then the setters as the getters are more likely to be used with
      // this function.
      return [objList, error, setObjList, setError];
    }

    static create<U extends KubeObject>(this: new (arg: T) => U, item: T): U {
      return (new this(item)) as U;
    }

    static apiGet<U extends KubeObject>(onGet: (...args: any) => void, name: string,
                                        namespace?: string) {
      const createInstance = (item: T) => this.create(item) as U;
      const args: any[] = [name, (obj: T) => onGet(createInstance(obj))];

      if (this.apiEndpoint.isNamespaced) {
        args.unshift(namespace);
      }

      return this.apiEndpoint.get.bind(null, ...args);
    }

    static useApiGet<U extends KubeObject>(onGet: (...args: any) => any, name: string,
                                           namespace?: string) {
      // We do the type conversion here because we want to be able to use hooks that may not have
      // the exact signature as get callbacks.
      const getCallback = onGet as (item: U) => void;
      useConnectApi(this.apiGet(getCallback, name, namespace));
    }

    private _class() {
      return (this.constructor as typeof KubeObject);
    };

    delete() {
      const args: string[] = [this.getName()];
      if (this._class().apiEndpoint.isNamespaced) {
        args.unshift(this.getNamespace()!);
      }

      return this._class().apiEndpoint.delete(...args);
    }

    update(data: KubeObjectInterface) {
      return this._class().put(data);
    }

    static put(data: KubeObjectInterface) {
      return this.apiEndpoint.put(data);
    }

    async getAuthorization(verb: string) {
      const resourceAttrs: {
        name: string;
        verb: string;
        namespace?: string;
      } = {
        name: this.getName(),
        verb
      };

      const namespace = this.getNamespace();
      if (!!namespace) {
        resourceAttrs['namespace'] = namespace;
      }

      const spec = {
        resourceAttributes: resourceAttrs
      };

      return await post('/apis/authorization.k8s.io/v1beta1/selfsubjectaccessreviews', {
        kind: 'SelfSubjectAccessReview',
        apiVersion: 'authorization.k8s.io/v1beta1',
        spec
      }, false);
    }

    static getErrorMessage(err: ApiError | null) {
      if (!err) {
        return null;
      }

      switch (err.status) {
        case 404:
          return 'Error: Not found';
        case 403:
          return 'Error: No permissions';
        default:
          return 'Error';
      }
    }
  }

  return KubeObject as KubeObjectIface<T>;
}

export type KubeObjectClass = ReturnType<typeof makeKubeObject>;
export type KubeObject = InstanceType<KubeObjectClass>;

export interface KubeCondition {
  type: string;
  status: string;
  lastProbeTime: number;
  lastTransitionTime?: string;
  lastUpdateTime?: string;
  reason?: string;
  message?: string;
}

export interface KubeContainer {
  name: string;
  image: string;
  command?: string[];
  args?: string[];
  ports: {
    name?: string;
    containerPort: number;
    protocol: string;
  }[];
  resources?: {
    limits: {
      cpu: string;
      memory: string;
    };
    requests: {
      cpu: string;
      memory: string;
    };
  };
  env?: {
    name: string;
    value?: string;
    valueFrom?: {
      fieldRef?: {
        apiVersion: string;
        fieldPath: string;
      };
      secretKeyRef?: {
        key: string;
        name: string;
      };
      configMapKeyRef?: {
        key: string;
        name: string;
      };
    };
  }[];
  envFrom?: {
    configMapRef?: {
      name: string;
    };
  }[];
  volumeMounts?: {
    name: string;
    readOnly: boolean;
    mountPath: string;
  }[];
  livenessProbe?: KubeContainerProbe;
  readinessProbe?: KubeContainerProbe;
  imagePullPolicy: string;
}

interface KubeContainerProbe {
  httpGet?: {
    path?: string;
    port: number;
    scheme: string;
    host?: string;
  };
  exec?: {
    command: string[];
  };
  tcpSocket?: {
    port: number;
  };
  initialDelaySeconds?: number;
  timeoutSeconds?: number;
  periodSeconds?: number;
  successThreshold?: number;
  failureThreshold?: number;
}

export interface LabelSelector {
  matchExpressions?: {
    key: string;
    operator: string;
    values: string[];
  };
  matchLabels?: {
    [key: string]: string;
  };
}

export interface KubeMetrics {
  metadata: KubeMetadata;
  usage: {
    cpu: string;
    memory: string;
  };
  status: {
    capacity: {
      cpu: string;
      memory: string;
    };
  };
}

export interface KubeContainerStatus {
  containerID: string;
  image: string;
  imageID: string;
  lastState: string;
  name: string;
  ready: boolean;
  restartCount: number;
  state: {
    running: {
      startedAt: number;
    };
    terminated: {
      containerID: string;
      exitCode: number;
      finishedAt: number;
      message: string;
      reason: string;
      signal: number;
      startedAt: number;
    };
    waiting: {
      message: string;
      reason: string;
    };
  };
}

export type Workload = DaemonSet | ReplicaSet | StatefulSet | Job | CronJob | Deployment;
