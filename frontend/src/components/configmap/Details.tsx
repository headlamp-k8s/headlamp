import Box from '@material-ui/core/Box';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import ConfigMap from '../../lib/k8s/configMap';
import Empty from '../common/EmptyContent';
import Loader from '../common/Loader';
import { DataField, MainInfoSection, PageGrid } from '../common/Resource';
import { SectionBox } from '../common/SectionBox';
import DetailsViewSection from '../DetailsViewSection';

export default function ConfigDetails() {
  const { namespace, name } = useParams<{ namespace: string; name: string }>();
  const [item, setItem] = React.useState<ConfigMap | null>(null);
  const itemData = item?.data;
  const { t } = useTranslation(['configmap', 'frequent']);

  ConfigMap.useApiGet(setItem, name, namespace);

  return !item ? (
    <Loader title={t('frequent|Loading resource data')} />
  ) : (
    <PageGrid>
      <MainInfoSection resource={item} />
      <SectionBox title={t('frequent|Data')}>
        {!itemData ? (
          <Empty>{t('No data in this config map')}</Empty>
        ) : (
          Object.keys(itemData).map((key, i) => (
            <Box py={2} key={i}>
              <DataField label={key} value={itemData[key]} />
            </Box>
          ))
        )}
      </SectionBox>
      <DetailsViewSection resource={item} />
    </PageGrid>
  );
}
