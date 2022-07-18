import { useTranslation } from 'react-i18next';
import Ingress from '../../lib/k8s/ingress';
import ResourceTable from '../common/Resource/ResourceTable';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';

export default function IngressList() {
  const { t } = useTranslation('glossary');

  return (
    <SectionBox title={<SectionFilterHeader title={t('Ingresses')} />}>
      <ResourceTable
        resourceClass={Ingress}
        columns={[
          'name',
          'namespace',
          {
            label: t('Hosts'),
            getter: ingress => ingress.getHosts(),
          },
          'age',
        ]}
      />
    </SectionBox>
  );
}
