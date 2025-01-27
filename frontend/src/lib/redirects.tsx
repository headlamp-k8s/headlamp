import { getClusterPrefixedPath } from './cluster';

/** Redirect will navigate to new location */
interface Redirect {
  /** Full path to redirect from */
  fromPath: string;
  /** Name of the default route to redirect to */
  toRouteName: string;
}

export const redirects: Redirect[] = [
  { fromPath: getClusterPrefixedPath('/storage/classes'), toRouteName: 'storageClasses' },
  { fromPath: getClusterPrefixedPath('/storage/classes/:name'), toRouteName: 'storageClass' },
  {
    fromPath: getClusterPrefixedPath('/storage/persistentvolumes'),
    toRouteName: 'persistentVolumes',
  },
  {
    fromPath: getClusterPrefixedPath('/storage/persistentvolumes/:name'),
    toRouteName: 'persistentVolume',
  },
  {
    fromPath: getClusterPrefixedPath('/storage/persistentvolumeclaims'),
    toRouteName: 'persistentVolumeClaims',
  },
  {
    fromPath: getClusterPrefixedPath('/storage/persistentvolumeclaims/:namespace/:name'),
    toRouteName: 'persistentVolumeClaim',
  },
];
