import { useTranslation } from 'react-i18next';
import PDB from '../../lib/k8s/podDisruptionBudget';
import ResourceListView from '../common/Resource/ResourceListView';

export default function PDBList() {
  const { t } = useTranslation(['glossary', 'translation']);

  return (
    <ResourceListView
      title={t('glossary|Pod Disruption Budget')}
      resourceClass={PDB}
      columns={[
        'name',
        'namespace',
        {
          id: 'minAvailable',
          label: t('translation|Min Available'),
          getValue: (item: PDB) => item.spec.minAvailable || t('translation|N/A'),
        },
        {
          id: 'maxUnavailable',
          label: t('translation|Max Unavailable'),
          getValue: (item: PDB) => item.spec.maxUnavailable || t('translation|N/A'),
        },
        {
          id: 'allowedDisruptions',
          label: t('translation|Allowed Disruptions'),
          getValue: (item: PDB) => item.status.disruptionsAllowed || t('translation|N/A'),
        },
        'cluster',
        'age',
      ]}
    />
  );
}
