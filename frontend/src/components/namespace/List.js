import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import api, { useConnectApi } from '../../lib/api';
import { timeAgo } from '../../lib/util';
import SectionHeader from '../common/SectionHeader';
import SimpleTable from '../common/SimpleTable';
import { ResourceLink } from '../common/Resource';

export default function NamespacesList() {
  const [namespaces, setNamespaces] = React.useState(null);

  useConnectApi(
    api.namespace.list.bind(null, setNamespaces),
  );

  return (
    <Paper>
      <SectionHeader title="Namespaces" />
      <Box margin={1}>
        <SimpleTable
          rowsPerPage={[15, 25, 50]}
          columns={[
            {
              label: 'Name',
              getter: (namespace) =>
                <ResourceLink resource={namespace} />
            },
            {
              label: 'Status',
              getter: (namespace) => namespace.status.phase
            },
            {
              label: 'Age',
              getter: (namespace) => timeAgo(namespace.metadata.creationTimestamp)
            },
          ]}
          data={namespaces}
        />
      </Box>
    </Paper>
  );
}