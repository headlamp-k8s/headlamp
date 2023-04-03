import {
  Link,
  SectionBox,
  SimpleTable,
  StatusLabel,
} from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { Box } from '@material-ui/core';
import { useState } from 'react';
import { useEffect } from 'react';
import { listReleases } from '../../api/releases';

export default function ReleaseList() {
  const [releases, setReleases] = useState([]);

  useEffect(() => {
    listReleases().then(response => {
      console.log('response is', response);
      setReleases(response.releases);
    });
  }, []);

  return (
    <SectionBox title="Releases" textAlign="center" paddingTop={2}>
      <SimpleTable
        columns={[
          {
            label: 'Name',
            getter: release => (
              <Box display="flex">
                <Box>
                  <img
                    width={25}
                    height={25}
                    src={release.chart.metadata.icon}
                    alt={release.chart.metadata.name}
                  />
                </Box>
                <Box ml={1}>
                  <Link routeName={'helm'}>{release.name}</Link>
                </Box>
              </Box>
            ),
          },
          {
            label: 'Namespace',
            getter: release => release.namespace,
          },
          {
            label: 'App Version',
            getter: release => release.chart.metadata.appVersion,
          },
          {
            label: 'Chart Version',
            getter: release => release.chart.metadata.version,
          },
          {
            label: 'Status',
            getter: release => (
              <StatusLabel status={release.info.status === 'deployed' ? 'success' : 'error'}>
                {release.info.status}
              </StatusLabel>
            ),
          },
        ]}
        data={releases}
      />
    </SectionBox>
  );
}
