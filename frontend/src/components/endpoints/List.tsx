import { useTranslation } from 'react-i18next';
import Endpoints from '../../lib/k8s/endpoints';
import { useFilterFunc } from '../../lib/util';
import LabelListItem from '../common/LabelListItem';
import ResourceListView from '../common/Resource/ResourceListView';

export default function EndpointList() {
  const { t } = useTranslation(['glossary', 'frequent']);
  const filterFunc = useFilterFunc([
    '.jsonData.subsets[*].addresses[*].ip',
    '.jsonData.subsets[*].ports[*].port',
    '.jsonData.subsets[*].ports[*].name',
  ]);

  return (
    <ResourceListView
      title={t('glossary|Endpoints')}
      resourceClass={Endpoints}
      filterFunction={filterFunc}
      columns={[
        'name',
        'namespace',
        {
          id: 'addresses',
          label: t('frequent|Addresses'),
          getter: endpoint => <LabelListItem labels={endpoint.getAddresses()} />,
          gridTemplate: 1.5,
        },
        'age',
      ]}
    />
  );
}
