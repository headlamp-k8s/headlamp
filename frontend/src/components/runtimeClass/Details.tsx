import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { RuntimeClass } from '../../lib/k8s/runtime';
import { DetailsGrid } from '../common';

export function RuntimeClassDetails(props: { name?: string; namespace?: string }) {
  const params = useParams<{ namespace: string; name: string }>();
  const name = props.name ?? params.name;
  const namespace = props.namespace ?? params.namespace;
  const { t } = useTranslation(['translation']);

  return (
    <DetailsGrid
      resourceType={RuntimeClass}
      name={name}
      namespace={namespace}
      withEvents
      extraInfo={item =>
        item && [
          {
            name: t('translation|Handler'),
            value: item?.jsonData?.handler,
          },
        ]
      }
    />
  );
}
