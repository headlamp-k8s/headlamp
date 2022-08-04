import { useTranslation } from 'react-i18next';
import Namespace from '../../lib/k8s/namespace';
import { StatusLabel } from '../common/Label';
import ResourceTable from '../common/Resource/ResourceTable';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';

export default function NamespacesList() {
  const { t } = useTranslation('glossary');

  function makeStatusLabel(namespace: Namespace) {
    const status = namespace.status.phase;
    return <StatusLabel status={status === 'Active' ? 'success' : 'error'}>{status}</StatusLabel>;
  }

  return (
    <SectionBox
      title={<SectionFilterHeader title={t('Namespaces')} noNamespaceFilter headerStyle="main" />}
    >
      <ResourceTable
        resourceClass={Namespace}
        columns={[
          'name',
          {
            label: t('Status'),
            getter: makeStatusLabel,
            sort: (namespace: Namespace) => namespace.status.phase,
          },
          'age',
        ]}
      />
    </SectionBox>
  );
}
