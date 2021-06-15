import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLinkProps, useLocation, useParams } from 'react-router-dom';
import { KubeObject, Workload } from '../../lib/k8s/cluster';
import {
  ContainersSection,
  MainInfoSection,
  MetadataDictGrid,
  PageGrid,
  ReplicasSection,
} from '../common/Resource';

interface WorkloadDetailsProps {
  workloadKind: KubeObject;
}

export default function WorkloadDetails(props: WorkloadDetailsProps) {
  const { namespace, name } = useParams<{ namespace: string; name: string }>();
  const location = useLocation<{ backLink: NavLinkProps['location'] }>();
  const { workloadKind } = props;
  const [item, setItem] = React.useState<Workload | null>(null);
  const { t } = useTranslation('glossary');

  workloadKind.useApiGet(setItem, name, namespace);

  return (
    <PageGrid>
      <MainInfoSection
        backLink={location.state?.backLink}
        resource={item}
        extraInfo={
          item && [
            {
              name: t('Strategy Type'),
              value: item.spec.strategy && item.spec.strategy.type,
              hide: !item.spec.strategy,
            },
            {
              name: t('Selector'),
              value: item.spec.selector && (
                <MetadataDictGrid
                  dict={item.spec.selector.matchLabels as { [key: string]: string }}
                />
              ),
            },
          ]
        }
      />
      <ReplicasSection resource={item?.jsonData} />
      <ContainersSection resource={item?.jsonData} />
    </PageGrid>
  );
}
