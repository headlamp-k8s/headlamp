import { useKubeObjectList } from '../lib/k8s/api/v2/hooks';

export const useMockListQuery = {
  noData: () =>
    ({
      data: null,
      items: null,
      error: null,
      *[Symbol.iterator]() {
        yield null;
        yield null;
      },
    } as any as typeof useKubeObjectList),
  error: () =>
    ({
      data: null,
      items: null,
      error: 'Phony error is phony!',
      *[Symbol.iterator]() {
        yield null;
        yield 'Phony error is phony!';
      },
    } as any as typeof useKubeObjectList),
  data: (items: any[]) =>
    (() => ({
      data: { kind: 'List', items },
      items,
      error: null,
      *[Symbol.iterator]() {
        yield items;
        yield null;
      },
    })) as any as typeof useKubeObjectList,
};
