import { Box } from '@mui/system';
import { useTranslation } from 'react-i18next';
import Service from '../../../lib/k8s/service';
import { StatusLabel } from '../../common';

export function ServiceGlance({ service }: { service: Service }) {
  const { t } = useTranslation();
  const externalIP = service.getExternalAddresses();

  return (
    <Box display="flex" gap={1} alignItems="center" mt={2} flexWrap="wrap" key="service">
      <StatusLabel status="">
        {t('Type')}: {service.spec.type}
      </StatusLabel>
      <StatusLabel status="">
        {t('glossary|Cluster IP')}: {service.spec.clusterIP}
      </StatusLabel>
      {externalIP && (
        <StatusLabel status="">
          {t('glossary|External IP')}: {externalIP}
        </StatusLabel>
      )}
      {service.spec?.ports?.map(it => (
        <StatusLabel status="" key={it.protocol + it.port}>
          {it.protocol}:{it.port}
        </StatusLabel>
      ))}
    </Box>
  );
}
