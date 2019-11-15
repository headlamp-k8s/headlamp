import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import _ from 'lodash';
import React from 'react';
import { useParams } from "react-router-dom";
import api, { useConnectApi } from '../../lib/api';
import { InfoLabel, ValueLabel } from '../common/Label';
import Loader from '../common/Loader';
import SectionHeader from '../common/SectionHeader';

export default function ServiceAccountDetails(props) {
  let { namespace, name } = useParams();
  const [item, setItem] = React.useState(null);

  console.log(item)

  useConnectApi(
    api.serviceAccount.get.bind(null, namespace, name, setItem),
  );

  return (
    <Paper>
      <SectionHeader
        title="Service Account"
      />
      <Box padding={2}>
        {item === null ?
          <Loader />
        :
          <React.Fragment>
            {/* @todo Restyle this */}
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
              <InfoLabel name="Namespace" value={item.metadata.namespace} />
              <InfoLabel name="Creation">
                <ValueLabel>{new Date(item.metadata.creationTimestamp).toLocaleString()}</ValueLabel>
              </InfoLabel>
              <InfoLabel name="Version" value={item.metadata.resourceVersion} />
              <InfoLabel name="Secrets" value={item.secrets.map(({name}) => name).join(', ')} />
            </Grid>
          </React.Fragment>
        }
      </Box>
    </Paper>
  );
}