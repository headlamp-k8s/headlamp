import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import PriorityClass from '../../lib/k8s/priorityClass';
import { DetailsGrid } from '../common';

export default function PriorityClassDetails() {
  const { t } = useTranslation(['translation']);
  const { name } = useParams<{ name: string }>();

  return (
    <DetailsGrid
      resourceType={PriorityClass}
      name={name}
      withEvents
      extraInfo={item =>
        item && [
          {
            name: t('translation|Value'),
            value: item.value,
          },
          {
            name: t('translation|Global Default'),
            value: item.globalDefault || 'False',
          },
          {
            name: t('translation|Preemption Policy'),
            value: item.preemptionPolicy,
          },
          {
            name: t('translation|Description'),
            value: item.description,
          },
        ]
      }
    />
  );
}
