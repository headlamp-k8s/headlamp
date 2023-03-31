import { useTranslation } from 'react-i18next';
import NetworkPolicy from '../../lib/k8s/networkpolicy';
import { SectionBox, SectionFilterHeader } from '../common';
import ResourceTable from '../common/Resource/ResourceTable';

export function NetworkPolicyList() {
  const { t } = useTranslation('glossary');
  return (
    <SectionBox title={<SectionFilterHeader title={t('Network Policies')} />}>
      <ResourceTable
        resourceClass={NetworkPolicy}
        columns={[
          'name',
          'namespace',
          {
            label: t('Type'),
            getter: networkpolicy => {
              console.log(networkpolicy);
              const isIngressAvailable =
                networkpolicy.jsonData.spec.ingress &&
                networkpolicy.jsonData.spec.ingress.length > 0;
              const isEgressAvailable =
                networkpolicy.jsonData.spec.egress && networkpolicy.jsonData.spec.egress.length > 0;
              return isIngressAvailable && isEgressAvailable
                ? 'Ingress and Egress'
                : isIngressAvailable
                ? 'Ingress'
                : isEgressAvailable
                ? 'Egress'
                : 'None';
            },
          },
          'age',
        ]}
      />
    </SectionBox>
  );
}
