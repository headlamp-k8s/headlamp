import { createContext, memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { KubeObject } from '../../../lib/k8s/cluster';
import { GraphEdge, GraphNode, GraphSource } from '../graph/graphModel';
import { ConfigurationSource } from './definitions/ConfigurationSource';
import { NetworkSource } from './definitions/NetworkSource';
import { SecuritySource } from './definitions/SecuritySource';
import { StorageSource } from './definitions/StorageSource';
import { WorkloadsSource } from './definitions/WorkloadSource';

export const allSources: GraphSource[] = [
  WorkloadsSource,
  StorageSource,
  NetworkSource,
  SecuritySource,
  ConfigurationSource,
];

interface GraphSourcesContext {
  nodes: GraphNode[];
  edges: GraphEdge[];
  toggleSelection: (source: GraphSource) => void;
  setSelectedSources: (sources: Set<string>) => void;
  selectedSources: Set<string>;
  sourceData?: Map<string, any>;
}
const Context = createContext<GraphSourcesContext>(undefined as any);

export const useSources = () => useContext(Context);

function getFlatSources(sources: GraphSource[], result: GraphSource[] = []): GraphSource[] {
  for (const source of sources) {
    if ('sources' in source) {
      getFlatSources(source.sources, result);
    } else {
      result.push(source);
    }
  }
  return result;
}

/**
 * Create Edges from object's ownerReferences
 */
export const kubeOwnersEdges = (obj: KubeObject): GraphEdge[] => {
  return (
    obj.metadata.ownerReferences?.map((owner: any) => ({
      id: `${obj.metadata.uid}-${owner.uid}`,
      type: 'kubeRelation',
      source: obj.metadata.uid,
      target: owner.uid,
    })) ?? []
  );
};

/**
 * Create an object from any Kube object
 */
export const makeKubeObjectNode = (obj: KubeObject): GraphNode => ({
  id: obj.metadata.uid,
  type: 'kubeObject',
  data: {
    resource: obj,
  },
});

/**
 * Make an edge connecting two Kube objects
 */
export const makeKubeToKubeEdge = (from: KubeObject, to: KubeObject): GraphEdge => ({
  id: `${from.metadata.uid}-${to.metadata.uid}`,
  type: 'kubeRelation',
  source: from.metadata.uid,
  target: to.metadata.uid,
});

/**
 * Since we can't use hooks in a loop, we need to create a component for each source
 * that will load the data and pass it to the parent component.
 */
const SourceLoader = memo(({ useHook, onData, id }: any) => {
  const data = useHook();

  useEffect(() => {
    onData(id, data);
  }, [id, data]);

  return null;
});

/**
 * Loads data from all the sources
 */
export function GraphSourceManager({
  sources,
  children,
}: {
  sources: GraphSource[];
  children: any;
}) {
  const [sourceData, setSourceData] = useState(new Map<string, any>());
  const [selectedSources, setSelectedSources] = useState(() => {
    const _selectedSources = new Set<string>();

    const step = (source: GraphSource) => {
      if (source.isEnabledByDefault ?? true) {
        _selectedSources.add(source.id);
        if ('sources' in source) {
          source.sources.forEach(step);
        }
      }
    };
    sources.map(step);
    return _selectedSources;
  });

  const toggleSelection = useCallback(
    (source: GraphSource) => {
      setSelectedSources(selection => {
        const isSelected = (source: GraphSource): boolean =>
          'sources' in source ? source.sources.every(s => isSelected(s)) : selection.has(source.id);

        const deselectAll = (source: GraphSource) => {
          if ('sources' in source) {
            source.sources.forEach(deselectAll);
          } else {
            selection.delete(source.id);
          }
        };

        const selectAll = (source: GraphSource) => {
          if ('sources' in source) {
            source.sources.forEach(s => selectAll(s));
          } else {
            selection.add(source.id);
          }
        };

        if (!('sources' in source)) {
          // not a group, just toggle the selection
          if (selection.has(source.id)) {
            selection.delete(source.id);
          } else {
            selection.add(source.id);
          }
        } else {
          // if all children are selected, deselect them
          if (source.sources.every(isSelected)) {
            source.sources.forEach(deselectAll);
            selection.delete(source.id);
          } else {
            source.sources.forEach(selectAll);
          }
        }
        return new Set(selection);
      });
    },
    [setSelectedSources]
  );

  const onData = useCallback(
    (id: string, data: any) => {
      setSourceData(map => new Map(map).set(id, data));
    },
    [setSourceData]
  );

  const components = useMemo(() => {
    const allSources = getFlatSources(sources);

    return allSources
      .filter(it => selectedSources.has(it.id))
      .filter(it => 'useData' in it)
      .map(source => {
        return {
          props: {
            useHook: source.useData,
            onData: onData,
            key: source.id,
            id: source.id,
          },
        };
      });
  }, [sources, selectedSources]);

  const contextValue = useMemo(() => {
    const nodes: any[] = [];
    const edges: any[] = [];

    selectedSources.forEach(id => {
      const data = sourceData.get(id);
      nodes.push(...(data?.nodes ?? []));
      edges.push(...(data?.edges ?? []));
    });

    return {
      nodes,
      edges,
      toggleSelection,
      setSelectedSources,
      selectedSources,
      sourceData,
    };
  }, [sources, selectedSources, sourceData, setSelectedSources]);

  return (
    <>
      {components.map(it => (
        <SourceLoader {...it.props} key={it.props.key} />
      ))}
      <Context.Provider value={contextValue}>{children}</Context.Provider>
    </>
  );
}
