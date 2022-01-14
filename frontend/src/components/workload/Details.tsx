import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLinkProps, useLocation, useParams } from 'react-router-dom';
import DetailsViewPluginRenderer from '../../helpers/renderHelpers';
import { KubeObject } from '../../lib/k8s/cluster';
import {
  ContainersSection,
  DetailsGrid,
  MetadataDictGrid,
  OwnedPodsSection,
  ReplicasSection,
} from '../common/Resource';

interface WorkloadDetailsProps {
  workloadKind: KubeObject;
}

export default function WorkloadDetails(props: WorkloadDetailsProps) {
  const { namespace, name } = useParams<{ namespace: string; name: string }>();
  const location = useLocation<{ backLink: NavLinkProps['location'] }>();
  const { workloadKind } = props;
  const { t } = useTranslation('glossary');

  return (
    <DetailsGrid
      resourceType={workloadKind}
      backLink={location.state?.backLink}
      name={name}
      namespace={namespace}
      extraInfo={item =>
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
      sectionsFunc={item => (
        <>
          <ReplicasSection resource={item?.jsonData} />
          {item && (
            <>
              <OwnedPodsSection resource={item?.jsonData} />
              <ContainersSection resource={item?.jsonData} />
            </>
          )}
          <DetailsViewPluginRenderer resource={item} />
        </>
      )}
    />
  );
}
