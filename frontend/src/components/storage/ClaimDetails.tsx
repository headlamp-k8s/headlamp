import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import PersistentVolumeClaim from '../../lib/k8s/persistentVolumeClaim';
import Link from '../common/Link';
import { DetailsGrid } from '../common/Resource';
import { StatusLabelByPhase } from './utils';

export function makePVCStatusLabel(item: PersistentVolumeClaim) {
  const status = item.status!.phase;
  return StatusLabelByPhase(status);
}

export default function VolumeClaimDetails() {
  const { namespace, name } = useParams<{ namespace: string; name: string }>();
  const { t } = useTranslation(['glossary', 'translation']);

  return (
    <DetailsGrid
      resourceType={PersistentVolumeClaim}
      name={name}
      namespace={namespace}
      withEvents
      extraInfo={item =>
        item && [
          {
            name: t('translation|Status'),
            value: makePVCStatusLabel(item),
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
