import { useTranslation } from 'react-i18next';
import Service from '../../lib/k8s/service';
import { StatusLabel } from '../common';
import ResourceTable from '../common/Resource/ResourceTable';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';

export default function ServiceList() {
  const { t } = useTranslation('glossary');

  return (
    <SectionBox title={<SectionFilterHeader title={t('Services')} />}>
      <ResourceTable
        resourceClass={Service}
        columns={[
          'name',
          'namespace',
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
            label: 'Selector',
            getter: service => {
              const selectors: JSX.Element[] = [];
              Object.keys(service.spec.selector).forEach((key: string) => {
                selectors.push(
                  <StatusLabel key={key} status="">
                    {key}={service.spec.selector[key]}
                  </StatusLabel>
                );
              });
              return <>{selectors}</>;
            },
          },
          'age',
        ]}
      />
    </SectionBox>
  );
}
