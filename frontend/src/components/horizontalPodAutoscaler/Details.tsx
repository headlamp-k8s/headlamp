import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import HPA from '../../lib/k8s/hpa';
import { ConditionsSection, DetailsGrid, Link, ObjectEventList, SimpleTable } from '../common';

export default function HpaDetails() {
  const { namespace, name } = useParams<{ namespace: string; name: string }>();
  const { t } = useTranslation(['hpa', 'frequent']);

  return (
    <DetailsGrid
      resourceType={HPA}
      name={name}
      namespace={namespace}
      extraInfo={item =>
        item && [
          {
            name: t('hpa|Reference'),
            value: (
              <Link kubeObject={item.referenceObject}>
                {item.referenceObject?.kind}/{item.referenceObject?.metadata.name}
              </Link>
            ),
          },
          {
            name: t('hpa|Metrics'),
            value: (
              <SimpleTable
                data={item.metrics(t)}
                columns={[
                  { label: t('frequent|Name'), getter: item => item.definition },
                  { label: t('hpa|(Current/Target)'), getter: item => item.value },
                ]}
              />
            ),
          },
          {
            name: t('hpa|MinReplicas'),
            value: item.spec.minReplicas,
          },
          {
            name: t('hpa|MaxReplicas'),
            value: item.spec.maxReplicas,
          },
          {
            name: t('hpa|Deployment pods'),
            value: t(`hpa|{{ currentReplicas }} current / {{ desiredReplicas }} desired`, {
              currentReplicas: item.status.currentReplicas,
              desiredReplicas: item.status.desiredReplicas,
            }),
          },
        ]
      }
      sectionsFunc={item =>
        item && (
          <>
            <ConditionsSection resource={item?.jsonData} />
            <ObjectEventList object={item} />
          </>
        )
      }
    />
  );
}
