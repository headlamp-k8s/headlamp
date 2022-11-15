import { useTranslation } from 'react-i18next';
import ResourceQuota from '../../lib/k8s/resourceQuota';
import { SectionBox, SectionFilterHeader, StatusLabel } from '../common';
import ResourceTable from '../common/Resource/ResourceTable';

export default function ResourceQuotaList() {
  const { t } = useTranslation(['resourceQuota', 'glossary']);
  return (
    <SectionBox title={<SectionFilterHeader title={t('glossary|Resource Quotas')} />}>
      <ResourceTable
        resourceClass={ResourceQuota}
        columns={[
          'name',
          'namespace',
          {
            label: t('resourceQuota|Request'),
            getter: (item: ResourceQuota) => {
              const requests: JSX.Element[] = [];
              item.requests.forEach((request: string) => {
                requests.push(<StatusLabel status="">{request}</StatusLabel>);
              });
              return <>{requests}</>;
            },
          },
          {
            label: t('resourceQuota|Limit'),
            getter: (item: ResourceQuota) => {
              const limits: JSX.Element[] = [];
              item.limits.forEach((limit: string) => {
                limits.push(
                  <StatusLabel key={limit} status="">
                    {limit}
                  </StatusLabel>
                );
              });
              return <>{limits}</>;
            },
          },
          'age',
        ]}
      />
    </SectionBox>
  );
}
