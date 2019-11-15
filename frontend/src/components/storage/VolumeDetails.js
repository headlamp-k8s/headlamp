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

export default function VolumeDetails() {
  const { name } = useParams();
  const [item, setItem] = React.useState(null);

  useConnectApi(
    api.persistentVolume.get.bind(null, name, setItem),
  );

  return (
    <Paper>
      <SectionHeader
        title="Persistent Volume"
      />
      <Box padding={2}>
        {item === null ?
          <Loader />
          :
          <React.Fragment>
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
              <InfoLabel name="Name" value={item.metadata.name} />
              <InfoLabel name="UID" value={item.metadata.uid} />
              <InfoLabel name="Version" value={item.metadata.resourceVersion} />
              <InfoLabel name="Creation">
                <ValueLabel>{new Date(item.metadata.creationTimestamp).toLocaleString()}</ValueLabel>
              </InfoLabel>
              <InfoLabel name="Capacity" value={item.spec.capacity.storage} />
              <InfoLabel name="Access Modes" value={item.spec.accessModes.join(', ')} />
              <InfoLabel name="Reclaim Policy" value={item.spec.persistentVolumeReclaimPolicy} />
              <InfoLabel name="Status" value={item.status.phase} />
              <InfoLabel name="Storage Class" value={item.spec.storageClassName} />
              <InfoLabel name="Annotations">
                {_.map(item.metadata.annotations, (value, key) => {
                  return (
                    <p key={key}><ValueLabel>{key}{': '}{value}</ValueLabel></p>
                  );
                })}
              </InfoLabel>
            </Grid>
          </React.Fragment>
        }
      </Box>
    </Paper>
  );
}
