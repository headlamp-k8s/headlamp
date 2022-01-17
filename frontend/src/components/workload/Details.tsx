import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLinkProps, useLocation, useParams } from 'react-router-dom';
import DetailsViewPluginRenderer from '../../helpers/renderHelpers';
import { KubeObject, Workload } from '../../lib/k8s/cluster';
import {
  ConditionsSection,
  ContainersSection,
  DetailsGrid,
  MetadataDictGrid,
  OwnedPodsSection,
} from '../common/Resource';

interface WorkloadDetailsProps {
  workloadKind: KubeObject;
}

export default function WorkloadDetails(props: WorkloadDetailsProps) {
  const { namespace, name } = useParams<{ namespace: string; name: string }>();
  const location = useLocation<{ backLink: NavLinkProps['location'] }>();
  const { workloadKind } = props;
  const { t } = useTranslation('glossary');

  function renderUpdateStrategy(item: Workload) {
    if (!item?.spec?.strategy) {
      return null;
    }

    if (item.spec.strategy.type === 'RollingUpdate') {
      const rollingUpdate = item.spec.strategy.rollingUpdate;
      return t('RollingUpdate. Max unavailable: {{ maxUnavailable }}, max surge: {{ maxSurge }}', {
        maxUnavailable: rollingUpdate.maxUnavailable,
        maxSurge: rollingUpdate.maxSurge,
      });
    }

    return item.spec.strategy.type;
  }

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
            value: renderUpdateStrategy(item),
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
          <ConditionsSection resource={item?.jsonData} />
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
