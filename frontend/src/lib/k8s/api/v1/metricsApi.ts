import { isDebugVerbose } from '../../../../helpers';
import { getCluster } from '../../../cluster';
import { getClusterGroup } from '../../../util';
import { KubeMetrics } from '../../cluster';
import { ApiError, clusterRequest } from './clusterRequests';

/**
 * Gets the metrics for the specified resource. Gets new metrics every 10 seconds.
 *
 * @param url - The url of the resource to get metrics for.
 * @param onMetrics - The function to call with the metrics.
 * @param onError - The function to call if there's an error.
 * @param cluster - The cluster to get metrics for. By default uses the current cluster (URL defined).
 *
 * @returns A function to cancel the metrics request.
 */
export async function metrics(
  url: string,
  onMetrics: (arg: KubeMetrics[]) => void,
  onError?: (err: ApiError) => void,
  cluster?: string
) {
  const handle = setInterval(getMetrics, 10000);

  const clusterName = cluster || getCluster();

  async function getMetrics() {
    try {
      const metric = await clusterRequest(url, { cluster: clusterName });
      onMetrics(metric.items || metric);
    } catch (err) {
      if (isDebugVerbose('k8s/apiProxy@metrics')) {
        console.debug('k8s/apiProxy@metrics', { err, url });
      }

      if (onError) {
        onError(err as ApiError);
      }
    }
  }

  function cancel() {
    clearInterval(handle);
  }

  getMetrics();

  return cancel;
}

/**
 * Fetches the metrics for the specified clusters.
 *
 * Gets new metrics every 10 seconds.
 *
 * @param url - The url of the resource to get metrics for.
 * @param onMetrics - The function to call with the metrics.
 * @param onError - The function to call if there's an error.
 *
 * @returns A function to cancel the metrics request.
 */
export async function fetchMetricsForClusters(
  url: string,
  onMetrics: (arg: { [cluster: string]: KubeMetrics[] }) => void,
  onError?: (err: { [cluster: string]: ApiError }) => void
) {
  let cancelled = false;
  const handler = setInterval(getMetrics, 10000);

  async function getMetrics() {
    const items: { [cluster: string]: KubeMetrics[] } = {};
    const errors: { [cluster: string]: ApiError } = {};
    const clusters = getClusterGroup();
    for (const cluster of clusters) {
      try {
        const metric = await clusterRequest(url, { cluster: cluster });

        if (cancelled) {
          return;
        }

        items[cluster] = metric.items || metric;
        delete errors[cluster];
      } catch (err) {
        errors[cluster] = err as ApiError;
        delete items[cluster];
      }
    }

    onMetrics(items);
    if (onError && Object.keys(errors).length > 0) {
      onError(errors);
    }
  }

  function cancel() {
    clearInterval(handler);
    cancelled = true;
  }

  getMetrics();

  return cancel;
}
