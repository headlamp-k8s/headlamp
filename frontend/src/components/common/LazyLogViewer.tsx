import { lazy } from 'react';

export const LazyLogViewer = lazy(() =>
  import('./LogViewer').then(it => ({ default: it.LogViewer }))
);
