import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { RuntimeClass } from '../../lib/k8s/runtime';
import { DetailsGrid } from '../common';

export function RuntimeClassDetails() {
  const { t } = useTranslation('resource');
  const { namespace, name } = useParams<{ namespace: string; name: string }>();

  return (
    <DetailsGrid
      resourceType={RuntimeClass}
      name={name}
      namespace={namespace}
      withEvents
      extraInfo={item =>
        item && [
          {
            name: t('Handler'),
            value: item?.jsonData?.handler,
          },
        ]
      }
    />
  );
}
