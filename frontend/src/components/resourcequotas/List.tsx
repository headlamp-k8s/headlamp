import { useTranslation } from 'react-i18next';
import ResourceQuota from '../../lib/k8s/resourceQuota';
import { timeAgo, useFilterFunc } from '../../lib/util';
import { Link, SectionBox, SectionFilterHeader, SimpleTable } from '../common';

export default function HpaList() {
  const [hpas, error] = ResourceQuota.useList();
  const filterFunc = useFilterFunc();
  const { t } = useTranslation('glossary');

  return (
    <SectionBox title={<SectionFilterHeader title={t('Resource Quotas')} />}>
      <SimpleTable
        rowsPerPage={[25, 50]}
        filterFunction={filterFunc}
        errorMessage={ResourceQuota.getErrorMessage(error)}
        columns={[
          {
            label: t('frequent|Name'),
            getter: rq => <Link kubeObject={rq} />,
            sort: (i1: ResourceQuota, i2: ResourceQuota) => {
              if (i1.metadata.name < i2.metadata.name) {
                return -1;
              } else if (i1.metadata.name > i2.metadata.name) {
                return 1;
              }
              return 0;
            },
          },
          {
            label: 'Request (sum / max)',
            getter: rq =>
              getRequestOrLimitColumn(rq, 'request').map(t => (
                <div>{`${t.resource}: ${t.used} / ${t.hard}`}</div>
              )),
          },
          {
            label: 'Limit (sum / max)',
            getter: rq =>
              getRequestOrLimitColumn(rq, 'limit').map(t => (
                <div>{`${t.resource}: ${t.used} / ${t.hard}`}</div>
              )),
          },
          {
            label: t('frequent|Age'),
            getter: rq => timeAgo(rq.metadata.creationTimestamp),
            sort: (i1: ResourceQuota, i2: ResourceQuota) =>
              new Date(i2.metadata.creationTimestamp).getTime() -
              new Date(i1.metadata.creationTimestamp).getTime(),
          },
        ]}
        data={hpas}
        defaultSortingColumn={4}
      />
    </SectionBox>
  );
}

interface IResourceQuotaItem {
  resource: string;
  used: string;
  hard: string;
}

type ResourceQuotaType = 'request' | 'limit' | 'all';

export function getRequestOrLimitColumn(
  rq: ResourceQuota,
  type: ResourceQuotaType
): IResourceQuotaItem[] {
  const resources: string[] = [];
  for (const resource in rq.jsonData.status?.hard || {}) {
    const isLimit = resource.startsWith('limits.');
    if (type === 'limit' && !isLimit) {
      continue;
    } else if (type === 'request' && isLimit) {
      continue;
    }
    resources.push(resource);
  }
  resources.sort();

  const strings: IResourceQuotaItem[] = [];
  for (const resource of resources) {
    let usedQuantity = rq.jsonData.status.used[resource];
    let hardQuantity = rq.jsonData.status.hard[resource];
    if (resource.endsWith('cpu')) {
      usedQuantity = normalizeCpuCores(usedQuantity);
      hardQuantity = normalizeCpuCores(hardQuantity);
    } else if (resource.endsWith('memory')) {
      usedQuantity = normalizeMemory(usedQuantity);
      hardQuantity = normalizeMemory(hardQuantity);
    }
    strings.push({
      resource,
      used: usedQuantity,
      hard: hardQuantity,
    });
    strings.push();
  }

  return strings;
}

function normalizeCpuCores(cores: string): string {
  if (cores?.endsWith('m')) {
    return Number(cores.substring(0, cores.length - 1)) / 1000 + ' core';
  }
  return cores + ' core';
}

function normalizeMemory(memory: string): string {
  // Suffix:  "" | k | M | G | T | P | E
  // Suffix: Ki | Mi | Gi | Ti | Pi | Ei

  let res = parseInt(memory);
  if (memory.endsWith('Ki')) {
    res *= 1024;
  } else if (memory.endsWith('Mi')) {
    res *= 1024 * 1024;
  } else if (memory.endsWith('Gi')) {
    res *= 1024 * 1024 * 1024;
  } else if (memory.endsWith('Ti')) {
    res *= 1024 * 1024 * 1024 * 1024;
  } else if (memory.endsWith('Ei')) {
    res *= 1024 * 1024 * 1024 * 1024 * 1024;
  } else if (memory.endsWith('k')) {
    res *= 1024;
  } else if (memory.endsWith('M')) {
    res *= 1024 * 1024;
  } else if (memory.endsWith('G')) {
    res *= 1024 * 1024 * 1024;
  } else if (memory.endsWith('T')) {
    res *= 1024 * 1024 * 1024 * 1024;
  } else if (memory.endsWith('E')) {
    res *= 1024 * 1024 * 1024 * 1024 * 1024;
  }

  return formatBytes(res);
}

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
