import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import DaemonSet from '../../lib/k8s/daemonSet';
import { ContainersSection, DetailsGrid, MetadataDictGrid } from '../common/Resource';

export default function DaemonSetDetails() {
  const { namespace, name } = useParams<{ namespace: string; name: string }>();
  const { t } = useTranslation('glossary');

  return (
    <DetailsGrid
      resourceType={DaemonSet}
      name={name}
      namespace={namespace}
      extraInfo={item =>
        item && [
          {
            name: t('Update Strategy'),
            value: item?.spec.updateStrategy.type,
          },
          {
            name: t('Selector'),
            value: <MetadataDictGrid dict={item.spec.selector.matchLabels || {}} />,
          },
        ]
      }
      sectionsFunc={item => <ContainersSection resource={item?.jsonData} />}
    />
  );
}
