import { useTranslation } from 'react-i18next';
import PDB from '../../lib/k8s/podDisruptionBudget';
import { SectionBox, SectionFilterHeader } from '../common';
import ResourceTable from '../common/Resource/ResourceTable';

export default function PDBList() {
  const { t } = useTranslation(['glossary', 'frequent', 'pdb']);

  return (
    <SectionBox title={<SectionFilterHeader title={t('glossary|Pod Disruption Budget')} />}>
      <ResourceTable
        resourceClass={PDB}
        columns={[
          'name',
          'namespace',
          {
            label: t('pdb|Min Available'),
            getter: (item: PDB) => item.spec.minAvailable || t('frequent|N/A'),
            sort: true,
          },
          {
            label: t('pdb|Max Unavailable'),
            getter: (item: PDB) => item.spec.maxUnavailable || t('frequent|N/A'),
          },
          {
            label: t('pdb|Allowed Disruptions'),
            getter: (item: PDB) => item.status.disruptionsAllowed || t('frequent|N/A'),
          },
          'age',
        ]}
      />
    </SectionBox>
  );
}
