import { useTranslation } from 'react-i18next';
import PersistentVolume from '../../lib/k8s/persistentVolume';
import { LightTooltip, Link } from '../common';
import LabelListItem from '../common/LabelListItem';
import ResourceListView from '../common/Resource/ResourceListView';

export default function VolumeList() {
  const { t } = useTranslation(['glossary', 'translation']);

  return (
    <ResourceListView
      title={t('Persistent Volumes')}
      headerProps={{
        noNamespaceFilter: true,
      }}
      resourceClass={PersistentVolume}
      columns={[
        'name',
        {
          id: 'capacity',
          label: t('Capacity'),
          getter: volume => volume.spec.capacity.storage,
          sort: true,
        },
        {
          id: 'accessModes',
          label: t('Access Modes'),
          getter: volume => <LabelListItem labels={volume?.spec?.accessModes || []} />,
          sort: true,
        },
        {
          id: 'reclaimPolicy',
          label: t('Reclaim Policy'),
          getter: volume => volume.spec.persistentVolumeReclaimPolicy,
          sort: true,
        },
        {
          id: 'claim',
          label: t('Claim'),
          getter: volume => {
            const claim = volume.spec.claimRef?.name;
            const claimNamespace = volume.spec.claimRef?.namespace;
            return (
              <Link
                routeName="persistentVolumeClaim"
                params={{ name: claim, namespace: claimNamespace }}
                tooltip
              >
                {claim}
              </Link>
            );
          },
          sort: true,
        },
        {
          id: 'storageClass',
          label: t('Storage Class'),
          getter: volume => volume.spec.storageClassName,
          sort: true,
        },
        {
          id: 'reason',
          label: t('translation|Reason'),
          getter: volume => {
            const reason = volume.status.reason;
            return <LightTooltip title={reason}>{reason}</LightTooltip>;
          },
          show: false,
          sort: true,
        },
        {
          id: 'status',
          label: t('translation|Status'),
          getter: volume => volume.status.phase,
          sort: true,
        },
        'age',
      ]}
    />
  );
}
