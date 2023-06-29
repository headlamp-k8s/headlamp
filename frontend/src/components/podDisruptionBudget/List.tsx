import { useTranslation } from 'react-i18next';
import PDB from '../../lib/k8s/podDisruptionBudget';
import ResourceListView from '../common/Resource/ResourceListView';

export default function PDBList() {
  const { t } = useTranslation(['glossary', 'frequent', 'pdb']);

  return (
    <ResourceListView
      title={t('glossary|Pod Disruption Budget')}
      resourceClass={PDB}
      columns={[
        'name',
        'namespace',
        {
          id: 'minAvailable',
          label: t('pdb|Min Available'),
          getter: (item: PDB) => item.spec.minAvailable || t('frequent|N/A'),
          sort: true,
        },
        {
          id: 'maxUnavailable',
          label: t('pdb|Max Unavailable'),
          getter: (item: PDB) => item.spec.maxUnavailable || t('frequent|N/A'),
        },
        {
          id: 'allowedDisruptions',
          label: t('pdb|Allowed Disruptions'),
          getter: (item: PDB) => item.status.disruptionsAllowed || t('frequent|N/A'),
        },
        'age',
      ]}
    />
  );
}
