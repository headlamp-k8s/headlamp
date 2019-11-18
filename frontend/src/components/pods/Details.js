import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import { useParams } from "react-router-dom";
import api, { useConnectApi } from '../../lib/api';
import { InfoLabel } from '../common/Label';
import Loader from '../common/Loader';
import { MetadataDisplay } from '../common/Resource';
import SectionHeader from '../common/SectionHeader';

export default function PodDetails(props) {
  let { namespace, name } = useParams();
  const [item, setItem] = React.useState(null);

  useConnectApi(
    api.pod.get.bind(null, namespace, name, setItem),
  );

  return (
    <Paper>
      <SectionHeader
        title="Pod"
      />
      <Box padding={2}>
        {item === null ?
          <Loader />
        :
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
            <MetadataDisplay resource={item} />
            <InfoLabel name="State" value={item.status.phase} />
            <InfoLabel name="Host IP" value={item.status.hostIP} />
            <InfoLabel name="Pod IP" value={item.status.podIP} />
            {/* @todo Complete the view */}
          </Grid>
        }
      </Box>
    </Paper>
  );
}