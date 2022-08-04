import { useTranslation } from 'react-i18next';
import ServiceAccount from '../../lib/k8s/serviceAccount';
import ResourceTable from '../common/Resource/ResourceTable';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';

export default function ServiceAccountList() {
  const { t } = useTranslation('glossary');

  return (
    <SectionBox title={<SectionFilterHeader title={t('Service Accounts')} />}>
      <ResourceTable resourceClass={ServiceAccount} columns={['name', 'namespace', 'age']} />
    </SectionBox>
  );
}
