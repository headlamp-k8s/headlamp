import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import PriorityClasses from '../../lib/k8s/priorityClasses';
import { DetailsGrid, ObjectEventList } from '../common';

export default function PriorityClassDetails() {
  const { t } = useTranslation(['frequent', 'priorityClasses']);
  const { name } = useParams<{ name: string }>();

  return (
    <DetailsGrid
      resourceType={PriorityClasses}
      name={name}
      extraInfo={item =>
        item && [
          {
            name: t('frequent|Value'),
            value: item.value,
          },
          {
            name: t('priorityClasses|Global Default'),
            value: item.globalDefault || 'False',
          },
          {
            name: t('priorityClasses|Preemption Policy'),
            value: item.preemptionPolicy,
          },
          {
            name: t('priorityClasses|Description'),
            value: item.description,
          },
        ]
      }
      sectionsFunc={item => item && <ObjectEventList object={item} />}
    />
  );
}
