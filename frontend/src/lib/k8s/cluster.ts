import { OpPatch } from 'json-patch';
import _ from 'lodash';
import React from 'react';
import helpers from '../../helpers';
import { createRouteURL } from '../router';
import { getCluster, getClusterGroup, timeAgo, useErrorState } from '../util';
import { useConnectApi } from '.';
import { ApiError, apiFactory, apiFactoryWithNamespace, post, QueryParameters } from './apiProxy';
import CronJob from './cronJob';
import DaemonSet from './daemonSet';
import Deployment from './deployment';
import { KubeEvent } from './event';
import Job from './job';
import ReplicaSet from './replicaSet';
import StatefulSet from './statefulSet';

export const HEADLAMP_ALLOWED_NAMESPACES = 'headlamp.allowed-namespaces';

function getAllowedNamespaces(clusterName?: string) {
  const cluster = clusterName || getCluster();
  if (!cluster) {
    return [];
  }

  const clusterSettings = helpers.loadClusterSettings(cluster);
  return clusterSettings.allowedNamespaces || [];
}

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
  deletionTimestamp?: string;
  resourceVersion?: string;
  selfLink?: string;
  labels?: StringDict;
  annotations?: StringDict;
  ownerReferences?: KubeOwnerReference[];
  managedFields?: KubeManagedFields[];
}

export interface KubeOwnerReference {
  apiVersion: string;
  blockOwnerDeletion: boolean;
  controller: boolean;
  kind: string;
  name: string;
  uid: string;
}

export interface ApiListOptions extends QueryParameters {
  clusters?: string[];
  namespace?: string | string[];
}

export interface KubeManagedFields {
  apiVersion: string;
  fieldsType: string;
  fieldsV1: object;
  manager: string;
  operation: string;
  subresource: string;
  timestamp: string;
}

// We have to define a KubeObject implementation here because the KubeObject
// class is defined within the function and therefore not inferable.
export interface KubeObjectIface<T extends KubeObjectInterface | KubeEvent> {
  apiList: (onList: (arg: InstanceType<KubeObjectIface<T>>[]) => void) => any;
  useApiList: (
    onList: (arg: InstanceType<KubeObjectIface<T>>[]) => void,
    onError?: (err: ApiError, cluster?: string) => void,
    opts?: ApiListOptions
  ) => any;
  /**
   * List resource items or errors for each cluster currently being viewed.
   *
   * @param opts The options to use for listing (allows to restrict clusters or namespaces).
   * @returns An array with: an object corresponding clusters with resource items, an object corresponding clusters with errors (when items couldn't be fetched).
   */
  useListPerCluster: (
    opts?: ApiListOptions
  ) => [{ [clusterName: string]: any[] | null }, { [clusterName: string]: null | ApiError }];
  useApiGet: (
    onGet: (...args: any) => void,
    name: string,
    namespace?: string,
    onError?: (err: ApiError) => void
  ) => void;
  /**
   * List resource items or errors for all clusters currently being viewed.
   *
   * @param opts The options to use for listing (allows to restrict clusters or namespaces).
   * @returns An array with: an array of resource items, an error (when items couldn't be fetched), the resource list setter, the error list setter, the cluster->error mapping object.
   */
  useList: (
    opts?: ApiListOptions
  ) => [
    any[],
    ApiError | null,
    (items: any[]) => void,
    (err: ApiError | null) => void,
    { [cluster: string]: ApiError | null }
  ];
  useGet: (
    name: string,
    namespace?: string
  ) => [any, ApiError | null, (item: any) => void, (err: ApiError | null) => void];
  getErrorMessage: (err?: ApiError | null) => string | null;
  new (json: T): any;
  className: string;
  [prop: string]: any;
  getAuthorization?: (arg: string, resourceAttrs?: AuthRequestResourceAttrs) => any;
}

export interface AuthRequestResourceAttrs {
  name?: string;
  resource?: string;
  subresource?: string;
  namespace?: string;
}

export function makeKubeObject<T extends KubeObjectInterface | KubeEvent>(
  objectName: string
): KubeObjectIface<T> {
  class KubeObject {
    static apiEndpoint: ReturnType<typeof apiFactoryWithNamespace | typeof apiFactory>;
    jsonData: T | null = null;
    cluster: string = '';

    constructor(json: T) {
      this.jsonData = json;
    }

    static get className(): string {
      return objectName;
    }

    get detailsRoute(): string {
      return this._class().detailsRoute;
    }

    static get detailsRoute(): string {
      return this.className;
    }

    static get pluralName(): string {
      // This is a naive way to get the plural name of the object by default. It will
      // work in most cases, but for exceptions (like Ingress), we must override this.
      return this.className.toLowerCase() + 's';
    }

    get pluralName(): string {
      // In case we need to override the plural name in instances.
      return this._class().pluralName;
    }

    get listRoute(): string {
      return this._class().listRoute;
    }

    static get listRoute(): string {
      return this.detailsRoute + 's';
    }

    getDetailsLink() {
      const params = {
        namespace: this.getNamespace(),
        name: this.getName(),
        cluster: this.cluster,
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

    get isNamespaced() {
      return this._class().isNamespaced;
    }

    static get isNamespaced() {
      return this.apiEndpoint.isNamespaced;
    }

    static apiList<U extends KubeObject>(
      onList: (arg: U[]) => void,
      onError?: (err: ApiError) => void,
      opts?: {
        namespace?: string;
        queryParams?: QueryParameters;
        cluster?: string;
      }
    ) {
      const createInstance = (item: T) => this.create(item) as U;

      const args: any[] = [(list: T[]) => onList(list.map((item: T) => createInstance(item) as U))];

      if (this.apiEndpoint.isNamespaced) {
        args.unshift(opts?.namespace || null);
      }

      if (onError) {
        args.push(onError);
      } else {
        args.push(() => {});
      }

      const queryParams: QueryParameters = {};
      if (opts?.queryParams?.labelSelector) {
        queryParams['labelSelector'] = opts.queryParams.labelSelector;
      }
      if (opts?.queryParams?.fieldSelector) {
        queryParams['fieldSelector'] = opts.queryParams.fieldSelector;
      }
      args.push(queryParams);
      args.push(opts?.cluster);
      return this.apiEndpoint.list.bind(null, ...args);
    }

    static useApiList<U extends KubeObject>(
      onList: (...arg: any[]) => any,
      onError?: (err: ApiError, cluster?: string) => void,
      opts?: ApiListOptions
    ) {
      const setObjs = React.useState<{ [key: string]: { [key: string]: U[] } }>({})[1];
      // Keep a copy of the options so we can re-run the API call if the options change more
      // efficiently.
      const [apiListOpts, setApiListOpts] = React.useState<ApiListOptions | undefined>(opts);

      const includeCluster = !!opts?.clusters;

      function onObjs(cluster: string, namespace: string, objList: U[]) {
        // Set the objects so we have them for the next API response...
        setObjs(clusters => {
          const newClusters = { ...clusters };
          const previousObjs = newClusters[cluster] || {};
          const objsPerNamespace = { ...previousObjs, [namespace || '']: objList };
          newClusters[cluster] = objsPerNamespace;

          const allObjs: U[] = Object.values(objsPerNamespace).flat();

          // @todo: This branch use of the list callback is not very clear, so we should
          // find a way to make this more explicit.
          // Also, the reason we call this function from inside the state setter is because
          // it's the one moment where we have the new list of objects but also the cluster
          // for which they were fetched.
          if (includeCluster) {
            onList(allObjs, cluster);
          } else {
            onList(allObjs);
          }

          return newClusters;
        });
      }

      React.useEffect(() => {
        // Avoid triggering more API calls if the options haven't changed.
        if (!_.isEqual(opts, apiListOpts)) {
          setApiListOpts(opts);
        }
      }, [opts]);

      const onErrForCluster = (err: ApiError, cluster?: string) => {
        onError && onError(err, cluster);
      };

      const listCalls = React.useMemo(() => {
        const apiCalls = [];
        let namespaces: string[] = [];
        const { namespace, clusters = getClusterGroup(['']), ...queryParams } = apiListOpts || {};

        if (!!namespace) {
          if (typeof namespace === 'string') {
            namespaces = [namespace];
          } else if (Array.isArray(namespace)) {
            namespaces = namespace as string[];
          } else {
            throw Error('namespace should be a string or array of strings');
          }
        }
        for (const cluster of clusters) {
          // If the request itself has no namespaces set, we check whether to apply the
          // allowed namespaces.
          if (namespaces.length === 0 && this.isNamespaced) {
            namespaces = getAllowedNamespaces(cluster);
          }

          if (namespaces.length > 0) {
            // If we have a namespace set, then we have to make an API call for each
            // namespace and then set the objects once we have all of the responses.
            for (const namespace of namespaces) {
              apiCalls.push(
                this.apiList(
                  objList => onObjs(cluster, namespace, objList as U[]),
                  (err: ApiError) => onErrForCluster(err, cluster),
                  {
                    namespace,
                    queryParams,
                    cluster,
                  }
                )
              );
            }
          } else {
            // If we don't have a namespace set, then we only have one API call
            // response to set and we return it right away.
            apiCalls.push(
              this.apiList(
                (objs: U[]) => onObjs(cluster, '', objs),
                (err: ApiError) => onErrForCluster(err, cluster),
                {
                  queryParams,
                  cluster,
                }
              )
            );
          }
        }

        return apiCalls;
      }, [apiListOpts]);

      useConnectApi(...listCalls);
    }

    static useListPerCluster<U extends KubeObject>(
      opts?: ApiListOptions
    ): [{ [clusterName: string]: U[] | null }, { [clusterName: string]: null | ApiError }] {
      const clusters = opts?.clusters || getClusterGroup(['']);
      const [objList, setObjList] = React.useState<{ [clusterName: string]: U[] | null }>(() => {
        const clusterObjects: { [clusterName: string]: U[] | null } = {};
        for (const cluster of clusters) {
          clusterObjects[cluster] = null;
        }
        return clusterObjects;
      });
      const [error, setError] = React.useState<{ [clusterName: string]: null | ApiError }>(() => {
        const clusterObjects: { [clusterName: string]: null | ApiError } = {};
        for (const cluster of clusters) {
          clusterObjects[cluster] = null;
        }
        return clusterObjects;
      });

      const createInstance = (item: T) => this.create(item) as U;

      function setList(items: T[] | null, cluster: string) {
        const objList =
          items?.map((item: T) => {
            const obj = createInstance(item);
            obj.cluster = cluster;
            return obj;
          }) || null;
        setListofObjs(cluster, objList);
      }

      function setListofObjs(cluster: string, objList: U[] | null) {
        // Set the objects in the format clusterName->objectList.
        setObjList(objsPerClusters => ({
          ...objsPerClusters,
          [cluster]: objList,
        }));

        // If there was a list of objects (even if empty) returned, then we
        // ensure there is no error set for this cluster.
        if (objList !== null) {
          setError(errsPerCluster => {
            const newErrors = { ...errsPerCluster };
            delete newErrors[cluster];
            return newErrors;
          });
        }
      }

      function setErr(cluster: string, err: ApiError | null) {
        // Set the errors in the format clusterName->error.
        setError(errsPerCluster => ({
          ...errsPerCluster,
          [cluster]: err,
        }));
      }

      const apiOpts = { ...opts, clusters };
      this.useApiList(setList, (err, cluster) => setErr(cluster || '', err), apiOpts);

      return [objList, error];
    }

    //@todo: We should deprecate this because of returning a list and just return an object...
    static useList<U extends KubeObject>(
      opts?: ApiListOptions
    ): [
      U[] | null,
      ApiError | null,
      (items: U[]) => void,
      (err: ApiError | null) => void,
      { [cluster: string]: ApiError | null }
    ] {
      const [items, setItems] = React.useState<U[] | null>(null);
      const [error, seterror] = React.useState<ApiError | null>(null);
      const [itemsPerCluster, errorsPerCluster] = this.useListPerCluster(opts);

      React.useEffect(() => {
        // Flatten the objects per cluster into a single list of objects.
        setItems(() => {
          const objsFlat = Object.values(itemsPerCluster).flat();
          const objs = objsFlat.filter(i => i !== null) as U[];

          const hasOnlyNullValues = objs.length === 0 && objsFlat.indexOf(null) !== -1;
          if (hasOnlyNullValues) {
            return null;
          }

          return objs;
        });

        // Flatten the errors per cluster into a single error.
        seterror(() => {
          const errs = Object.values(errorsPerCluster).filter(i => i !== null);
          const hasValues = errs.length > 0;
          if (!hasValues) {
            return null;
          }

          return errs[0];
        });
      }, [itemsPerCluster, errorsPerCluster]);
      return [items, error, setItems, seterror, errorsPerCluster];
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

    static useGet<U extends KubeObject>(
      name: string,
      namespace?: string
    ): [U | null, ApiError | null, (items: U) => void, (err: ApiError | null) => void] {
      const [obj, setObj] = React.useState<U | null>(null);
      const [error, setError] = useErrorState(setObj);

      function onGet(item: U | null) {
        // Only set the object if we have we have a different one.
        if (!!obj && !!item && obj.metadata.resourceVersion === item.metadata.resourceVersion) {
          return;
        }

        setObj(item);
        if (item !== null) {
          setError(null);
        }
      }

      function onError(err: ApiError | null) {
        if (
          error === err ||
          (!!error && !!err && error.message === err.message && error.status === err.status)
        ) {
          return;
        }

        setError(err);
      }

      this.useApiGet(onGet, name, namespace, onError);

      // Return getters and then the setters as the getters are more likely to be used with
      // this function.
      return [obj, error, setObj, setError];
    }

    private _class() {
      return this.constructor as typeof KubeObject;
    }

    delete() {
      const args: string[] = [this.getName()];
      if (this.isNamespaced) {
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

      if (this.isNamespaced) {
        args.push(this.getNamespace());
      }

      args.push(this.getName());
      return this._class().apiEndpoint.patch(...args);
    }

    static async getAuthorization(verb: string, reqResourseAttrs?: AuthRequestResourceAttrs) {
      const resourceAttrs: AuthRequestResourceAttrs & {
        verb: string;
      } = {
        verb,
        ...reqResourseAttrs,
      };

      if (!resourceAttrs.resource) {
        resourceAttrs['resource'] = this.pluralName;
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

    async getAuthorization(verb: string, reqResourseAttrs?: AuthRequestResourceAttrs) {
      const resourceAttrs: AuthRequestResourceAttrs & {
        name: string;
        verb: string;
      } = {
        name: this.getName(),
        verb,
        ...reqResourseAttrs,
      };

      const namespace = this.getNamespace();
      if (!resourceAttrs.namespace && !!namespace) {
        resourceAttrs['namespace'] = namespace;
      }

      return this._class().getAuthorization(verb, resourceAttrs);
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

export type Time = number | string | null;

export interface KubeCondition {
  type: string;
  status: string;
  lastProbeTime: Time;
  lastTransitionTime?: Time;
  lastUpdateTime?: Time;
  reason?: string;
  message?: string;
}

export interface KubeContainer {
  name: string;
  image: string;
  command?: string[];
  args?: string[];
  ports?: {
    name?: string;
    containerPort: number;
    protocol: string;
  }[];
  resources?: {
    limits?: {
      cpu?: string;
      memory?: string;
    };
    requests?: {
      cpu?: string;
      memory?: string;
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
  }[];
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

export interface ContainerState {
  running: {
    startedAt: string;
  };
  terminated: {
    containerID: string;
    exitCode: number;
    finishedAt: string;
    message?: string;
    reason: string;
    signal?: number;
    startedAt: string;
  };
  waiting: {
    message?: string;
    reason: string;
  };
}

export interface KubeContainerStatus {
  containerID?: string;
  image: string;
  imageID: string;
  name: string;
  ready: boolean;
  restartCount: number;
  lastState: Partial<ContainerState>;
  state: Partial<ContainerState>;
  started?: boolean;
}

export type Workload = DaemonSet | ReplicaSet | StatefulSet | Job | CronJob | Deployment;
