import { useTranslation } from 'react-i18next';
import Endpoints from '../../lib/k8s/endpoints';
import { useFilterFunc } from '../../lib/util';
import ResourceTable from '../common/Resource/ResourceTable';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';

export default function EndpointList() {
  const { t } = useTranslation('glossary');
  const filterFunc = useFilterFunc([
    '.jsonData.subsets[*].addresses[*].ip',
    '.jsonData.subsets[*].ports[*].port',
    '.jsonData.subsets[*].ports[*].name',
  ]);

  return (
    <SectionBox title={<SectionFilterHeader title={t('Endpoints')} />}>
      <ResourceTable
        resourceClass={Endpoints}
        filterFunction={filterFunc}
        columns={[
          'name',
          'namespace',
          {
            label: t('Addresses'),
            getter: endpoint => endpoint.getAddressesText(),
            cellProps: { style: { width: '40%', maxWidth: '40%' } },
          },
          'age',
        ]}
      />
    </SectionBox>
  );
}
