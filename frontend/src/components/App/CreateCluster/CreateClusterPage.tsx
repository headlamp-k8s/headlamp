import { useTranslation } from 'react-i18next';
import { PageGrid, SectionBox } from '../../common';
import CommandCluster from '../CommandCluster/CommandCluster';

export default function CreateClusterPage() {
  const { t } = useTranslation(['translation']);

  return (
    <PageGrid>
      <SectionBox backLink title={t('translation|Create Cluster')} py={2} mt={[4, 0, 0]}>
        <CommandCluster
          askClusterName
          useGrid
          open
          handleClose={() => {}}
          onConfirm={() => {}}
          command={'start'}
          finishedText={'Done! kubectl is now configured'}
        />
      </SectionBox>
    </PageGrid>
  );
}
