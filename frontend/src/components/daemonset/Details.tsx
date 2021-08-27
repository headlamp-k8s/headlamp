import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import DetailsViewPluginRenderer from '../../helpers/renderHelpers';
import DaemonSet from '../../lib/k8s/daemonSet';
import { ContainersSection, MainInfoSection, MetadataDictGrid, PageGrid } from '../common/Resource';

export default function DaemonSetDetails() {
  const { namespace, name } = useParams<{ namespace: string; name: string }>();
  const [item, setItem] = React.useState<DaemonSet | null>(null);
  const { t } = useTranslation('glossary');

  DaemonSet.useApiGet(setItem, name, namespace);

  return (
    <PageGrid>
      <MainInfoSection
        resource={item}
        extraInfo={
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
      />
      <ContainersSection resource={item?.jsonData} />
      <DetailsViewPluginRenderer resource={item} />
    </PageGrid>
  );
}
