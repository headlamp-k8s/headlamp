import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import DetailsViewPluginRenderer from '../../helpers/renderHelpers';
import DaemonSet from '../../lib/k8s/daemonSet';
import {
  ContainersSection,
  DetailsGrid,
  MetadataDictGrid,
  OwnedPodsSection,
} from '../common/Resource';

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
          {
            name: t('Node Selector'),
            value: <MetadataDictGrid dict={item.spec.template.spec.nodeSelector || {}} />,
          },
        ]
      }
      sectionsFunc={item => (
        <>
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
