import { useTranslation } from 'react-i18next';
import Secret from '../../lib/k8s/secret';
import { useFilterFunc } from '../../lib/util';
import ResourceTable from '../common/Resource/ResourceTable';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';

export default function SecretList() {
  const filterFunc = useFilterFunc(['.jsonData.type']);
  const { t } = useTranslation('glossary');

  return (
    <SectionBox title={<SectionFilterHeader title={t('Secrets')} />}>
      <ResourceTable
        resourceClass={Secret}
        filterFunction={filterFunc}
        columns={[
          'name',
          'namespace',
          {
            label: t('Type'),
            getter: secret => secret.type,
            sort: true,
          },
          'age',
        ]}
      />
    </SectionBox>
  );
}
