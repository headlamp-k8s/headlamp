import { useParams } from 'react-router-dom';
import ResourceQuota from '../../lib/k8s/resourceQuota';
import { SectionBox, SimpleTable } from '../common';
import { DetailsGrid } from '../common/Resource';
import { getRequestOrLimitColumn } from './List';

export default function ResourceQuotaDetails() {
  const { namespace, name } = useParams<{ namespace: string; name: string }>();

  return (
    <DetailsGrid
      resourceType={ResourceQuota}
      name={name}
      namespace={namespace}
      extraInfo={item =>
        item &&
        [
          {
            name: 'Min Unavailable',
            value: item.jsonData.spec.scopes?.join(', '),
            hide: !item.jsonData.spec.scopes,
          },
        ].filter(t => !t.hide)
      }
      sectionsFunc={item =>
        item && (
          <>
            {(item.jsonData.spec.scopes ?? [])?.length > 0 && <ResourceQuotaScopes item={item} />}
            <ResourceUsage item={item} />
          </>
        )
      }
    />
  );
}

function ResourceUsage({ item }: { item: ResourceQuota }) {
  const items = getRequestOrLimitColumn(item, 'all');
  return (
    <SectionBox title={'Details'}>
      <SimpleTable
        columns={[
          {
            label: 'Resource',
            getter: t => t.resource,
          },
          {
            label: 'Used',
            getter: t => t.used,
          },
          {
            label: 'Hard',
            getter: t => t.hard,
          },
        ]}
        data={items}
      />
    </SectionBox>
  );
}

function ResourceQuotaScopes({ item }: { item: ResourceQuota }) {
  return (
    <SectionBox title={'Scopes'}>
      <SimpleTable
        columns={[
          {
            label: 'Scope',
            getter: t => t,
          },
          {
            label: 'Description',
            getter: t => helpTextForResourceQuotaScope(t),
          },
        ]}
        data={item.jsonData.spec.scopes.sort()}
      />
    </SectionBox>
  );
}

function helpTextForResourceQuotaScope(scope: string): string {
  switch (scope) {
    case 'Terminating':
      return 'Matches all pods that have an active deadline. These pods have a limited lifespan on a node before being actively terminated by the system.';
    case 'NotTerminating':
      return 'Matches all pods that do not have an active deadline. These pods usually include long running pods whose container command is not expected to terminate.';
    case 'BestEffort':
      return 'Matches all pods that do not have resource requirements set. These pods have a best effort quality of service.';
    case 'NotBestEffort':
      return 'Matches all pods that have at least one resource requirement set. These pods have a burstable or guaranteed quality of service.';
    case 'PriorityClass':
      return 'Match all pod objects that have priority class mentioned.';
    case 'CrossNamespacePodAffinity':
      return 'Match all pod objects that have cross-namespace pod (anti)affinity mentioned.';
    default:
      return '';
  }
}
