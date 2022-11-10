import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Ingress from '../../lib/k8s/ingress';
import { DetailsGrid } from '../common/Resource';
import { SectionBox } from '../common/SectionBox';
import SimpleTable from '../common/SimpleTable';

export default function IngressDetails() {
  const { namespace, name } = useParams<{ namespace: string; name: string }>();
  const { t } = useTranslation('glossary');

  function getHostsData(item: Ingress | null) {
    const data: {
      host: string;
      path?: string;
      backend: {
        serviceName: string;
        servicePort: string;
      };
    }[] = [];
    item?.spec.rules.forEach(({ host, http }) => {
      http.paths.forEach(pathData => {
        data.push({ ...pathData, host: host });
      });
    });

    return data;
  }

  return (
    <DetailsGrid
      resourceType={Ingress}
      name={name}
      namespace={namespace}
      sectionsFunc={item => (
        <SectionBox title={t('Rules')}>
          <SimpleTable
            rowsPerPage={[15, 25, 50]}
            emptyMessage={t('ingress|No rules data to be shown.')}
            columns={[
              {
                label: t('Host'),
                getter: data => data.host,
              },
              {
                label: t('Path'),
                getter: data => data.path || '',
              },
              {
                label: t('Service'),
                getter: data => data.backend.serviceName,
              },
              {
                label: t('Port'),
                getter: data => data.backend.servicePort,
              },
            ]}
            data={getHostsData(item)}
            reflectInURL="rules"
          />
        </SectionBox>
      )}
    />
  );
}
