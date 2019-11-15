import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import api, { useConnectApi } from '../../lib/api';
import { timeAgo } from '../../lib/util';
import SectionHeader from '../common/SectionHeader';
import SimpleTable from '../common/SimpleTable';

export default function ConfigMapList() {
  const [configMaps, setConfigMaps] = React.useState([]);

  useConnectApi(
    api.configMap.list.bind(null, null, setConfigMaps),
  );

  return (
    <Paper>
      <SectionHeader title="Config Maps" />
      <Box margin={1}>
        <SimpleTable
          rowsPerPage={[15, 25, 50]}
          columns={[
            {
              label: 'Name',
              getter: (configMap) => configMap.metadata.name
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
      </Box>
    </Paper>
  );
}