import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import { useParams } from 'react-router-dom';
import api, { useConnectApi } from '../../lib/api';
import Loader from '../common/Loader';
import { MetadataDisplay } from '../common/Resource';
import SectionHeader from '../common/SectionHeader';

export default function NodeDetails(props) {
  const { name } = useParams();
  const [item, setItem] = React.useState(null);

  useConnectApi(
    api.node.get.bind(null, name, setItem),
  );

  return (
    <Paper>
      <SectionHeader
        title="Node"
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
            {/* @todo Complete the view */}
            <MetadataDisplay resource={item} />
          </Grid>
        }
      </Box>
    </Paper>
  );
}
