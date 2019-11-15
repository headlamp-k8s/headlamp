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

export default function ConfigDetails(props) {
  let { namespace, name } = useParams();
  const [item, setItem] = React.useState(null);

  console.log(item);

  useConnectApi(
    api.configMap.get.bind(null, namespace, name, setItem),
  );

  return (
    <Paper>
      <SectionHeader
        title="Config Map"
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
              <InfoLabel name="Name" value={item.metadata.name} />
              <InfoLabel name="UID" value={item.metadata.uid} />
              <InfoLabel name="Namespace" value={item.metadata.namespace} />
              <InfoLabel name="Version" value={item.metadata.resourceVersion} />
              <InfoLabel name="Creation">
                <ValueLabel>{new Date(item.metadata.creationTimestamp).toLocaleString()}</ValueLabel>
              </InfoLabel>
              {/* @todo Restyle this */}
              <InfoLabel name="Config Data">
                {_.map(item.data, (value, key) => {
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