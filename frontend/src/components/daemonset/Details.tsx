import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import DaemonSet from '../../lib/k8s/daemonSet';
import { SectionBox, SimpleTable } from '../common';
import {
  ContainersSection,
  DetailsGrid,
  MetadataDictGrid,
  OwnedPodsSection,
} from '../common/Resource';
import DetailsViewSection from '../DetailsViewSection';

interface TolerationsSection {
  resource: DaemonSet;
  t: (...args: any[]) => string;
}

function TolerationsSection(props: TolerationsSection) {
  const { resource, t } = props;

  if (!resource) {
    return null;
  }

  const tolerations = resource.spec.template.spec?.tolerations || [];

  function getEffectString(effect: string, seconds?: number) {
    if (effect === 'NoExecute' && seconds === undefined) {
      const secondsLabel = seconds === undefined ? 'forever' : `${seconds}s`;
      return `${effect} (${secondsLabel})`;
    }

    return effect;
  }

  return (
    <SectionBox title={t('Tolerations')}>
      <SimpleTable
        data={tolerations}
        columns={[
          {
            label: t('frequent|Key'),
            getter: toleration => toleration.key,
            sort: true,
          },
          {
            label: t('frequent|Operator'),
            getter: toleration => toleration.operator,
            sort: true,
          },
          {
            label: t('frequent|Value'),
            getter: toleration => toleration.value,
            sort: true,
          },
          {
            label: t('frequent|Effect'),
            getter: toleration => getEffectString(toleration.effect, toleration.tolerationSeconds),
            sort: true,
          },
        ]}
        reflectInURL="tolerations"
      />
    </SectionBox>
  );
}

export default function DaemonSetDetails() {
  const { namespace, name } = useParams<{ namespace: string; name: string }>();
  const { t } = useTranslation(['glossary', 'frequent']);

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
              <TolerationsSection resource={item} t={t} />
              <ContainersSection resource={item?.jsonData} />
            </>
          )}
          <DetailsViewSection resource={item} />
        </>
      )}
    />
  );
}
