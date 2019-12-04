import Paper from '@material-ui/core/Paper';
import React from 'react';
import { useParams } from 'react-router-dom';
import api, { useConnectApi } from '../../lib/api';
import Loader from '../common/Loader';
import { MainInfoSection, PageGrid } from '../common/Resource';
import { SectionBox } from '../common/SectionBox';
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
    !item ? <Loader /> :
    <PageGrid
      sections={[
        <MainInfoSection
          resource={item}
          mainInfo={[
            {
              name: 'Reference Kind',
              value: item.roleRef.kind,
            },
            {
              name: 'Reference Name',
              value: item.roleRef.name,
            },
            {
              name: 'Ref. API Group',
              value: item.roleRef.apiGroup,
            }
          ]}
        />,
        <Paper>
          <SectionHeader title="Binding Info" />
          <SectionBox>
            <SimpleTable
              data={item.subjects}
              columns={[
                {
                  label: 'Kind',
                  getter: item => item.kind,
                },
                {
                  label: 'Name',
                  getter: item => item.name,
                },
                {
                  label: 'Namespace',
                  getter: item => item.namespace,
                },
              ]}
            />
          </SectionBox>
        </Paper>,
      ]}
    />
  );
}
