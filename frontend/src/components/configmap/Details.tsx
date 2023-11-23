import Box from '@mui/material/Box';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import ConfigMap from '../../lib/k8s/configMap';
import Empty from '../common/EmptyContent';
import { DataField, DetailsGrid } from '../common/Resource';
import { SectionBox } from '../common/SectionBox';

export default function ConfigDetails() {
  const { namespace, name } = useParams<{ namespace: string; name: string }>();
  const { t } = useTranslation(['translation']);

  return (
    <DetailsGrid
      resourceType={ConfigMap}
      name={name}
      namespace={namespace}
      withEvents
      extraSections={item =>
        item && [
          {
            id: 'headlamp.configmap-data',
            section: () => {
              const itemData = item?.data;
              return (
                <SectionBox title={t('translation|Data')}>
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
              );
            },
          },
        ]
      }
    />
  );
}
