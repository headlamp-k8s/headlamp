import Paper from '@material-ui/core/Paper';
import React from 'react';
import api, { useConnectApi } from '../../lib/api';
import { timeAgo, useFilterFunc } from '../../lib/util';
import { StatusLabel } from '../common/Label';
import { ResourceLink } from '../common/Resource';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';
import SimpleTable from '../common/SimpleTable';

export default function NamespacesList() {
  const [namespaces, setNamespaces] = React.useState(null);
  const filterFunc = useFilterFunc();

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
      <SectionFilterHeader
        title="Namespaces"
        noNamespaceFilter
      />
      <SectionBox>
        <SimpleTable
          rowsPerPage={[15, 25, 50]}
          filterFunction={filterFunc}
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
