import { useTranslation } from 'react-i18next';
import HPA from '../../lib/k8s/hpa';
import { Link, SectionBox, SectionFilterHeader, StatusLabel } from '../common';
import ResourceTable from '../common/Resource/ResourceTable';

export default function HpaList() {
  const { t } = useTranslation(['glossary', 'hpa', 'frequent']);

  return (
    <SectionBox title={<SectionFilterHeader title={t('glossary|Horizontal Pod Autoscalers')} />}>
      <ResourceTable
        resourceClass={HPA}
        columns={[
          'name',
          'namespace',
          {
            label: t('hpa|Reference'),
            getter: item => (
              <Link kubeObject={item.referenceObject}>
                {item.referenceObject?.kind}/{item.referenceObject?.metadata.name}
              </Link>
            ),
          },
          {
            label: t('hpa|Targets'),
            getter: (hpa: HPA) => {
              const value: JSX.Element[] = [];
              const metrics = hpa.metrics(t);
              if (metrics.length) {
                value.push(
                  <StatusLabel
                    key={metrics[0].name}
                    id={metrics[0].name}
                    status=""
                    title={metrics[0].name}
                  >
                    {metrics[0].shortValue}
                  </StatusLabel>
                );
                if (hpa.metrics.length > 1) {
                  value.push(
                    <StatusLabel key="more..." status="">
                      {metrics.length - 1} {t('frequent|more...')}
                    </StatusLabel>
                  );
                }
              }
              return <>{value}</>;
            },
          },
          {
            label: t('hpa|MinReplicas'),
            getter: item => item.spec.minReplicas,
            sort: true,
          },
          {
            label: t('hpa|MaxReplicas'),
            getter: item => item.spec.maxReplicas,
            sort: true,
          },
          {
            label: t('glossary|Replicas'),
            getter: item => item.status.currentReplicas,
            sort: true,
          },
          'age',
        ]}
      />
    </SectionBox>
  );
}
