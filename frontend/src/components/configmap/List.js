import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import api, { useConnectApi } from '../../lib/api';
import { timeAgo } from '../../lib/util';
import SectionHeader from '../common/SectionHeader';
import SimpleTable from '../common/SimpleTable';

export default function ConfigMapList() {
  const [configMapsData, setConfigMapsData] = React.useState([]);

  function setConfigMaps(configMaps) {
    const data = configMaps.map(configMap => {
      return {
        name: configMap.metadata.name,
        namespace: configMap.metadata.namespace,
        date: timeAgo(configMap.metadata.creationTimestamp),
      };
    });
    setConfigMapsData(data);
  }

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
          data={configMapsData}
        />
      </Box>
    </Paper>
  );
}
