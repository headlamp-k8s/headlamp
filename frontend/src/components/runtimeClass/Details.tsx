import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { RuntimeClass } from '../../lib/k8s/runtime';
import { DetailsGrid } from '../common';

export function RuntimeClassDetails(props: { name?: string; namespace?: string }) {
  const params = useParams<{ namespace: string; name: string }>();
  const { name = params.name, namespace = params.namespace } = props;
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
