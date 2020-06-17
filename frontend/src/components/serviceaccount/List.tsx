import React from 'react';
import api, { useConnectApi } from '../../lib/k8s/api';
import { timeAgo, useFilterFunc } from '../../lib/util';
import Link from '../common/Link';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';
import SimpleTable from '../common/SimpleTable';

export default function ServiceAccountList() {
  const [serviceAccounts, setServiceAccounts] = React.useState(null);
  const filterFunc = useFilterFunc();

  useConnectApi(
    api.serviceAccount.list.bind(null, null, setServiceAccounts),
  );

  return (
    <SectionBox
      title={
        <SectionFilterHeader
          title="Service Accounts"
        />
      }
    >
      <SimpleTable
        rowsPerPage={[15, 25, 50]}
        filterFunction={filterFunc}
        columns={[
          {
            label: 'Name',
            getter: (serviceAccount) =>
              <Link
                routeName="serviceAccount"
                params={{
                  namespace: serviceAccount.metadata.namespace,
                  name:  serviceAccount.metadata.name
                }}
              >
                {serviceAccount.metadata.name}
              </Link>
          },
          {
            label: 'Namespace',
            getter: (serviceAccount) => serviceAccount.metadata.namespace
          },
          {
            label: 'Age',
            getter: (serviceAccount) => timeAgo(serviceAccount.metadata.creationTimestamp)
          },
        ]}
        data={serviceAccounts}
      />
    </SectionBox>
  );
}
