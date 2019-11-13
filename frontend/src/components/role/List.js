import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import api, { useConnectApi } from '../../lib/api';
import { timeAgo } from '../../lib/util';
import SectionHeader from '../common/SectionHeader';
import SimpleTable from '../common/SimpleTable';

export default function RoleList() {
  const [rolesData, dispatch] = React.useReducer(setRoles, {});

  function setRoles(roles, newRoles) {
    const data = {...roles};

    newRoles.forEach((item) => {
      if (!(item.kind in data)) data[item.kind] = [];
      data[item.kind].push({
        kind: item.kind,
        name: item.metadata.name,
        namespace: item.metadata.namespace || 'All namespaces',
        date: timeAgo(item.metadata.creationTimestamp),
      });
    });

    return data;
  }

  function getJointItems() {
    let joint = [];
    for (const items of Object.values(rolesData)) {
      joint = joint.concat(items);
    }
    return joint;
  }

  useConnectApi(
    api.role.list.bind(null, null, dispatch),
    api.clusterRole.list.bind(null, dispatch),
  );

  return (
    <Paper>
      <SectionHeader title="Roles" />
      <Box margin={1}>
        <SimpleTable
          rowsPerPage={[15, 25, 50]}
          columns={[
            {
              label: 'Type',
              datum: 'kind'
            },
            {
              label: 'Name',
              datum: 'name'
            },
            {
              label: 'Namespace',
              datum: 'namespace',
            },
            {
              label: 'Age',
              datum: 'date',
            },
          ]}
          data={getJointItems()}
        />
      </Box>
    </Paper>
  );
}
