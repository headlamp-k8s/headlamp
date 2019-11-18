import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import { useParams } from "react-router-dom";
import api, { useConnectApi } from '../../lib/api';
import Loader from '../common/Loader';
import { MetadataDisplay } from '../common/Resource';
import SectionHeader from '../common/SectionHeader';

export default function WorkloadDetails(props) {
  let { namespace, name } = useParams();
  const { workloadKind } = props;
  const [item, setItem] = React.useState(null);

  useConnectApi(
    getApiConnection(item)
  );

  function getApiConnection() {
    let resourceApi = null;
    switch(workloadKind) {
      case 'StatefulSet':
        resourceApi = api.statefulSet;
        break;
      case 'Deployment':
        resourceApi = api.deployment;
        break;
      case 'DaemonSet':
        resourceApi = api.daemonSet;
        break;
      case 'Job':
        resourceApi = api.job;
        break;
      case 'CronJob':
        resourceApi = api.cronJob;
        break;
      default:
        break;
    }

    // @todo: Handle error
    return resourceApi.get.bind(null, namespace, name, setItem);
  }

  return (
    <Paper>
      <SectionHeader
        title={workloadKind}
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