import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import React from 'react';
import api, { useConnectApi } from '../../lib/api';
import { timeAgo, useFilterFunc } from '../../lib/util';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';
import SimpleTable from '../common/SimpleTable';
import {Link as RouterLink} from 'react-router-dom';

export default function ClassList() {
  const [storageClassData, setStorageClassData] = React.useState(null);
  const filterFunc = useFilterFunc();

  useConnectApi(
    api.storageClass.list.bind(null, setStorageClassData),
  );

  return (
    <Paper>
      <SectionFilterHeader
        title="Storage Classes"
        noNamespaceFilter
      />
      <SectionBox>
        <SimpleTable
          rowsPerPage={[15, 25, 50]}
          filterFunction={filterFunc}
          columns={[
            {
              label: 'Name',
              getter: (storageClass) => <Link component={RouterLink} to={`/storage/classes/${storageClass.metadata.name}`}>{storageClass.metadata.name}</Link>
            },
            {
              label: 'Reclaim Policy',
              getter: (storageClass) => storageClass.reclaimPolicy
            },
            {
              label: 'Volume Binding Mode',
              getter: (storageClass) => storageClass.volumeBindingMode,
            },
            {
              label: 'Age',
              getter: (storageClass) => timeAgo(storageClass.metadata.creationTimestamp)
            },
          ]}
          data={storageClassData}
        />
      </SectionBox>
    </Paper>
  );
}
