import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { KubeObject } from '../../lib/k8s/cluster';
import Event from '../../lib/k8s/event';
import { SimpleTable } from '../common';

export function EventsDetails({ resource }: { resource: KubeObject }) {
  const [events] = Event.useList({ limit: 100 });
  const { t } = useTranslation('translation');

  return (
    <Box
      sx={{
        overflowX: 'auto',
      }}
    >
      <Typography variant="h6">Events</Typography>

      <SimpleTable
        data={events?.filter(it => it.involvedObject.uid === resource.metadata.uid) ?? []}
        sx={{ width: '800px' }}
        columns={[
          {
            label: t('Reason'),
            getter: event => event.reason,
          },
          {
            label: t('Message'),
            getter: event => event.message ?? '',
          },
        ]}
      />
    </Box>
  );
}
