import { useTranslation } from 'react-i18next';
import PersistentVolumeClaim from '../../lib/k8s/persistentVolumeClaim';
import { Link } from '../common';
import LabelListItem from '../common/LabelListItem';
import ResourceListView from '../common/Resource/ResourceListView';
import { makePVCStatusLabel } from './ClaimDetails';

export default function VolumeClaimList() {
  const { t } = useTranslation(['glossary', 'translation']);

  return (
    <ResourceListView
      title={t('Persistent Volume Claims')}
      resourceClass={PersistentVolumeClaim}
      columns={[
        'name',
        'namespace',
        {
          id: 'className',
          label: t('Class Name'),
          getter: volumeClaim => {
            const name = volumeClaim.spec.storageClassName;
            if (!name) {
              return '';
            }
            return (
              <Link routeName="storageClass" params={{ name }} tooltip>
                {name}
              </Link>
            );
          },
          sort: (v1, v2) => v1.spec.storageClassName.localeCompare(v2.spec.storageClassName),
        },
        {
          id: 'capacity',
          label: t('Capacity'),
          getter: volumeClaim => volumeClaim.status.capacity?.storage,
          sort: true,
          gridTemplate: 0.8,
        },
        {
          id: 'accessModes',
          label: t('Access Modes'),
          getter: volumeClaim => <LabelListItem labels={volumeClaim.spec.accessModes || []} />,
          sort: (v1, v2) =>
            v1.spec.accessModes.join('').localeCompare(v2.spec.accessModes.join('')),
        },
        {
          id: 'volumeMode',
          label: t('Volume Mode'),
          getter: volumeClaim => volumeClaim.spec.volumeMode,
          sort: true,
        },
        {
          id: 'volume',
          label: t('Volume'),
          getter: volumeClaim => {
            const name = volumeClaim.spec.volumeName;
            if (!name) {
              return '';
            }
            return (
              <Link routeName="persistentVolume" params={{ name }} tooltip>
                {name}
              </Link>
            );
          },
        },
        {
          id: 'status',
          label: t('translation|Status'),
          getter: volume => makePVCStatusLabel(volume),
          gridTemplate: 0.3,
          sort: true,
        },
        'age',
      ]}
    />
  );
}
