import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import DetailsViewPluginRenderer from '../../helpers/renderHelpers';
import { KubeObject } from '../../lib/k8s/cluster';
import {
  ContainersSection,
  DetailsGrid,
  MetadataDictGrid,
  ReplicasSection,
} from '../common/Resource';

interface WorkloadDetailsProps {
  workloadKind: KubeObject;
}

export default function WorkloadDetails(props: WorkloadDetailsProps) {
  const { namespace, name } = useParams<{ namespace: string; name: string }>();
  const { workloadKind } = props;
  const { t } = useTranslation('glossary');

  return (
    <DetailsGrid
      resourceType={workloadKind}
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
          <ContainersSection resource={item?.jsonData} />
          <DetailsViewPluginRenderer resource={item} />
        </>
      )}
    />
  );
}
