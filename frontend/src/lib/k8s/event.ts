import React from 'react';
import { CancellablePromise, ResourceClasses } from '.';
import { ApiError, apiFactoryWithNamespace, QueryParameters } from './apiProxy';
import { request } from './apiProxy';
import { KubeMetadata, KubeObject, makeKubeObject } from './cluster';

export interface KubeEvent {
  type: string;
  reason: string;
  message: string;
  metadata: KubeMetadata;
  involvedObject: {
    kind: string;
    namespace: string;
    name: string;
    uid: string;
    apiVersion: string;
    resourceVersion: string;
    fieldPath: string;
  };
  [otherProps: string]: any;
}

class Event extends makeKubeObject<KubeEvent>('Event') {
  static apiEndpoint = apiFactoryWithNamespace('', 'v1', 'events');

  // Max number of events to fetch from the API
  private static maxEventsLimit = 2000;

  // Getter to get the max number of events that are to be fetched
  static get maxLimit() {
    return this.maxEventsLimit;
  }

  // Setter to set the max number of events that are to be fetched
  static set maxLimit(limit: number) {
    this.maxEventsLimit = limit;
  }

  get spec() {
    return this.getValue('spec');
  }

  get status() {
    return this.getValue('status');
  }

  get involvedObject() {
    return this.getValue('involvedObject');
  }

  get type() {
    return this.getValue('type');
  }

  get reason() {
    return this.getValue('reason');
  }

  get message() {
    return this.getValue('message');
  }

  static async objectEvents(object: KubeObject) {
    const namespace = object.metadata.namespace;
    const name = object.metadata.name;
    const objectKind = object.kind;

    let path = '/api/v1/events';
    const fieldSelector: { [key: string]: string } = {
      'involvedObject.kind': objectKind,
      'involvedObject.name': name,
    };

    if (namespace) {
      path = `/api/v1/namespaces/${namespace}/events`;
      fieldSelector['involvedObject.namespace'] = namespace;
    }

    const queryParams = {
      fieldSelector: Object.keys(fieldSelector)
        .map(function (k) {
          return `${k}=${fieldSelector[k]}`;
        })
        .join(','),
      limit: this.maxLimit,
    };

    const response = await request(path, {}, true, true, queryParams);

    return response.items;
  }

  get involvedObjectInstance(): KubeObject | null {
    if (!this.involvedObject) {
      return null;
    }

    const InvolvedObjectClass = ResourceClasses[this.involvedObject.kind];
    let objInstance: KubeObject | null = null;
    if (!!InvolvedObjectClass) {
      objInstance = new InvolvedObjectClass({
        kind: this.involvedObject.kind,
        metadata: {
          name: this.involvedObject.name,
          namespace: this.involvedObject.namespace,
        },
      });
    }

    return objInstance;
  }

  static useListForClusters(clusterNames: string[], options?: { queryParams?: QueryParameters }) {
    type EventErrorObj = {
      [cluster: string]: {
        warnings: Event[];
        error?: ApiError | null;
      };
    };
    const [clusters, setClusters] = React.useState<Set<string>>(new Set(clusterNames));
    const [events, setEvents] = React.useState<EventErrorObj>({});
    const queryParameters = Object.assign(
      { limit: this.maxEventsLimit },
      options?.queryParams ?? {}
    );

    // Make sure we only update when there are different cluster names
    React.useEffect(() => {
      let shouldUpdate = false;
      for (const cluster of clusterNames) {
        if (!clusters.has(cluster)) {
          shouldUpdate = true;
          break;
        }
      }
      if (shouldUpdate) {
        setClusters(new Set(clusterNames));
      }
    }, [clusters, clusterNames]);

    React.useEffect(() => {
      if (clusters.size === 0) {
        console.debug('No clusters specified when fetching warnings');
      }
      const cancellables: CancellablePromise[] = [];
      for (const cluster of clusters) {
        const cancelFunc = Event.apiList(
          (events: Event[]) => {
            setEvents(prevWarnings => ({
              ...prevWarnings,
              [cluster]: {
                warnings: events,
                error: null,
              },
            }));
          },
          error => {
            setEvents(prevWarnings => ({
              ...prevWarnings,
              [cluster]: {
                warnings: [],
                error,
              },
            }));
          },
          {
            cluster: cluster,
            queryParams: queryParameters,
          }
        )();
        cancellables.push(cancelFunc);
      }

      return function cancelAllConnectedListings() {
        for (const cancellable of cancellables) {
          cancellable.then(c => c());
        }
      };
    }, [clusters]);

    return events;
  }

  static useWarningList(clusters: string[], options?: { queryParams?: QueryParameters }) {
    const queryParameters = Object.assign(
      {
        limit: this.maxEventsLimit,
        fieldSelector: 'type!=Normal',
      },
      options?.queryParams ?? {}
    );

    return this.useListForClusters(clusters, { queryParams: queryParameters });
  }
}

export default Event;
