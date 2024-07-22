/*
 * This module was originally taken from the K8dash project before modifications.
 *
 * K8dash is licensed under Apache License 2.0.
 *
 * Copyright © 2020 Eric Herbrandson
 * Copyright © 2020 Kinvolk GmbH
 */

/**
 * @todo: A summary of things marked for fixing in this file marked with todo:
 *
 * - Return types are missing in places.
 * - Some types are "any".
 * - No docs on some functions and interfaces.
 * - Async is missing on some functions that need to be marked as so.
 * - Some of the users of the functions are not handling errors.
 */

// Uncomment the following lines to enable verbose debug logging in this module.
// import { debugVerbose } from '../../helpers';
// debugVerbose('k8s/apiProxy');

export type {
  ApiError,
  ApiInfo,
  ClusterRequest,
  ClusterRequestParams,
  QueryParameters,
  RequestParams,
  StreamErrCb,
  StreamResultsCb,
} from './apiTypes';

// Basic cluster API functions
export { clusterRequest, patch, post, put, remove, request } from './clusterRequests';

// Streaming API functions
export {
  stream,
  streamResult,
  streamResults,
  streamResultsForCluster,
  type StreamArgs,
  type StreamResultsParams,
} from './streamingApi';

// API factory functions
export { apiFactory, apiFactoryWithNamespace } from './factories';

// Port forward functions
export { listPortForward, startPortForward, stopOrDeletePortForward } from './portForward';

export { deleteCluster, setCluster, testAuth, testClusterHealth } from './clusterApi';
export { metrics } from './metricsApi';
export { deletePlugin } from './pluginsApi';

export { drainNodeStatus, drainNode } from './drainNode';

export { apply } from './apply';
