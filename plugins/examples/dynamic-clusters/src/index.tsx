import { Headlamp, registerAppBarAction } from '@kinvolk/headlamp-plugin/lib';
import { Button } from '@mui/material';

function ClusterCreationButton() {
  return (
    <Button
      onClick={() => {
        Headlamp.setCluster({
          name: 'my-plugin-set-cluster',
          server: 'http://phony.abcde-example-k8s-cluster.k8scluster',
        })
          .then(() => {
            window.location.reload();
          })
          .catch(e => {
            console.log('Error setting cluster', e);
          });
      }}
    >
      New cluster
    </Button>
  );
}

registerAppBarAction(ClusterCreationButton);
