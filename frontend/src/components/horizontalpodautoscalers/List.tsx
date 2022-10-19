import { makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import HorizontalPodAutoscaler, {
  KubeHorizontalPodAutoscaler,
} from '../../lib/k8s/horizontalPodAutoscaler';
import { timeAgo, useFilterFunc } from '../../lib/util';
import { Link, SectionBox, SectionFilterHeader, SimpleTable } from '../common';

export default function HpaList() {
  const [hpas, error] = HorizontalPodAutoscaler.useList();
  const filterFunc = useFilterFunc();
  const { t } = useTranslation('glossary');

  return (
    <SectionBox title={<SectionFilterHeader title={t('Horizontal Pod Autoscalers')} />}>
      <SimpleTable
        rowsPerPage={[25, 50]}
        filterFunction={filterFunc}
        errorMessage={HorizontalPodAutoscaler.getErrorMessage(error)}
        columns={[
          {
            label: t('frequent|Name'),
            getter: hpa => <Link kubeObject={hpa} />,
            sort: (i1: HorizontalPodAutoscaler, i2: HorizontalPodAutoscaler) => {
              if (i1.metadata.name < i2.metadata.name) {
                return -1;
              } else if (i1.metadata.name > i2.metadata.name) {
                return 1;
              }
              return 0;
            },
          },
          {
            label: 'Reference',
            getter: hpa => <HpaReferenceLink hpa={hpa} />,
            sort: true,
          },
          {
            label: 'Targets',
            getter: hpa => formatHPAMetrics(hpa.jsonData),
          },
          {
            label: 'Min Pods',
            getter: hpa => hpa.jsonData.spec.minReplicas,
          },
          {
            label: 'Max Pods',
            getter: hpa => hpa.jsonData.spec.maxReplicas,
          },
          {
            label: 'Replicas',
            getter: hpa => hpa.jsonData.status?.currentReplicas,
          },
          {
            label: t('frequent|Age'),
            getter: hpa => timeAgo(hpa.metadata.creationTimestamp),
            sort: (i1: HorizontalPodAutoscaler, i2: HorizontalPodAutoscaler) =>
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

const useStyles = makeStyles(() => ({
  eventInvolvedObject: {
    wordBreak: 'break-all',
  },
}));

export function HpaReferenceLink({ hpa }: { hpa: HorizontalPodAutoscaler }) {
  const classes = useStyles();

  const makeObjectLink = (hpa: HorizontalPodAutoscaler) => {
    const spec = hpa.jsonData.spec;
    const kind = spec.scaleTargetRef.kind?.toLowerCase();
    const obj = hpa.targetObjectInstance;

    if (!!obj) {
      return (
        <Link kubeObject={obj}>
          {kind}/{obj.getName()}
        </Link>
      );
    }

    return `${kind}/${spec.scaleTargetRef.name}`;
  };

  return <div className={classes.eventInvolvedObject}>{makeObjectLink(hpa)}</div>;
}

function formatHPAMetrics(hpa: KubeHorizontalPodAutoscaler) {
  if (hpa.apiVersion === 'autoscaling/v2beta1') {
    return formatHPAMetricsV2Beta1(hpa.spec.metrics, hpa.status.currentMetrics);
  }
  console.log(hpa);
  return '[Unsupported]';
}

type IAutoscalingMetricSpec = any;
type IAutoscalingMetricStatus = any;
function formatHPAMetricsV2Beta1(
  specs: IAutoscalingMetricSpec[],
  statuses: IAutoscalingMetricStatus[]
): string {
  if (!specs?.length) {
    return '<none>';
  }

  let list: string[] = [];
  const max = 2;
  let more = false;
  let count = 0;
  for (let i = 0; i < specs.length; i++) {
    const spec = specs[i];
    switch (spec?.type) {
      case 'External': {
        if (spec?.external?.targetAverageValue !== undefined) {
          let current = '<unknown>';
          if (statuses?.length > i && statuses[i].external?.currentAverageValue !== undefined) {
            current = statuses[i].external.currentAverageValue;
          }
          list.push(`${current}/${spec.external.targetAverageValue} (avg)`);
        } else {
          let current = '<unknown>';
          if (statuses?.length > i && !!statuses[i].external) {
            current = statuses[i].external.currentValue;
          }
          list.push(`${current}/${spec.external.targetValue}`);
        }
        break;
      }
      case 'Pods': {
        let current = '<unknown>';
        if (statuses?.length > i && !!statuses[i].pods) {
          current = statuses[i].pods.currentAverageValue;
        }
        list.push(`${current}/${spec.pods.targetAverageValue}`);
        break;
      }
      case 'Object': {
        if (spec?.object?.averageValue !== undefined) {
          let current = '<unknown>';
          if (statuses?.length > i && statuses[i]?.object?.averageValue !== undefined) {
            current = statuses[i].object.averageValue;
          }
          list.push(`${current}/${spec.object.averageValue} (avg)`);
        } else {
          let current = '<unknown>';
          if (statuses?.length > i && !!statuses[i].object) {
            current = statuses[i].object.currentValue;
          }
          list.push(`${current}/${spec.object.targetValue}`);
        }
        break;
      }
      case 'Resource': {
        if (spec?.resource?.targetAverageValue !== undefined) {
          let current = '<unknown>';
          if (statuses?.length > i && !!statuses[i].resource) {
            current = statuses[i].resource.currentAverageValue;
          }
          list.push(`${current}/${spec.resource.targetAverageValue}`);
        } else {
          let current = '<unknown>';
          if (
            statuses?.length > i &&
            statuses[i].resource?.currentAverageUtilization !== undefined
          ) {
            current = `${statuses[i].resource.currentAverageUtilization}%`;
          }

          let target = '<auto>';
          if (spec?.resource?.targetAverageUtilization !== undefined) {
            target = `${spec.resource.targetAverageUtilization}%`;
          }
          list.push(`${current}/${target}`);
        }
        break;
      }
      case 'ContainerResource': {
        if (spec.containerResource?.targetAverageValue !== undefined) {
          let current = '<unknown>';
          if (statuses?.length > i && !!statuses[i].containerResource) {
            current = statuses[i].containerResource.currentAverageValue;
          }
          list.push(`${current}/${spec.containerResource.targetAverageValue}`);
        } else {
          let current = '<unknown>';
          if (
            statuses?.length > i &&
            statuses[i].containerResource?.currentAverageUtilization !== undefined
          ) {
            current = `${statuses[i].containerResource.currentAverageUtilization}%`;
          }

          let target = '<auto>';
          if (spec?.containerResource?.targetAverageUtilization !== undefined) {
            target = `${spec.containerResource.targetAverageUtilization}%`;
          }
          list.push(`${current}/${target}`);
        }
        break;
      }
      default: {
        list.push(`<unkown type>`);
        break;
      }
    }

    count++;
  }

  if (count > max) {
    list = list.slice(0, max);
    more = true;
  }

  const ret = list.join(' ,');
  if (more) {
    return `${ret} + ${count - max} more...`;
  }
  return ret;
}
