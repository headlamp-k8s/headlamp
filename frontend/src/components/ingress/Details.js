import Paper from '@material-ui/core/Paper';
import React from 'react';
import { useParams } from 'react-router-dom';
import api, { useConnectApi } from '../../lib/api';
import Loader from '../common/Loader';
import { MainInfoSection, PageGrid } from '../common/Resource';
import { SectionBox } from '../common/SectionBox';
import SectionHeader from '../common/SectionHeader';
import SimpleTable from '../common/SimpleTable';

export default function IngressDetails(props) {
  const { namespace, name } = useParams();
  const [item, setItem] = React.useState(null);

  useConnectApi(
    api.ingress.get.bind(null, namespace, name, setItem),
  );

  function getHostsData() {
    const data =[];
    item.spec.rules.forEach(({host, http}) => {
      http.paths.forEach(pathData => {
        data.push({...pathData, host: host});
      });
    });

    return data;
  }

  return (
    !item ? <Loader /> :
    <PageGrid
      sections={[
        <MainInfoSection
          resource={item}
        />,
        <Paper>
          <SectionHeader
            title="Rules"
          />
          <SectionBox>
            <SimpleTable
              rowsPerPage={[15, 25, 50]}
              emptyMessage="No rules data to be shown."
              columns={[
                {
                  label: 'Host',
                  getter: (data) => data.host
                },
                {
                  label: 'Path',
                  getter: (data) => data.path || ''
                },
                {
                  label: 'Service',
                  getter: (data) => data.backend.serviceName
                },
                {
                  label: 'Port',
                  getter: (data) => data.backend.servicePort
                },
              ]}
              data={getHostsData()}
            />
          </SectionBox>
        </Paper>
      ]}
    />
  );
}
