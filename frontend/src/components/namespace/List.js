import Paper from '@material-ui/core/Paper';
import React from 'react';
import api, { useConnectApi } from '../../lib/api';
import { timeAgo } from '../../lib/util';
import { StatusLabel } from '../common/Label';
import { ResourceLink } from '../common/Resource';
import { SectionBox } from '../common/SectionBox';
import SectionHeader from '../common/SectionHeader';
import SimpleTable from '../common/SimpleTable';

export default function NamespacesList() {
  const [namespaces, setNamespaces] = React.useState(null);

  useConnectApi(
    api.namespace.list.bind(null, setNamespaces),
  );

  function makeStatusLabel(namespace) {
    const status = namespace.status.phase;
    return (
      <StatusLabel status={status == 'Active' ? 'success' : 'error'}>
        {status}
      </StatusLabel>
    );
  }

  return (
    <Paper>
      <SectionHeader title="Namespaces" />
      <SectionBox>
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
              getter: makeStatusLabel
            },
            {
              label: 'Age',
              getter: (namespace) => timeAgo(namespace.metadata.creationTimestamp)
            },
          ]}
          data={namespaces}
        />
      </SectionBox>
    </Paper>
  );
}
