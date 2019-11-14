import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import _ from 'lodash';
import React from 'react';
import { useParams } from 'react-router-dom';
import api, { useConnectApi } from '../../lib/api';
import { InfoLabel, ValueLabel } from '../common/Label';
import Loader from '../common/Loader';
import SectionHeader from '../common/SectionHeader';

export default function StorageClassDetails(props) {
  const { name } = useParams();
  const [item, setItem] = React.useState(null);

  useConnectApi(
    api.storageClass.get.bind(null, name, setItem),
  );

  return (
    <Paper>
      <SectionHeader
        title="Storage Class"
      />
      <Box padding={2}>
        {item === null ?
          <Loader />
          :
          <Grid
            container
            justify="space-around"
          >
            <Grid
              item
              container
              spacing={1}
              justify="flex-start"
              alignItems="flex-start"
              xs={12}
              lg
            >
              <InfoLabel name="Name" value={item.metadata.name} />
              <InfoLabel name="UID" value={item.metadata.uid} />
              <InfoLabel name="Creation">
                <ValueLabel>{new Date(item.metadata.creationTimestamp).toLocaleString()}</ValueLabel>
              </InfoLabel>
              <InfoLabel name="Version" value={item.metadata.resourceVersion} />
              <InfoLabel name="Priovisioner" value={item.provisioner} />
              <InfoLabel name="Reclaim Policy" value={item.reclaimPolicy} />
              <InfoLabel name="Binding Mode" value={item.volumeBindingMode} />
            </Grid>
            <Grid
              item
              container
              spacing={1}
              justify="flex-start"
              alignItems="flex-start"
              xs={12}
              lg
            >
              {/* @todo Restyle this */}
              <InfoLabel name="Annotations">
                {_.map(item.metadata.annotations, (value, key) => {
                  return (
                    <p><ValueLabel>{key}{': '}{value}</ValueLabel></p>
                  );
                })}
              </InfoLabel>
            </Grid>
          </Grid>
        }
      </Box>
    </Paper>
  );
}
