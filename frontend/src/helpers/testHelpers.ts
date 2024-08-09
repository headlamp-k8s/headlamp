import { useKubeObject, useKubeObjectList } from '../lib/k8s/api/v2/hooks';

export function mockListQuery({ items }: { items: any[] }) {
  return (() => ({ items, error: null })) as any as typeof useKubeObjectList;
}

export const useMockQuery = {
  noData: () => ({ data: null, error: null } as any as typeof useKubeObject),
  error: () => ({ data: null, error: 'Phony error is phony!' } as any as typeof useKubeObject),
  data: (data: any) => (() => ({ data: data, error: null })) as any as typeof useKubeObject,
};

export const useMockListQuery = {
  noData: () =>
    ({
      data: null,
      items: null,
      error: null,
    } as any as typeof useKubeObjectList),
  error: () =>
    ({
      data: null,
      items: null,
      error: 'Phony error is phony!',
    } as any as typeof useKubeObjectList),
  data: (items: any[]) =>
    (() => ({
      data: { kind: 'List', items },
      items,
      error: null,
    })) as any as typeof useKubeObjectList,
};
