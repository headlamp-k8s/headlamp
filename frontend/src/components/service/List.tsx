import React from 'react';
import { useTranslation } from 'react-i18next';
import Service from '../../lib/k8s/service';
import { useFilterFunc } from '../../lib/util';
import Link from '../common/Link';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';
import SimpleTable from '../common/SimpleTable';

export default function ServiceList() {
  const [services, error] = Service.useList();
  const filterFunc = useFilterFunc(['.jsonData.spec.type']);
  const { t } = useTranslation('glossary');

  return (
    <SectionBox title={<SectionFilterHeader title={t('Services')} />}>
      <SimpleTable
        rowsPerPage={[15, 25, 50]}
        filterFunction={filterFunc}
        errorMessage={Service.getErrorMessage(error)}
        columns={[
          {
            label: t('frequent|Name'),
            getter: service => <Link kubeObject={service} />,
            sort: (s1: Service, s2: Service) => {
              if (s1.metadata.name < s2.metadata.name) {
                return -1;
              } else if (s1.metadata.name > s2.metadata.name) {
                return 1;
              }
              return 0;
            },
          },
          {
            label: t('glossary|Namespace'),
            getter: service => service.getNamespace(),
            sort: true,
          },
          {
            label: t('Type'),
            getter: service => service.spec.type,
            sort: true,
          },
          {
            label: t('Cluster IP'),
            getter: service => service.spec.clusterIP,
            sort: true,
          },
          {
            label: t('External IP'),
            getter: service => service.getExternalAddresses(),
            sort: true,
          },
          {
            label: t('frequent|Age'),
            getter: service => service.getAge(),
            sort: (s1: Service, s2: Service) =>
              new Date(s2.metadata.creationTimestamp).getTime() -
              new Date(s1.metadata.creationTimestamp).getTime(),
          },
        ]}
        data={services}
        defaultSortingColumn={5}
      />
    </SectionBox>
  );
}
