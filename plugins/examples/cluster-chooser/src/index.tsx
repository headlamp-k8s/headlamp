import { ClusterChooserProps, registerClusterChooser } from '@kinvolk/headlamp-plugin/lib';

registerClusterChooser(({ clickHandler }: ClusterChooserProps) => {
  return <button onClick={clickHandler}>Our very own Chooser</button>;
});
