import { OpPatch } from 'json-patch';
import { cloneDeep, unset } from 'lodash';
import React from 'react';
import helpers from '../../helpers';
import { createRouteURL } from '../router';
import { getCluster, timeAgo, useErrorState } from '../util';
import { useCluster, useConnectApi } from '.';
import { ApiError, apiFactory, apiFactoryWithNamespace, post, QueryParameters } from './apiProxy';
import CronJob from './cronJob';
import DaemonSet from './daemonSet';
import Deployment from './deployment';
import { KubeEvent } from './event';
import Job from './job';
import ReplicaSet from './replicaSet';
import StatefulSet from './statefulSet';

export const HEADLAMP_ALLOWED_NAMESPACES = 'headlamp.allowed-namespaces';

function getAllowedNamespaces() {
  const cluster = getCluster();
  if (!cluster) {
    return [];
  }

  const clusterSettings = helpers.loadClusterSettings(cluster);
  return clusterSettings.allowedNamespaces || [];
}

export interface Cluster {
  name: string;
  useToken?: boolean;
  /**
   * Either 'oidc' or ''. '' means unknown.
   */
  auth_type: string;
  [propName: string]: any;
}

/**
 * This is the base interface for all Kubernetes resources, i.e. it contains fields
 * that all Kubernetes resources have.
 */
export interface KubeObjectInterface {
  /**
   * Kind is a string value representing the REST resource this object represents.
   * Servers may infer this from the endpoint the client submits requests to.
   *
   * In CamelCase.
   *
   * Cannot be updated.
   *
   * @see {@link https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds | more info}
   */
  kind: string;
  apiVersion?: string;
  metadata: KubeMetadata;
  [otherProps: string]: any;
}

export interface StringDict {
  [key: string]: string;
}

/**
 * KubeMetadata contains the metadata that is common to all Kubernetes objects.
 *
 * @see {@link https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md#metadata | Metadata} for more details.
 */
export interface KubeMetadata {
  /**
   * A map of string keys and values that can be used by external tooling to store and
   * retrieve arbitrary metadata about this object
   * @see {@link https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations/ | annotations docs} for more details.
   */
  annotations?: StringDict;
  /**
   * An RFC 3339 date of the date and time an object was created
   */
  creationTimestamp: string;
  /**
   * Number of seconds allowed for this object to gracefully terminate before it
   * will be removed from the system. Only set when deletionTimestamp is also set.
   * May only be shortened.
   * Read-only.
   */
  deletionGracePeriodSeconds?: number;
  /**
   * An RFC 3339 date of the date and time after which this resource will be deleted.
   * This field is set by the server when a graceful deletion is requested by the
   * user, and is not directly settable by a client. The resource will be deleted
   * (no longer visible from resource lists, and not reachable by name) after the
   * time in this field except when the object has a finalizer set. In case the
   * finalizer is set the deletion of the object is postponed at least until the
   * finalizer is removed. Once the deletionTimestamp is set, this value may not
   * be unset or be set further into the future, although it may be shortened or
   * the resource may be deleted prior to this time.
   */
  deletionTimestamp?: string;
  /**
   * Must be empty before the object is deleted from the registry. Each entry is
   * an identifier for the responsible component that will remove the entry from
   * the list. If the deletionTimestamp of the object is non-nil, entries in this
   * list can only be removed. Finalizers may be processed and removed in any order.
   * Order is NOT enforced because it introduces significant risk of stuck finalizers.
   * finalizers is a shared field, any actor with permission can reorder it.
   * If the finalizer list is processed in order, then this can lead to a situation
   * in which the component responsible for the first finalizer in the list is
   * waiting for a signal (field value, external system, or other) produced by a
   * component responsible for a finalizer later in the list, resulting in a deadlock.
   * Without enforced ordering finalizers are free to order amongst themselves and
   * are not vulnerable to ordering changes in the list.
   *
   * patch strategy: merge
   */
  finalizers?: string[];
  /**
   * GenerateName is an optional prefix, used by the server, to generate a unique
   * name ONLY IF the Name field has not been provided. If this field is used,
   * the name returned to the client will be different than the name passed.
   * This value will also be combined with a unique suffix. The provided value
   * has the same validation rules as the Name field, and may be truncated by
   * the length of the suffix required to make the value unique on the server.
   * If this field is specified and the generated name exists, the server will
   * return a 409. Applied only if Name is not specified.
   *
   * @see {@link https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#idempotency | more info}
   */
  generateName?: string;
  /**
   * A sequence number representing a specific generation of the desired state.
   * Populated by the system.
   * Read-only.
   */
  generation?: number;
  /**
   * A map of string keys and values that can be used to organize and categorize objects
   *
   * @see https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/
   */
  labels?: StringDict;
  /**
   * Maps workflow-id and version to the set of fields that are managed by that workflow.
   * This is mostly for internal housekeeping, and users typically shouldn't need to set
   * or understand this field. A workflow can be the user's name, a controller's name, or
   * the name of a specific apply path like "ci-cd". The set of fields is always in the
   * version that the workflow used when modifying the object.
   */
  managedFields?: KubeManagedFieldsEntry[];
  /**
   * Uniquely identifies this object within the current namespace (see the identifiers docs).
   * This value is used in the path when retrieving an individual object.
   *
   * @see {@link https://kubernetes.io/docs/concepts/overview/working-with-objects/names/ | Names docs} for more details.
   */
  name: string;
  /**
   * Namespace defines the space within which each name must be unique. An empty namespace is
   * equivalent to the "default" namespace, but "default" is the canonical representation.
   * Not all objects are required to be scoped to a namespace - the value of this field for
   * those objects will be empty. Must be a DNS_LABEL. Cannot be updated.
   *
   * @see {@link https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/ | Namespaces docs} for more details.
   */
  namespace?: string;
  /**
   * List of objects depended by this object. If ALL objects in the list have been deleted,
   * this object will be garbage collected. If this object is managed by a controller,
   * then an entry in this list will point to this controller, with the controller field
   * set to true. There cannot be more than one managing controller.
   */
  ownerReferences?: KubeOwnerReference[];
  /**
   * Identifies the internal version of this object that can be used by clients to
   * determine when objects have changed. This value MUST be treated as opaque by
   * clients and passed unmodified back to the server. Clients should not assume
   * that the resource version has meaning across namespaces, different kinds of
   * resources, or different servers.
   *
   * @see {@link https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md#concurrency-control-and-consistency | concurrency control docs} for more details
   */
  resourceVersion?: string;
  /**
   * Deprecated: selfLink is a legacy read-only field that is no longer populated by the system.
   */
  selfLink?: string;
  /**
   * UID is the unique in time and space value for this object. It is typically generated by
   * the server on successful creation of a resource and is not allowed to change on PUT
   * operations. Populated by the system. Read-only.
   *
   * @see {@link https://kubernetes.io/docs/concepts/overview/working-with-objects/names#uids | UIDs docs} for more details.
   */
  uid: string;
}

export interface KubeOwnerReference {
  /** API version of the referent. */
  apiVersion: string;
  /**
   * If true, AND if the owner has the "foregroundDeletion" finalizer, then the owner cannot
   * be deleted from the key-value store until this reference is removed.
   *
   * @see {@link https://kubernetes.io/docs/concepts/architecture/garbage-collection/#foreground-deletion | foreground deletion}
   * for how the garbage collector interacts with this field and enforces the foreground deletion.
   *
   * Defaults to false. To set this field, a user needs "delete" permission of the owner,
   * otherwise 422 (Unprocessable Entity) will be returned.
   *
   */
  blockOwnerDeletion: boolean;
  /** If true, this reference points to the managing controller. */
  controller: boolean;
  /** Kind of the referent. */
  kind: string;
  /** Name of the referent. */
  name: string;
  /** UID of the referent. */
  uid: string;
}

export interface ApiListOptions extends QueryParameters {
  namespace?: string | string[];
}

/**
 * ManagedFieldsEntry is a workflow-id, a FieldSet and the group version of the
 * resource that the fieldset applies to.
 */
export interface KubeManagedFieldsEntry {
  /**
   * APIVersion defines the version of this resource that this field set applies to.
   * The format is "group/version" just like the top-level APIVersion field.
   * It is necessary to track the version of a field set because it cannot be
   * automatically converted.
   */
  apiVersion: string;
  /**
   * FieldsType is the discriminator for the different fields format and version.
   * There is currently only one possible value: "FieldsV1"
   */
  fieldsType: string;
  /**
   * FieldsV1 holds the first JSON version format as described in the "FieldsV1" type.
   */
  fieldsV1: object;
  /**
   * Manager is an identifier of the workflow managing these fields.
   */
  manager: string;
  /**
   * Operation is the type of operation which lead to this ManagedFieldsEntry being
   * created. The only valid values for this field are 'Apply' and 'Update'.
   */
  operation: string;
  /**
   * Subresource is the name of the subresource used to update that object, or empty
   * string if the object was updated through the main resource. The value of this
   * field is used to distinguish between managers, even if they share the same name.
   * For example, a status update will be distinct from a regular update using the
   * same manager name. Note that the APIVersion field is not related to the
   * Subresource field and it always corresponds to the version of the main resource.
   */
  subresource: string;
  /**
   * Time is the timestamp of when the ManagedFields entry was added.The timestamp
   * will also be updated if a field is added, the manager changes any of the owned
   * fields value or removes a field. The timestamp does not update when a field is
   * removed from the entry because another manager took it over.
   */
  timestamp: string;
}

/**
 * @deprecated For backwards compatibility, please use KubeManagedFieldsEntry
 */
export interface KubeManagedFields extends KubeManagedFieldsEntry {}

// We have to define a KubeObject implementation here because the KubeObject
// class is defined within the function and therefore not inferable.
export interface KubeObjectIface<T extends KubeObjectInterface | KubeEvent> {
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
  version?: string;
  group?: string;
  verb?: string;
}

// @todo: uses of makeKubeObject somehow end up in an 'any' type.

/**
 * @returns A KubeObject implementation for the given object name.
 *
 * @param objectName The name of the object to create a KubeObject implementation for.
 */
export function makeKubeObject<T extends KubeObjectInterface | KubeEvent>(
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
    static apiList<U extends KubeObject>(
      onList: (arg: U[]) => void,
      onError?: (err: ApiError) => void,
      opts?: {
        namespace?: string;
        queryParams?: QueryParameters;
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
            })
          );
        }
      } else {
        // If we don't have a namespace set, then we only have one API call
        // response to set and we return it right away.
        listCalls.push(this.apiList(listCallback, onError, { queryParams }));
      }

      useConnectApi(...listCalls);
    }

    static useList<U extends KubeObject>(
      opts?: ApiListOptions
    ): [U[] | null, ApiError | null, (items: U[]) => void, (err: ApiError | null) => void] {
      const [objList, setObjList] = React.useState<U[] | null>(null);
      const [error, setError] = useErrorState(setObjList);
      const cluster = useCluster();

      // Reset the list and error when the cluster changes.
      React.useEffect(() => {
        setObjList(null);
        setError(null);
      }, [cluster]);

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

    /** Performs a request to check if the user has the given permission.
     * @param reResourceAttrs The attributes describing this access request. See https://kubernetes.io/docs/reference/kubernetes-api/authorization-resources/self-subject-access-review-v1/#SelfSubjectAccessReviewSpec .
     * @returns The result of the access request.
     */
    private static async fetchAuthorization(reqResourseAttrs?: AuthRequestResourceAttrs) {
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
      let [group, version] = this.jsonData?.apiVersion.split('/');
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

  return KubeObject as KubeObjectIface<T>;
}

export type KubeObjectClass = ReturnType<typeof makeKubeObject>;
export type KubeObject = InstanceType<KubeObjectClass>;

export type Time = number | string | null;

// @todo: There are different Condition types, including PodCondition, NodeCondition, etc.
// We should have appropriate types for each of them, because they can be slightly different.
// eg. DaemonSetCondition does not have lastProbeTime.
// https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.27/#podcondition-v1-core
// https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.27/#nodecondition-v1-core

export interface KubeCondition {
  /** Last time we probed the condition. */
  lastProbeTime: Time;
  lastTransitionTime?: Time;
  lastUpdateTime?: Time;
  message?: string;
  /** Unique, one-word, CamelCase reason for the condition's last transition. */
  reason?: string;
  /** Status of the condition, one of True, False, Unknown. */
  status: string;
  type: string;
}

/**
 *
 * @link https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.27/#container-v1-core
 */
export interface KubeContainer {
  /**
   * Arguments to the entrypoint. The container image's CMD is used if this is not provided.
   * Variable references $(VAR_NAME) are expanded using the container's environment.
   * If a variable cannot be resolved, the reference in the input string will be unchanged.
   * Double $$ are reduced to a single $, which allows for escaping the $(VAR_NAME)
   * syntax: i.e. "$$(VAR_NAME)" will produce the string literal "$(VAR_NAME)".
   * Escaped references will never be expanded, regardless of whether the variable exists or not.
   * Cannot be updated.
   *
   * @see {@link https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell | more information}
   */
  args?: string[];
  /**
   * Entrypoint array. Not executed within a shell. The container image's ENTRYPOINT is used if
   * this is not provided. Variable references $(VAR_NAME) are expanded using the container's environment.
   * If a variable cannot be resolved, the reference in the input string will be unchanged.
   * Double $$ are reduced to a single $, which allows for escaping the $(VAR_NAME)
   * syntax: i.e. "$$(VAR_NAME)" will produce the string literal "$(VAR_NAME)".
   * Escaped references will never be expanded, regardless of whether the variable exists or not.
   * Cannot be updated.
   *
   * @see {@link https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell | more information}
   */
  command?: string[];

  /** List of environment variables to set in the container. Cannot be updated. */
  env?: {
    /** Name of the environment variable. Must be a C_IDENTIFIER. */
    name: string;
    /**
     * Variable references $(VAR_NAME) are expanded using the previously defined environment variables
     * in the container and any service environment variables. If a variable cannot be resolved, the
     * reference in the input string will be unchanged. Double $$ are reduced to a single $, which
     * allows for escaping the $(VAR_NAME) syntax: i.e. "$$(VAR_NAME)" will produce the
     * string literal "$(VAR_NAME)". Escaped references will never be expanded, regardless of whether
     * the variable exists or not. Defaults to "".
     */
    value?: string;
    /** Source for the environment variable's value. Cannot be used if value is not empty. */
    valueFrom?: {
      /** Selects a key of a ConfigMap. */
      configMapKeyRef?: {
        /** The key to select. */
        key: string;
        /** Name of the referent. */
        name: string;
        /** Specify whether the ConfigMap or its key must be defined */
        optional?: boolean;
      };
      /**
       * Selects a field of the pod: supports metadata.name, metadata.namespace, `metadata.labels['<KEY>']`,
       * `metadata.annotations['<KEY>']`, spec.nodeName, spec.serviceAccountName, status.hostIP,
       * status.podIP, status.podIPs.
       */
      fieldRef?: {
        /** Version of the schema the FieldPath is written in terms of, defaults to "v1". */
        apiVersion: string;
        /** Path of the field to select in the specified API version. */
        fieldPath: string;
      };
      /**
       * Selects a resource of the container: only resources limits and requests
       * (limits.cpu, limits.memory, limits.ephemeral-storage, requests.cpu, requests.memory
       *  and requests.ephemeral-storage) are currently supported.
       */
      resourceFieldRef?: {
        /** Container name: required for volumes, optional for env vars */
        containerName?: string;
        /**
         * Specifies the output format of the exposed resources, defaults to "1".
         *
         * @see {@link https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.27/#quantity-resource-core | Quantity}
         */
        divisor?: string;
        /** Required: resource to select */
        resource: string;
      };
      /** Selects a key of a secret in the pod's namespace */
      secretKeyRef?: {
        /** The key of the secret to select from. Must be a valid secret key. */
        key: string;
        /** Name of the referent. */
        name: string;
        /** Specify whether the Secret or its key must be defined */
        optional?: boolean;
      };
    };
  }[];
  envFrom?: {
    /** SecretEnvSource	The Secret to select from */
    secretRef?: {
      /** Name of the referent. */
      name: string;
      /** Specify whether the Secret must be defined */
      optional?: boolean;
    };
    configMapRef?: {
      /** Name of the referent. */
      name: string;
      /** Specify whether the ConfigMap must be defined */
      optional?: boolean;
    };
    /** An optional identifier to prepend to each key in the ConfigMap. Must be a C_IDENTIFIER. */
    prefix?: string;
  }[];

  /**
   * Container image name. This field is optional to allow higher level config management to
   * default or override container images in workload controllers like Deployments and StatefulSets.
   *
   * @see {@link https://kubernetes.io/docs/concepts/containers/images | more info}
   */
  image: string;

  /**
   * Image pull policy. One of Always, Never, IfNotPresent. Defaults to Always if :latest tag is
   * specified, or IfNotPresent otherwise. Cannot be updated.
   *
   * @see {@link https://kubernetes.io/docs/concepts/containers/images#updating-images | more info}
   */
  imagePullPolicy: string;

  // @todo: Add lifecycle field.

  /**
   * Periodic probe of container liveness. Container will be restarted if the probe fails.
   * Cannot be updated.
   *
   * @see {@link https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes | more info}
   */
  livenessProbe?: KubeContainerProbe;

  /**
   * Name of the container specified as a DNS_LABEL.
   * Each container in a pod must have a unique name (DNS_LABEL).
   *
   * Cannot be updated.
   */
  name: string;

  /**
   * List of ports to expose from the container. Not specifying a port here DOES NOT prevent that
   * port from being exposed. Any port which is listening on the default "0.0.0.0" address inside
   * a container will be accessible from the network. Modifying this array with strategic merge
   * patch may corrupt the data. For more information See https://github.com/kubernetes/kubernetes/issues/108255.
   *
   * Cannot be updated.
   *
   * https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.27/#containerport-v1-core
   */
  ports?: {
    /** Number of port to expose on the pod's IP address. This must be a valid port number, 0 < x < 65536. */
    containerPort: number;
    /** What host IP to bind the external port to. */
    hostIP?: string;
    /**
     * Number of port to expose on the host. If specified, this must be a valid port number, 0 < x < 65536.
     * If HostNetwork is specified, this must match ContainerPort. Most containers do not need this.
     */
    hostPort?: number;
    /** If specified, this must be an IANA_SVC_NAME and unique within the pod. Each named port in a pod must have a unique name. Name for the port that can be referred to by services. */
    name?: string;
    /** Protocol for port. Must be UDP, TCP, or SCTP. Defaults to "TCP". */
    protocol?: string;
  }[];
  /**
   * Periodic probe of container service readiness. Container will be removed from service endpoints
   * if the probe fails.
   *
   * Cannot be updated.
   *
   * @see {@link https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes | more info}
   */
  readinessProbe?: KubeContainerProbe;
  /** Resources resize policy for the container. */
  resizePolicy?: {
    /**
     * Name of the resource to which this resource resize policy applies.
     * Supported values: cpu, memory.
     */
    resourceName: string;
    /**
     * Restart policy to apply when specified resource is resized.
     * If not specified, it defaults to NotRequired.
     */
    restartPolicy?: string;
  }[];
  /**
   * Compute Resources required by this container. Cannot be updated.
   *
   * @see {@link https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/ | more info}
   *
   * https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.27/#resourcerequirements-v1-core
   */
  resources?: {
    claims?: {
      /**
       * Name must match the name of one entry in pod.spec.resourceClaims of the Pod where
       * this field is used. It makes that resource available inside a container.
       */
      name: string;
    };
    /**
     * Limits describes the maximum amount of compute resources allowed.
     *
     * @see {@link https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/ | more info}
     *
     * Can also have hugpages like: "hugepages-2Mi": "100Mi" // Requesting 100 Mebibytes of 2 MiB HugePages
     */
    limits?: {
      /** example "100m", 100 milliCPU (0.1 CPU core) */
      cpu?: string;
      /** example , "256Mi" 256 Mebibytes */
      memory?: string;
    };
    requests?: {
      /** example "500m", 500 milliCPU (0.5 CPU core) */
      cpu?: string;
      /** example , "1Gi" 1 Gibibyte */
      memory?: string;
    };
  };

  // @todo:
  // securityContext SecurityContext	SecurityContext defines the security options the container should be run with. If set, the fields of SecurityContext override the equivalent fields of PodSecurityContext. More info: https://kubernetes.io/docs/tasks/configure-pod-container/security-context/
  // startupProbe Probe	StartupProbe indicates that the Pod has successfully initialized. If specified, no other probes are executed until this completes successfully. If this probe fails, the Pod will be restarted, just as if the livenessProbe failed. This can be used to provide different probe parameters at the beginning of a Pod's lifecycle, when it might take a long time to load data or warm a cache, than during steady-state operation. This cannot be updated. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes

  /**
   * Path at which the file to which the container's termination message will be written is mounted
   * into the container's filesystem. Message written is intended to be brief final status, such as
   * an assertion failure message. Will be truncated by the node if greater than 4096 bytes.
   * The total message length across all containers will be limited to 12kb.
   * Defaults to /dev/termination-log.
   *
   * Cannot be updated.
   */
  terminationMessagePath?: string;

  /**
   * Indicate how the termination message should be populated. File will use the contents of
   * terminationMessagePath to populate the container status message on both success and failure.
   * FallbackToLogsOnError will use the last chunk of container log output if the termination message
   * file is empty and the container exited with an error. The log output is limited to 2048 bytes or
   * 80 lines, whichever is smaller. Defaults to File.
   *
   * Cannot be updated.
   */
  terminationMessagePolicy?: string;

  volumeMounts?: {
    name: string;
    readOnly: boolean;
    mountPath: string;
  }[];

  /**
   * Whether this container should allocate a buffer for stdin in the container runtime.
   * If this is not set, reads from stdin in the container will always result in EOF.
   *
   * Default is false.
   */
  stdin?: boolean;
  /**
   * Whether the container runtime should close the stdin channel after it has been opened
   * by a single attach. When stdin is true the stdin stream will remain open across
   * multiple attach sessions. If stdinOnce is set to true, stdin is opened on container start,
   * is empty until the first client attaches to stdin, and then remains open and accepts data
   * until the client disconnects, at which time stdin is closed and remains closed until the
   * container is restarted. If this flag is false, a container processes that reads from stdin
   * will never receive an EOF.
   *
   * Default is false
   */
  stdinOnce?: boolean;
  /**
   * Whether this container should allocate a TTY for itself, also requires
   * 'stdin' to be true.
   *
   * Default is false.
   */
  tty?: boolean;
  /**
   * volumeDevices is the list of block devices to be used by the container.
   *
   * patch strategy: merge
   * patch merge key: devicePath
   */
  volumeDevices?: {
    /** devicePath is the path inside of the container that the device will be mapped to. */
    devicePath: string;
    /** name must match the name of a persistentVolumeClaim in the pod */
    name: string;
  }[];
  /**
   * Container's working directory. If not specified, the container runtime's default
   * will be used, which might be configured in the container image.
   * Cannot be updated.
   */
  workingDir?: string;
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
