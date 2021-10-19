import chevronRight from '@iconify/icons-mdi/chevron-right';
import { InlineIcon } from '@iconify/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Service from '../../lib/k8s/service';
import { ValueLabel } from '../common/Label';
import { DetailsGrid, MetadataDictGrid } from '../common/Resource';
import { SectionBox } from '../common/SectionBox';
import SimpleTable from '../common/SimpleTable';

export default function ServiceDetails() {
  const { namespace, name } = useParams<{ namespace: string; name: string }>();
  const { t } = useTranslation('glossary');

  return (
    <DetailsGrid
      resourceType={Service}
      name={name}
      namespace={namespace}
      extraInfo={item =>
        item && [
          {
            name: t('Type'),
            value: item.spec.type,
          },
          {
            name: t('Cluster IP'),
            value: item.spec.clusterIP,
          },
          {
            name: t('Selector'),
            value: <MetadataDictGrid dict={item.spec.selector} />,
          },
        ]
      }
      sectionsFunc={item =>
        item && (
          <SectionBox title={t('Ports')}>
            <SimpleTable
              data={item.spec.ports}
              columns={[
                {
                  label: t('Protocol'),
                  datum: 'protocol',
                },
                {
                  label: t('frequent|Name'),
                  datum: 'name',
                },
                {
                  label: t('Ports'),
                  getter: ({ port, targetPort }) => (
                    <React.Fragment>
                      <ValueLabel>{port}</ValueLabel>
                      <InlineIcon icon={chevronRight} />
                      <ValueLabel>{targetPort}</ValueLabel>
                    </React.Fragment>
                  ),
                },
              ]}
            />
          </SectionBox>
        )
      }
    />
  );
}
