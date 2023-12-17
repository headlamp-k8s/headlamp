import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import IngressClass from '../../lib/k8s/ingressClass';
import { DetailsGrid } from '../common/Resource';

export default function IngressClassDetails() {
  const { name } = useParams<{ name: string }>();
  const { t } = useTranslation('glossary');

  return (
    <DetailsGrid
      resourceType={IngressClass}
      name={name}
      withEvents
      extraInfo={item =>
        item && [
          {
            name: t('translation|Default'),
            value: item.isDefault ? t('translation|Yes') : t('translation|No'),
          },
        ]
      }
    />
  );
}
