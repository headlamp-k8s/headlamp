import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import DetailsViewPluginRenderer from '../../helpers/renderHelpers';
import { StringDict } from '../../lib/k8s/cluster';
import StatefulSet from '../../lib/k8s/statefulSet';
import { MainInfoSection, MetadataDictGrid, PageGrid } from '../common/Resource';

export default function StatefulSetDetails() {
  const { namespace, name } = useParams<{ namespace: string; name: string }>();
  const [item, setItem] = React.useState<StatefulSet | null>(null);
  const { t } = useTranslation('glossary');

  StatefulSet.useApiGet(setItem, name, namespace);

  return (
    <PageGrid>
      <MainInfoSection
        resource={item}
        extraInfo={
          item && [
            {
              name: t('Update Strategy'),
              value: item.spec.updateStrategy.type,
            },
            {
              name: t('Selector'),
              value: <MetadataDictGrid dict={item.spec.selector.matchLabels as StringDict} />,
            },
          ]
        }
      />
      <DetailsViewPluginRenderer resource={item} />
    </PageGrid>
  );
}
