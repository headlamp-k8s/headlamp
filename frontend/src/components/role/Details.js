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
import SimpleTable from '../common/SimpleTable';

export default function RoleDetails() {
  const { namespace=null, name } = useParams();
  const [item, setItem] = React.useState(null);

  useConnectApi(
    (namespace ?
      api.role.get.bind(null, namespace, name, setItem)
      :
      api.clusterRole.get.bind(null, name, setItem))
  );

  return (
    <Paper>
      <SectionHeader
        title="Role"
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
              <InfoLabel name="Kind" value={item.kind} />
              <InfoLabel name="UID" value={item.metadata.uid} />
              <InfoLabel name="Namespace" value={item.metadata.namespace || 'All'} />
              <InfoLabel name="Creation">
                <ValueLabel>{new Date(item.metadata.creationTimestamp).toLocaleString()}</ValueLabel>
              </InfoLabel>
              <InfoLabel name="Version" value={item.metadata.resourceVersion} />
            </Grid>
            <SimpleTable
              columns={[
                {
                  label: 'API Groups',
                  getter: ({apiGroups}) => apiGroups.join(', ')
                },
                {
                  label: 'Resources',
                  getter: ({resources}) => resources.join(', ')
                },
                {
                  label: 'Non Resources',
                  getter: ({nonResources=[]}) => nonResources.join(', ')
                },
                {
                  label: 'Verbs',
                  getter: ({verbs}) => verbs.join(', ')
                }
              ]}
              data={item.rules}
            />
          </React.Fragment>
        }
      </Box>
    </Paper>
  );
}
