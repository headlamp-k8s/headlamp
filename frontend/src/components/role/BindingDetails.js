import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import { useParams } from 'react-router-dom';
import api, { useConnectApi } from '../../lib/api';
import { InfoLabel } from '../common/Label';
import Loader from '../common/Loader';
import { MetadataDisplay } from '../common/Resource';
import SectionHeader from '../common/SectionHeader';
import SimpleTable from '../common/SimpleTable';

export default function RoleBindingDetails() {
  const { namespace=null, name } = useParams();
  const [item, setItem] = React.useState(null);

  useConnectApi(
    (namespace ?
      api.roleBinding.get.bind(null, namespace, name, setItem)
      :
      api.clusterRoleBinding.get.bind(null, name, setItem)
    )
  );

  return (
    <Paper>
      <SectionHeader
        title="Role Binding"
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
              <MetadataDisplay resource={item} />
              <InfoLabel name="Role" value={item.roleRef.name} />
            </Grid>
            <SimpleTable
              columns={[
                {
                  label: 'Type',
                  getter: (item) => item.kind
                },
                {
                  label: 'Name',
                  getter: (item) => item.name
                },
                {
                  label: 'Namespace',
                  getter: (item) => item.namespace
                }
              ]}
              data={item.subjects}
            />
          </React.Fragment>
        }
      </Box>
    </Paper>
  );
}
