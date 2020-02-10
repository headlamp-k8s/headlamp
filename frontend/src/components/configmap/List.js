import Paper from '@material-ui/core/Paper';
import React from 'react';
import api, { useConnectApi } from '../../lib/api';
import { timeAgo, useFilterFunc } from '../../lib/util';
import Link from '../common/Link';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';
import SimpleTable from '../common/SimpleTable';

export default function ConfigMapList() {
  const [configMaps, setConfigMaps] = React.useState(null);
  const filterFunc = useFilterFunc();

  useConnectApi(
    api.configMap.list.bind(null, null, setConfigMaps),
  );

  return (
    <Paper>
      <SectionFilterHeader
        title="Config Maps"
      />
      <SectionBox>
        <SimpleTable
          rowsPerPage={[15, 25, 50]}
          filterFunction={filterFunc}
          columns={[
            {
              label: 'Name',
              getter: (configMap) =>
                <Link
                  routeName="configMap"
                  params={{
                    namespace: configMap.metadata.namespace,
                    name: configMap.metadata.name
                  }}
                >
                  {configMap.metadata.name}
                </Link>
            },
            {
              label: 'Namespace',
              getter: (configMap) => configMap.metadata.namespace
            },
            {
              label: 'Age',
              getter: (configMap) => timeAgo(configMap.metadata.creationTimestamp)
            },
          ]}
          data={configMaps}
        />
      </SectionBox>
    </Paper>
  );
}