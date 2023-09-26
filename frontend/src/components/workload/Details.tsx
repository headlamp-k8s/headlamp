import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
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
  const { workloadKind } = props;
  const { t } = useTranslation(['glossary', 'translation']);

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

  function showReplicas(item: Workload) {
    return (
      item.kind === 'Deployment' &&
      (item.spec?.status?.replicas !== undefined || item.spec?.replicas !== undefined)
    );
  }

  function renderReplicas(item: Workload) {
    if (!showReplicas(item)) {
      return null;
    }

    let values: { [key: string]: string } = {
      [t('translation|Desired', { context: 'replicas' })]: item.spec.replicas,
      [t('translation|Ready', { context: 'replicas' })]: item.status.readyReplicas,
      [t('translation|Up to date', { context: 'replicas' })]: item.status.updatedReplicas,
      [t('translation|Available', { context: 'replicas' })]: item.status.availableReplicas,
      [t('translation|Total')]: item.status.replicas,
    };

    const validEntries = Object.entries(values).filter(
      ([key]: string[]) => values[key] !== undefined
    );
    values = Object.fromEntries(validEntries);

    if (Object.values(values).length === 0) {
      return null;
    }

    return (
      <MetadataDictGrid
        dict={values}
        gridProps={{
          direction: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
        }}
      />
    );
  }

  return (
    <DetailsGrid
      resourceType={workloadKind}
      name={name}
      withEvents
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
          {
            name: t('Replicas'),
            value: renderReplicas(item),
            hide: !showReplicas(item),
          },
        ]
      }
      extraSections={item =>
        item && [
          {
            id: 'headlamp.workload-conditions',
            section: <ConditionsSection resource={item?.jsonData} />,
          },
          {
            id: 'headlamp.workload-owned-pods',
            section: <OwnedPodsSection resource={item?.jsonData} />,
          },
          {
            id: 'headlamp.workload-containers',
            section: <ContainersSection resource={item?.jsonData} />,
          },
        ]
      }
    />
  );
}
