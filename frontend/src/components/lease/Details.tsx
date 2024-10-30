import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { Lease } from '../../lib/k8s/lease';
import { DateLabel, DetailsGrid } from '../common';

export function LeaseDetails(props: { name?: string; namespace?: string }) {
  const params = useParams<{ namespace: string; name: string }>();
  const { name = params.name, namespace = params.namespace } = props;
  const { t } = useTranslation();

  return (
    <DetailsGrid
      resourceType={Lease}
      name={name}
      namespace={namespace}
      withEvents
      extraInfo={item =>
        item && [
          {
            name: t('Holder Identity'),
            value: item.spec.holderIdentity,
          },
          {
            name: t('Lease Duration Seconds'),
            value: item.spec.leaseDurationSeconds,
          },
          {
            name: t('Renew Time'),
            value: <DateLabel date={item.spec.renewTime} />,
          },
        ]
      }
    />
  );
}
