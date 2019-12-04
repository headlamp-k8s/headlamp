import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import _ from 'lodash';
import React from 'react';
import { useParams } from 'react-router-dom';
import api, { useConnectApi } from '../../lib/api';
import { InfoLabel, ValueLabel } from '../common/Label';
import Loader from '../common/Loader';
import { MainInfoSection,PageGrid } from '../common/Resource';
import { SectionBox } from '../common/SectionBox';
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
    !item ? <Loader /> :
    <PageGrid
      sections={[
        <MainInfoSection
          resource={item}
        />,
        <Paper>
          <SectionHeader title="Rules" />
          <SectionBox>
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
          </SectionBox>
        </Paper>,
      ]}
    />
  );
}
