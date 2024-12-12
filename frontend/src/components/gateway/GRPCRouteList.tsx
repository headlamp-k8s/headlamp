import { useTranslation } from 'react-i18next';
import GRPCRoute from '../../lib/k8s/grpcRoute';
import ResourceListView from '../common/Resource/ResourceListView';

export default function GRPCRouteList() {
  const { t } = useTranslation(['glossary', 'translation']);

  return (
    <ResourceListView
      title={t('GRPCRoutes')}
      resourceClass={GRPCRoute}
      columns={['name', 'namespace', 'cluster', 'age']}
    />
  );
}
