import { Box } from '@mui/system';
import { useTranslation } from 'react-i18next';
import Endpoints from '../../../lib/k8s/endpoints';
import { StatusLabel } from '../../common';

export function EndpointsGlance({ endpoints }: { endpoints: Endpoints }) {
  const { t } = useTranslation();
  const addresses = endpoints.subsets?.flatMap(it => it.addresses?.map(it => it.ip)) ?? [];
  const ports = endpoints.subsets?.flatMap(it => it.ports) ?? [];

  return (
    <Box display="flex" gap={1} alignItems="center" mt={2} flexWrap="wrap" key="endpoints">
      <StatusLabel status="">
        {t('Addresses')}: {addresses.join(', ')}
      </StatusLabel>
      {ports.map(it =>
        it ? (
          <StatusLabel status="" key={it.protocol + it.port}>
            {it.protocol}:{it.port}
          </StatusLabel>
        ) : null
      )}
    </Box>
  );
}
