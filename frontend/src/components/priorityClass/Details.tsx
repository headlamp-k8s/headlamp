import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import PriorityClass from '../../lib/k8s/priorityClass';
import { DetailsGrid, ObjectEventList } from '../common';

export default function PriorityClassDetails() {
  const { t } = useTranslation(['frequent', 'priorityClasses']);
  const { name } = useParams<{ name: string }>();

  return (
    <DetailsGrid
      resourceType={PriorityClass}
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
            name: t('frequent|Description'),
            value: item.description,
          },
        ]
      }
      sectionsFunc={item => item && <ObjectEventList object={item} />}
    />
  );
}
