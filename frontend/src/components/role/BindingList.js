import Paper from '@material-ui/core/Paper';
import React from 'react';
import api, { useConnectApi } from '../../lib/api';
import { timeAgo } from '../../lib/util';
import { SectionBox } from '../common/SectionBox';
import SectionHeader from '../common/SectionHeader';
import SimpleTable from '../common/SimpleTable';
import Link from '../common/Link';

export default function RoleBindingList() {
  const [roleBindingsData, dispatch] = React.useReducer(setRoleBindings, {});

  function setRoleBindings(roleBindings, newRoleBindings) {
    let data = {...roleBindings};

    newRoleBindings.forEach((item) => {
      if (!(item.kind in data)) {
        data[item.kind] = [];
      }

      data[item.kind].push(item);
    });

    return data;
  }

  function getJointItems() {
    let joint = [];
    for (let items of Object.values(roleBindingsData)) {
      joint = joint.concat(items);
    }
    return joint;
  }

  useConnectApi(
    api.roleBinding.list.bind(null, null, dispatch),
    api.clusterRoleBinding.list.bind(null, dispatch),
  );

  return (
    <Paper>
      <SectionHeader title="Role Bindings" />
      <SectionBox>
        <SimpleTable
          rowsPerPage={[15, 25, 50]}
          columns={[
            {
              label: 'Type',
              getter: (item) => item.kind
            },
            {
              label: 'Name',
              getter: (item) =>
                <Link
                  routeName={item.metadata.namespace ? "roleBinding" : "clusterRoleBinding"}
                  params={{
                    namespace: item.metadata.namespace || "",
                    name: item.metadata.name
                  }}
                >
                  {item.metadata.name}
                </Link>
            },
            {
              label: 'Namespace',
              getter: (item) => item.metadata.namespace || "All namespaces"
            },
            {
              label: 'Age',
              getter: (item) => timeAgo(item.metadata.creationTimestamp)
            },
          ]}
          data={getJointItems()}
        />
      </SectionBox>
    </Paper>
  );
}