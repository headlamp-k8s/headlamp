import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import PersistentVolume from '../../lib/k8s/persistentVolume';
import Link from '../common/Link';
import { DetailsGrid } from '../common/Resource';
import { StatusLabelByPhase } from './utils';

export function makePVStatusLabel(item: PersistentVolume) {
  const status = item.status!.phase;
  return StatusLabelByPhase(status);
}

export default function VolumeDetails() {
  const { name } = useParams<{ namespace: string; name: string }>();
  const { t } = useTranslation(['glossary', 'translation']);

  return (
    <DetailsGrid
      resourceType={PersistentVolume}
      name={name}
      withEvents
      extraInfo={item =>
        item && [
          {
            name: t('translation|Status'),
            value: makePVStatusLabel(item),
          },
          {
            name: t('Capacity'),
            value: item.spec!.capacity.storage,
          },
          {
            name: t('Access Modes'),
            value: item.spec!.accessModes.join(', '),
          },
          {
            name: t('Reclaim Policy'),
            value: item.spec!.persistentVolumeReclaimPolicy,
          },
          {
            name: t('Storage Class'),
            value: (
              <Link routeName="storageClass" params={{ name: item.spec!.storageClassName }} tooltip>
                {item.spec!.storageClassName}
              </Link>
            ),
          },
        ]
      }
    />
  );
}
