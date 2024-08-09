import { OpPatch } from 'json-patch';
import { JSONPath } from 'jsonpath-plus';
import { cloneDeep, unset } from 'lodash';
import React from 'react';
import helpers from '../../helpers';
import { getCluster } from '../cluster';
import { createRouteURL } from '../router';
import { timeAgo, useErrorState } from '../util';
import { useCluster, useConnectApi } from '.';
import { ApiError, apiFactory, apiFactoryWithNamespace, post, QueryParameters } from './apiProxy';
import {
  ApiListOptions,
  ApiListSingleNamespaceOptions,
  AuthRequestResourceAttrs,
  KubeMetadata,
  KubeObjectClass,
  KubeObjectInterface,
} from './cluster';
import { KubeEvent } from './event';

function getAllowedNamespaces() {
  const cluster = getCluster();
  if (!cluster) {
    return [];
  }

  const clusterSettings = helpers.loadClusterSettings(cluster);
  return clusterSettings.allowedNamespaces || [];
}

export class KubeObject<T extends KubeObjectInterface | KubeEvent = any> {
  static apiEndpoint: ReturnType<typeof apiFactoryWithNamespace | typeof apiFactory>;
  static readOnlyFields: string[] = [];
  static objectName: string;

  jsonData: T;
  readonly _clusterName: string;

  constructor(json: T) {
    this.jsonData = json;
    this._clusterName = getCluster() || '';
  }

  static get className(): string {
    return this.objectName;
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
    return (this.jsonData as Record<string, any>)![prop];
  }

  get metadata() {
    return this.jsonData.metadata;
  }

  get kind() {
    return this.jsonData.kind;
  }

  get isNamespaced() {
    return this._class().isNamespaced;
  }

  static get isNamespaced() {
    return this.apiEndpoint.isNamespaced;
  }

  getEditableObject() {
    const fieldsToRemove = this._class().readOnlyFields;
    const code = this.jsonData ? cloneDeep(this.jsonData) : {};

    fieldsToRemove?.forEach(path => {
      JSONPath({
        path,
        json: code,
        callback: (result, type, fullPayload) => {
          if (fullPayload.parent && fullPayload.parentProperty) {
            delete fullPayload.parent[fullPayload.parentProperty];
          }
        },
        resultType: 'all',
      });
    });

    return code;
  }

  // @todo: apiList has 'any' return type.
  /**
   * Returns the API endpoint for this object.
   *
   * @param onList - Callback function to be called when the list is retrieved.
   * @param onError - Callback function to be called when an error occurs.
   * @param opts - Options to be passed to the API endpoint.
   *
   * @returns The API endpoint for this object.
   */
  static apiList<U extends KubeObjectClass>(
    this: U,
    onList: (arg: InstanceType<U>[]) => void,
    onError?: (err: ApiError) => void,
    opts?: ApiListSingleNamespaceOptions
  ) {
    const createInstance = (item: any): any => this.create(item);

    const args: any[] = [(list: any[]) => onList(list.map((item: any) => createInstance(item)))];

    if (this.apiEndpoint.isNamespaced) {
      args.unshift(opts?.namespace || null);
    }

    args.push(onError);

    const queryParams: QueryParameters = {};
    if (opts?.queryParams?.labelSelector) {
      queryParams['labelSelector'] = opts.queryParams.labelSelector;
    }
    if (opts?.queryParams?.fieldSelector) {
      queryParams['fieldSelector'] = opts.queryParams.fieldSelector;
    }
    if (opts?.queryParams?.limit) {
      queryParams['limit'] = opts.queryParams.limit;
    }
    args.push(queryParams);

    args.push(opts?.cluster);

    return this.apiEndpoint.list.bind(null, ...args);
  }

  static useApiList<U extends KubeObjectClass>(
    this: U,
    onList: (...arg: any[]) => any,
    onError?: (err: ApiError) => void,
    opts?: ApiListOptions
  ) {
    const [objs, setObjs] = React.useState<{ [key: string]: U[] }>({});
    const listCallback = onList as (arg: any[]) => void;

    function onObjs(namespace: string, objList: U[]) {
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

    const listCalls = [];
    const queryParams = cloneDeep(opts);
    let namespaces: string[] = [];
    unset(queryParams, 'namespace');

    const cluster = opts?.cluster;

    if (!!opts?.namespace) {
      if (typeof opts.namespace === 'string') {
        namespaces = [opts.namespace];
      } else if (Array.isArray(opts.namespace)) {
        namespaces = opts.namespace as string[];
      } else {
        throw Error('namespace should be a string or array of strings');
      }
    }

    // If the request itself has no namespaces set, we check whether to apply the
    // allowed namespaces.
    if (namespaces.length === 0 && this.isNamespaced) {
      namespaces = getAllowedNamespaces();
    }

    if (namespaces.length > 0) {
      // If we have a namespace set, then we have to make an API call for each
      // namespace and then set the objects once we have all of the responses.
      for (const namespace of namespaces) {
        listCalls.push(
          this.apiList(objList => onObjs(namespace, objList as U[]), onError, {
            namespace,
            queryParams,
            cluster,
          })
        );
      }
    } else {
      // If we don't have a namespace set, then we only have one API call
      // response to set and we return it right away.
      listCalls.push(this.apiList(listCallback, onError, { queryParams, cluster }));
    }

    useConnectApi(...listCalls);
  }

  static useList<U extends KubeObjectClass>(
    this: U,
    opts?: ApiListOptions
  ): [
    InstanceType<U>[] | null,
    ApiError | null,
    (items: InstanceType<U>[]) => void,
    (err: ApiError | null) => void
  ] {
    const [objList, setObjList] = React.useState<InstanceType<U>[] | null>(null);
    const [error, setError] = useErrorState(setObjList);
    const currentCluster = useCluster();
    const cluster = opts?.cluster || currentCluster;

    // Reset the list and error when the cluster changes.
    React.useEffect(() => {
      setObjList(null);
      setError(null);
    }, [cluster]);

    function setList(items: InstanceType<U>[] | null) {
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

  static create<T extends typeof KubeObject<any>>(this: T, item: ConstructorParameters<T>[0]) {
    return new this(item) as InstanceType<T>;
  }

  static apiGet<U extends KubeObjectClass>(
    this: U,
    onGet: (...args: any) => void,
    name: string,
    namespace?: string,
    onError?: (err: ApiError | null) => void,
    opts?: {
      queryParams?: QueryParameters;
      cluster?: string;
    }
  ) {
    const createInstance = (item: any) => this.create(item);
    const args: any[] = [name, (obj: any) => onGet(createInstance(obj))];

    if (this.apiEndpoint.isNamespaced) {
      args.unshift(namespace);
    }

    args.push(onError);
    args.push(opts?.queryParams);
    args.push(opts?.cluster);

    return this.apiEndpoint.get.bind(null, ...args);
  }

  static useApiGet<U extends KubeObjectClass>(
    this: U,
    onGet: (item: InstanceType<U> | null) => any,
    name: string,
    namespace?: string,
    onError?: (err: ApiError | null) => void,
    opts?: {
      queryParams?: QueryParameters;
      cluster?: string;
    }
  ) {
    // We do the type conversion here because we want to be able to use hooks that may not have
    // the exact signature as get callbacks.
    const getCallback = onGet as (item: U) => void;
    useConnectApi(this.apiGet(getCallback, name, namespace, onError, opts));
  }

  static useGet<U extends KubeObjectClass>(
    this: U,
    name: string,
    namespace?: string,
    opts?: {
      queryParams?: QueryParameters;
      cluster?: string;
    }
  ): [
    InstanceType<U> | null,
    ApiError | null,
    (items: InstanceType<U>) => void,
    (err: ApiError | null) => void
  ] {
    const [obj, setObj] = React.useState<InstanceType<U> | null>(null);
    const [error, setError] = useErrorState(setObj);

    function onGet(item: InstanceType<U> | null) {
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

    this.useApiGet(onGet, name, namespace, onError, opts);

    // Return getters and then the setters as the getters are more likely to be used with
    // this function.
    return [obj, error, setObj, setError];
  }

  _class() {
    return this.constructor as KubeObjectClass;
  }

  delete() {
    const args: string[] = [this.getName()];
    if (this.isNamespaced) {
      args.unshift(this.getNamespace()!);
    }

    return this._class().apiEndpoint.delete(...args, {}, this._clusterName);
  }

  update(data: KubeObjectInterface) {
    return this._class().apiEndpoint.put(data, {}, this._clusterName);
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
        patch: (
          body: { spec: { replicas: number } },
          metadata: KubeMetadata,
          clusterName?: string
        ) => Promise<any>;
      };
    };

    return (this._class().apiEndpoint as ApiEndpointWithScale).scale.patch(
      {
        spec,
      },
      this.metadata,
      this._clusterName
    );
  }

  patch(body: OpPatch[]) {
    const patchMethod = this._class().apiEndpoint.patch;
    const args: Parameters<typeof patchMethod> = [body];

    if (this.isNamespaced) {
      args.push(this.getNamespace());
    }

    args.push(this.getName());
    return this._class().apiEndpoint.patch(...args, {}, this._clusterName);
  }

  /** Performs a request to check if the user has the given permission.
   * @param reResourceAttrs The attributes describing this access request. See https://kubernetes.io/docs/reference/kubernetes-api/authorization-resources/self-subject-access-review-v1/#SelfSubjectAccessReviewSpec .
   * @returns The result of the access request.
   */
  static async fetchAuthorization(reqResourseAttrs?: AuthRequestResourceAttrs) {
    // @todo: We should get the API info from the API endpoint.
    const authApiVersions = ['v1', 'v1beta1'];
    for (let j = 0; j < authApiVersions.length; j++) {
      const authVersion = authApiVersions[j];

      try {
        return await post(
          `/apis/authorization.k8s.io/${authVersion}/selfsubjectaccessreviews`,
          {
            kind: 'SelfSubjectAccessReview',
            apiVersion: `authorization.k8s.io/${authVersion}`,
            spec: {
              resourceAttributes: reqResourseAttrs,
            },
          },
          false
        );
      } catch (err) {
        // If this is the last attempt or the error is not 404, let it throw.
        if ((err as ApiError).status !== 404 || j === authApiVersions.length - 1) {
          throw err;
        }
      }
    }
  }

  static async getAuthorization(verb: string, reqResourseAttrs?: AuthRequestResourceAttrs) {
    const resourceAttrs: AuthRequestResourceAttrs = {
      verb,
      ...reqResourseAttrs,
    };

    if (!resourceAttrs.resource) {
      resourceAttrs['resource'] = this.pluralName;
    }

    // @todo: We should get the API info from the API endpoint.

    // If we already have the group, version, and resource, then we can make the request
    // without trying the API info, which may have several versions and thus be less optimal.
    if (!!resourceAttrs.group && !!resourceAttrs.version && !!resourceAttrs.resource) {
      return this.fetchAuthorization(resourceAttrs);
    }

    // If we don't have the group, version, and resource, then we have to try all of the
    // API info versions until we find one that works.
    const apiInfo = this.apiEndpoint.apiInfo;
    for (let i = 0; i < apiInfo.length; i++) {
      const { group, version, resource } = apiInfo[i];
      // We only take from the details from the apiInfo if they're missing from the resourceAttrs.
      // The idea is that, since this function may also be called from the instance's getAuthorization,
      // it may already have the details from the instance's API version.
      const attrs = { ...resourceAttrs };

      if (!!attrs.resource) {
        attrs.resource = resource;
      }
      if (!!attrs.group) {
        attrs.group = group;
      }
      if (!!attrs.version) {
        attrs.version = version;
      }

      let authResult;

      try {
        authResult = await this.fetchAuthorization(attrs);
      } catch (err) {
        // If this is the last attempt or the error is not 404, let it throw.
        if ((err as ApiError).status !== 404 || i === apiInfo.length - 1) {
          throw err;
        }
      }

      if (!!authResult) {
        return authResult;
      }
    }
  }

  async getAuthorization(verb: string, reqResourseAttrs?: AuthRequestResourceAttrs) {
    const resourceAttrs: AuthRequestResourceAttrs = {
      name: this.getName(),
      verb,
      ...reqResourseAttrs,
    };

    const namespace = this.getNamespace();
    if (!resourceAttrs.namespace && !!namespace) {
      resourceAttrs['namespace'] = namespace;
    }

    // Set up the group and version from the object's API version.
    let [group, version] = this.jsonData?.apiVersion?.split('/') ?? [];
    if (!version) {
      version = group;
      group = '';
    }

    if (!!group) {
      resourceAttrs['group'] = group;
    }
    if (!!version) {
      resourceAttrs['version'] = version;
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
