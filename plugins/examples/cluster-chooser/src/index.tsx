import { ClusterChooserProps, registerClusterChooser } from '@kinvolk/headlamp-plugin/lib';
import { Button } from '@material-ui/core';

registerClusterChooser(({ clickHandler, cluster }: ClusterChooserProps) => {
  return <Button onClick={clickHandler}>Our Cluster Chooser button. Cluster: {cluster}</Button>;
});
