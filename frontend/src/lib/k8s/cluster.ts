import { OpPatch } from 'json-patch';
import React from 'react';
import { createRouteURL } from '../router';
import { timeAgo, useErrorState } from '../util';
import { useConnectApi } from '.';
import { ApiError, apiFactory, apiFactoryWithNamespace, post } from './apiProxy';
import CronJob from './cronJob';
import DaemonSet from './daemonSet';
import Deployment from './deployment';
import { KubeEvent } from './event';
import { IoK8sApiCoreV1Namespace } from './gen/model/IoK8sApiCoreV1Namespace';
import { IoK8sApimachineryPkgApisMetaV1ObjectMeta } from './gen/model/IoK8sApimachineryPkgApisMetaV1ObjectMeta';
import Job from './job';
import ReplicaSet from './replicaSet';
import StatefulSet from './statefulSet';

export interface Cluster {
  name: string;
  useToken?: boolean;
  [propName: string]: any;
}

export interface KubeObjectInterface {
  kind?: string;
  apiVersion?: string;
  metadata?: KubeMetadata;
  [otherProps: string]: any;
}

export interface StringDict {
  [key: string]: string;
}

export interface KubeMetadata extends IoK8sApimachineryPkgApisMetaV1ObjectMeta {}

export interface KubeOwnerReference {
  apiVersion: string;
  blockOwnerDeletion: boolean;
  controller: boolean;
  kind: string;
  name: string;
  uid: string;
}

export interface ApiListOptions {
  namespace?: string | string[];
}

// We have to define a KubeObject implementation here because the KubeObject
// class is defined within the function and therefore not inferable.
export interface KubeObjectIface<
  T extends KubeObjectInterface | KubeEvent | IoK8sApiCoreV1Namespace
> {
  apiList: (onList: (arg: InstanceType<KubeObjectIface<T>>[]) => void) => any;
  useApiList: (
    onList: (arg: InstanceType<KubeObjectIface<T>>[]) => void,
    onError?: (err: ApiError) => void,
    opts?: ApiListOptions
  ) => any;
  useApiGet: (
    onGet: (...args: any) => void,
    name: string,
    namespace?: string,
    onError?: (err: ApiError) => void
  ) => void;
  useList: (
    opts?: ApiListOptions
  ) => [any[], ApiError | null, (items: any[]) => void, (err: ApiError | null) => void];
  getErrorMessage: (err?: ApiError | null) => string | null;
  new (json: T): any;
  className: string;
  [prop: string]: any;
}

export function makeKubeObject<T extends KubeObjectInterface | KubeEvent | IoK8sApiCoreV1Namespace>(
  objectName: string
): KubeObjectIface<T> {
  class KubeObject {
    static apiEndpoint: ReturnType<typeof apiFactoryWithNamespace | typeof apiFactory>;
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
      return this.metadata?.name || '';
    }

    getNamespace() {
      return this.metadata?.namespace || '';
    }

    getCreationTs() {
      return this.metadata?.creationTimestamp || '';
    }

    getAge() {
      return timeAgo(this.getCreationTs() || '');
    }

    getValue(prop: string) {
      return prop;
      // return this.jsonData![prop];
    }

    get metadata(): any {
      return this.jsonData!.metadata;
    }

    get kind() {
      return this.jsonData!.kind;
    }

    static apiList<U extends KubeObject>(
      onList: (arg: U[]) => void,
      onError?: (err: ApiError) => void,
      opts?: {
        namespace?: string;
      }
    ) {
      const createInstance = (item: T) => this.create(item) as U;

      const args: any[] = [(list: T[]) => onList(list.map((item: T) => createInstance(item) as U))];

      if (this.apiEndpoint.isNamespaced) {
        args.unshift(opts?.namespace || null);
      }

      if (onError) {
        args.push(onError);
      }

      return this.apiEndpoint.list.bind(null, ...args);
    }

    static useApiList<U extends KubeObject>(
      onList: (...arg: any[]) => any,
      onError?: (err: ApiError) => void,
      opts?: ApiListOptions
    ) {
      const [objs, setObjs] = React.useState<{ [key: string]: U[] }>({});
      const listCallback = onList as (arg: U[]) => void;

      function onObjs(namespace: string, objList: U[]) {
        if (objList.length > 0) {
          let newObjs: typeof objs = {};
          // Set the objects so we have them for the next API response...
          setObjs(previousObjs => {
            newObjs = { ...previousObjs, [namespace || '']: objList };
            return newObjs;
          });

          let allObjs: U[] = [];
          Object.values(newObjs).map(currentObjs => {
            allObjs = allObjs.concat(currentObjs);
          });

          listCallback(allObjs);
        }
      }

      const listCalls = [];
      if (!!opts?.namespace) {
        let namespaces: string[] = [];
        if (typeof opts.namespace === 'string') {
          namespaces = [opts.namespace];
        } else if (Array.isArray(opts.namespace)) {
          namespaces = opts.namespace as string[];
        } else {
          throw Error('namespace should be a string or array of strings');
        }

        for (const namespace of namespaces) {
          listCalls.push(
            this.apiList(objList => onObjs(namespace, objList as U[]), onError, { namespace })
          );
        }
      } else {
        // If we don't have a namespace set, then we only have one API call
        // response to set and we return it right away.
        listCalls.push(this.apiList(listCallback, onError));
      }

      useConnectApi(...listCalls);
    }

    static useList<U extends KubeObject>(
      opts?: ApiListOptions
    ): [U[] | null, ApiError | null, (items: U[]) => void, (err: ApiError | null) => void] {
      const [objList, setObjList] = React.useState<U[] | null>(null);
      const [error, setError] = useErrorState(setObjList);

      function setList(items: U[] | null) {
        setObjList(items);
        if (items !== null) {
          setError(null);
        }
      }

      this.useApiList(setList, setError, opts);

      // Return getters and then the setters as the getters are more likely to be used with
      // this function.
      return [objList, error, setObjList, setError];
    }

    static create<U extends KubeObject>(this: new (arg: T) => U, item: T): U {
      return new this(item) as U;
    }

    static apiGet<U extends KubeObject>(
      onGet: (...args: any) => void,
      name: string,
      namespace?: string,
      onError?: (err: ApiError | null) => void
    ) {
      const createInstance = (item: T) => this.create(item) as U;
      const args: any[] = [name, (obj: T) => onGet(createInstance(obj))];

      if (this.apiEndpoint.isNamespaced) {
        args.unshift(namespace);
      }

      if (!!onError) {
        args.push(onError);
      }

      return this.apiEndpoint.get.bind(null, ...args);
    }

    static useApiGet<U extends KubeObject>(
      onGet: (...args: any) => any,
      name: string,
      namespace?: string,
      onError?: (err: ApiError | null) => void
    ) {
      // We do the type conversion here because we want to be able to use hooks that may not have
      // the exact signature as get callbacks.
      const getCallback = onGet as (item: U) => void;
      useConnectApi(this.apiGet(getCallback, name, namespace, onError));
    }

    private _class() {
      return this.constructor as typeof KubeObject;
    }

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

    scale(numReplicas: number) {
      const hasScaleApi = Object.keys(this._class().apiEndpoint).includes('scale');
      if (!hasScaleApi) {
        throw new Error(`This class has no scale API: ${this._class().className}`);
      }

      const spec = {
        replicas: numReplicas,
      };

      type ApiEndpointWithScale = {
        scale: {
          put: (data: { metadata: KubeMetadata; spec: { replicas: number } }) => Promise<any>;
        };
      };

      return (this._class().apiEndpoint as ApiEndpointWithScale).scale.put({
        metadata: this.metadata,
        spec,
      });
    }

    patch(body: OpPatch[]) {
      const patchMethod = this._class().apiEndpoint.patch;
      const args: Parameters<typeof patchMethod> = [body];

      if (this._class().apiEndpoint.isNamespaced) {
        args.push(this.getNamespace());
      }

      args.push(this.getName());
      return this._class().apiEndpoint.patch(...args);
    }

    async getAuthorization(verb: string) {
      const resourceAttrs: {
        name: string;
        verb: string;
        namespace?: string;
      } = {
        name: this.getName(),
        verb,
      };

      const namespace = this.getNamespace();
      if (!!namespace) {
        resourceAttrs['namespace'] = namespace;
      }

      const spec = {
        resourceAttributes: resourceAttrs,
      };

      const versions = ['v1', 'v1beta1'];
      for (let i = 0; i < versions.length; i++) {
        const version = versions[i];
        try {
          return await post(
            `/apis/authorization.k8s.io/${version}/selfsubjectaccessreviews`,
            {
              kind: 'SelfSubjectAccessReview',
              apiVersion: `authorization.k8s.io/${version}`,
              spec,
            },
            false
          );
        } catch (err) {
          // If this is the last attempt or the error is not 404, let it throw.
          if ((err as ApiError).status !== 404 || i === versions.length - 1) {
            throw err;
          }
        }
      }
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

export interface KubeContainerProbe {
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
