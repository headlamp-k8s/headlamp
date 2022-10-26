import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import ResourceQuota from '../../lib/k8s/resourceQuota';
import { DetailsGrid, SimpleTable } from '../common';

export default function ResourceQuotaDetails() {
  const { namespace, name } = useParams<{ namespace: string; name: string }>();
  const { t } = useTranslation(['frequent', 'resourceQuota']);

  return (
    <DetailsGrid
      resourceType={ResourceQuota}
      name={name}
      namespace={namespace}
      extraInfo={item =>
        item && [
          {
            name: t('frequent|Status'),
            value: (
              <SimpleTable
                data={item.resourceStats}
                columns={[
                  {
                    label: t('resourceQuota|Resource'),
                    getter: item => item.name,
                  },
                  {
                    label: t('resourceQuota|Used'),
                    getter: item => item.used,
                  },
                  {
                    label: t('resourceQuota|Hard'),
                    getter: item => item.hard,
                  },
                ]}
              />
            ),
          },
        ]
      }
    />
  );
}
