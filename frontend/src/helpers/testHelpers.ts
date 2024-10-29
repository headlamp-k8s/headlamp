import { KubeObject } from '../lib/k8s/KubeObject';

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
    } as any as typeof KubeObject.useList),
  error: () =>
    ({
      data: null,
      items: null,
      error: 'Phony error is phony!',
      *[Symbol.iterator]() {
        yield null;
        yield 'Phony error is phony!';
      },
    } as any as typeof KubeObject.useList),
  data: (items: any[]) =>
    (() => ({
      data: { kind: 'List', items },
      items,
      error: null,
      *[Symbol.iterator]() {
        yield items;
        yield null;
      },
    })) as any as typeof KubeObject.useList,
};
