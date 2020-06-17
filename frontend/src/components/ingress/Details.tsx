import React from 'react';
import { useParams } from 'react-router-dom';
import api, { useConnectApi } from '../../lib/k8s/api';
import { KubeIngress } from '../../lib/k8s/cluster';
import Loader from '../common/Loader';
import { MainInfoSection, PageGrid } from '../common/Resource';
import { SectionBox } from '../common/SectionBox';
import SimpleTable from '../common/SimpleTable';

export default function IngressDetails() {
  const { namespace, name } = useParams();
  const [item, setItem] = React.useState<KubeIngress | null>(null);

  useConnectApi(
    api.ingress.get.bind(null, namespace, name, setItem),
  );

  function getHostsData() {
    const data: {
      host: string;
      path?: string;
      backend: {
        serviceName: string;
        servicePort: string;
      };
    }[] = [];
    item?.spec.rules.forEach(({host, http}) => {
      http.paths.forEach(pathData => {
        data.push({...pathData, host: host});
      });
    });

    return data;
  }

  return (
    !item ? <Loader /> :
    <PageGrid>
      <MainInfoSection

        resource={item}
      />
      <SectionBox title="Rules">
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
    </PageGrid>
  );
}
