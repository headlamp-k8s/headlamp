import { KubeMetadata } from '../../../lib/k8s/KubeMetadata';
import { KubeObject } from '../../../lib/k8s/KubeObject';
import { filterGraph, GraphFilter } from './graphFiltering';
import { GraphEdge, GraphNode } from './graphModel';

describe('filterGraph', () => {
  const nodes: GraphNode[] = [
    {
      id: '1',
      type: 'kubeObject',
      data: {
        resource: { metadata: { namespace: 'ns1', name: 'node1' } as KubeMetadata } as KubeObject,
      },
    },
    {
      id: '2',
      type: 'kubeObject',
      data: {
        resource: {
          kind: 'Pod',
          metadata: { namespace: 'ns2' } as KubeMetadata,
          status: { phase: 'Failed' },
        } as any,
      },
    },
    {
      id: '3',
      type: 'kubeObject',
      data: { resource: { metadata: { namespace: 'ns3' } as KubeMetadata } as KubeObject },
    },
    {
      id: '4',
      type: 'kubeObject',
      data: { resource: { metadata: { namespace: 'ns3' } as KubeMetadata } as KubeObject },
    },
  ];

  const edges: GraphEdge[] = [
    { id: 'e1', source: '1', target: '2', type: 'kubeRelation' },
    { id: 'e2', source: '3', target: '4', type: 'kubeRelation' },
  ];

  it('filters nodes by namespace', () => {
    const filters: GraphFilter[] = [{ type: 'namespace', namespaces: new Set(['ns3']) }];
    const { nodes: filteredNodes } = filterGraph(nodes, edges, filters);

    // Output contains two nodes that both have same namespace ns3
    expect(filteredNodes.map(it => it.id)).toEqual(['3', '4']);
  });

  it('filters nodes by error status', () => {
    const filters: GraphFilter[] = [{ type: 'hasErrors' }];
    const { nodes: filteredNodes } = filterGraph(nodes, edges, filters);

    // Finds node 2 that has an error, and node 1 that is related to it
    expect(filteredNodes.map(it => it.id)).toEqual(['2', '1']);
  });
});
