import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import DetailsViewPluginRenderer from '../../helpers/renderHelpers';
import PersistentVolumeClaim from '../../lib/k8s/persistentVolumeClaim';
import { StatusLabel } from '../common/Label';
import { MainInfoSection, PageGrid } from '../common/Resource';

export default function VolumeClaimDetails() {
  const { namespace, name } = useParams<{ namespace: string; name: string }>();
  const [item, setItem] = React.useState<PersistentVolumeClaim | null>(null);
  const { t } = useTranslation('glossary');

  PersistentVolumeClaim.useApiGet(setItem, name, namespace);

  function makeStatusLabel(item: PersistentVolumeClaim) {
    const status = item.status!.phase;
    return <StatusLabel status={status === 'Bound' ? 'success' : 'error'}>{status}</StatusLabel>;
  }

  return (
    <PageGrid>
      <MainInfoSection
        resource={item}
        extraInfo={
          item && [
            {
              name: t('Status'),
              value: makeStatusLabel(item),
            },
            {
              name: t('Capacity'),
              value: item.spec!.resources.requests.storage,
            },
            {
              name: t('Access Modes'),
              value: item.spec!.accessModes.join(', '),
            },
            {
              name: t('Volume Mode'),
              value: item.spec!.volumeMode,
            },
            {
              name: t('Storage Class'),
              value: item.spec!.storageClassName,
            },
          ]
        }
      />
      <DetailsViewPluginRenderer resource={item} />
    </PageGrid>
  );
}
