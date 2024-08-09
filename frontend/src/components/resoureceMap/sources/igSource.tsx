import { GraphEdge, GraphSource } from '../GraphModel';
import connections from './ig.json';

// connections.forEach(it => {
//   const source = it.src.addr;
//   const destination = it.dst.addr;

//   if (
//     !source.endsWith('113') &&
//     !destination.endsWith('113') &&
//     source !== destination &&
//     source !== '0.0.0.0' &&
//     destination !== '0.0.0.0'
//   ) {
//     console.log('connection!', it);
//   }
// });

const ip = (str: string) => (str.includes(':') ? str.split(':').pop() : str);

const formatBytes = (bytes: number) =>
  bytes < 1024
    ? bytes + 'B'
    : bytes < 1024 * 1024
    ? (bytes / 1024).toFixed(1) + 'KB'
    : (bytes / 1024 / 1024).toFixed(1) + 'MB';

export const igSource: GraphSource = {
  id: 'ig',
  label: 'IG sockets',
  isEnabledByDefault: false,
  edges({ resources }) {
    const edges: GraphEdge[] = connections.map(conn => ({
      id: String(Math.random()),
      source: resources.pods.find(
        it =>
          !it.metadata.name.includes('prometheus') &&
          (it.metadata.name === conn.src.podname || it.status.podIP === ip(conn.src.addr))
      )?.metadata?.uid,
      target: resources.pods.find(
        it =>
          !it.metadata.name.includes('prometheus') &&
          (it.metadata.name === conn.dst.podname || it.status.podIP === ip(conn.dst.addr))
      )?.metadata?.uid,
      label: formatBytes(conn.sent),
      animated: true,
    }));

    // merge edges with the same source and target either way
    const mergedEdges: GraphEdge[] = [];
    edges.forEach(edge => {
      const existing = mergedEdges.find(
        it =>
          (it.source === edge.target && it.target === edge.source) ||
          (it.target === edge.target && it.source === edge.source)
      );
      if (existing) {
        // existing.label = (
        //   <div>
        //     {existing.label}
        //     <br />
        //     {edge.label}
        //   </div>
        // );
      } else {
        mergedEdges.push(edge);
      }
    });

    return mergedEdges;
  },
};
