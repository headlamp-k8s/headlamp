import { useParams } from 'react-router-dom';
import HorizontalPodAutoscaler, {
  KubeHorizontalPodAutoscaler,
} from '../../lib/k8s/horizontalPodAutoscaler';
import { SimpleTable } from '../common';
import { ConditionsSection, DetailsGrid } from '../common/Resource';
import { HpaReferenceLink } from './List';

export default function HorizontalPodAutoscalerDetails() {
  const { namespace, name } = useParams<{ namespace: string; name: string }>();

  return (
    <DetailsGrid
      resourceType={HorizontalPodAutoscaler}
      name={name}
      namespace={namespace}
      extraInfo={item =>
        item &&
        [
          {
            name: 'Reference',
            value: <HpaReferenceLink hpa={item} />,
          },
          {
            name: 'Metrics',
            value: (
              <SimpleTable
                columns={[
                  {
                    label: 'type',
                    getter: t => t.type,
                  },
                  {
                    label: 'current / target',
                    getter: t => t.value,
                  },
                ]}
                data={formatHPAMetrics(item.jsonData)}
              />
            ),
          },
          {
            name: 'Min Replicas',
            value: item.jsonData.spec.minReplicas || '<unset>',
          },
          {
            name: 'Max Replicas',
            value: item.jsonData.spec.maxReplicas,
          },
          {
            name: 'Behavior',
            value: item.jsonData.spec.behavior,
            hide: !item.jsonData.spec.behavior,
          },
          {
            name: `${item.jsonData.spec.scaleTargetRef?.kind} pods`,
            value: `${item.jsonData.status.currentReplicas} current / ${item.jsonData.status.desiredReplicas} desired`,
          },
        ].filter(t => !t.hide)
      }
      sectionsFunc={item =>
        item && (
          <>
            <ConditionsSection resource={item?.jsonData} />
            {/* <ResourceEvents item={item} /> */}
          </>
        )
      }
    />
  );
}

function formatHPAMetrics(hpa: KubeHorizontalPodAutoscaler): IAutoscalingMetricItem[] {
  if (hpa.apiVersion === 'autoscaling/v2beta1') {
    return formatHPAMetricsV2Beta1(hpa.spec.metrics, hpa.status.currentMetrics);
  }
  console.error('unsupported hpa version', hpa);
  return [
    {
      type: '[Unsupported]',
      value: '[Unsupported]',
    },
  ];
}

type IAutoscalingMetricSpec = any;
type IAutoscalingMetricStatus = any;
type IAutoscalingMetricItem = any;

function formatHPAMetricsV2Beta1(
  specs: IAutoscalingMetricSpec[],
  statuses: IAutoscalingMetricStatus[]
): IAutoscalingMetricItem[] {
  if (!specs?.length) {
    return [];
  }

  const list: IAutoscalingMetricItem[] = [];

  for (let i = 0; i < specs.length; i++) {
    const spec = specs[i];
    switch (spec?.type) {
      case 'External': {
        if (spec?.external?.targetAverageValue !== undefined) {
          let current = '<unknown>';
          if (statuses?.length > i && statuses[i].external?.currentAverageValue !== undefined) {
            current = statuses[i].external.currentAverageValue;
          }
          list.push({
            type: `${spec.external.metricName} (target average value)`,
            value: `${current} / ${spec.external.targetAverageValue}`,
          });
        } else {
          let current = '<unknown>';
          if (statuses?.length > i && !!statuses[i].external) {
            current = statuses[i].external.currentValue;
          }
          list.push({
            type: `${spec.external.metricName} (target value)`,
            value: `${current} / ${spec.external.targetValue}`,
          });
        }
        break;
      }
      case 'Pods': {
        let current = '<unknown>';
        if (statuses?.length > i && !!statuses[i].pods) {
          current = statuses[i].pods.currentAverageValue;
        }
        list.push({
          type: `${spec.pods.metricName} on pods`,
          value: `${current} / ${spec.pods.targetAverageValue}`,
        });
        break;
      }
      case 'Object': {
        if (spec?.object?.averageValue !== undefined) {
          let current = '<unknown>';
          if (statuses?.length > i && statuses[i]?.object?.averageValue !== undefined) {
            current = statuses[i].object.averageValue;
          }
          list.push({
            type: `${spec.object.metricName} on ${spec.object.target?.kind}/${spec.object.target?.name} (target average value)`,
            value: `${current} / ${spec.object.averageValue}`,
          });
        } else {
          let current = '<unknown>';
          if (statuses?.length > i && !!statuses[i].object) {
            current = statuses[i].object.currentValue;
          }
          list.push({
            type: `${spec.object.metricName} on ${spec.object.target?.kind}/${spec.object.target?.name} (target value)`,
            value: `${current} / ${spec.object.targetValue}`,
          });
        }
        break;
      }
      case 'Resource': {
        if (spec?.resource?.targetAverageValue !== undefined) {
          let current = '<unknown>';
          if (statuses?.length > i && !!statuses[i].resource) {
            current = statuses[i].resource.currentAverageValue;
          }
          list.push({
            type: `resource ${spec.resource.name} on pods`,
            value: `${current} / ${spec.resource.targetAverageValue}`,
          });
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
          list.push({
            type: `resource ${spec.resource.name} on pods (as a percentage of request)`,
            value: `${current} / ${target}`,
          });
        }
        break;
      }
      case 'ContainerResource': {
        if (spec.containerResource?.targetAverageValue !== undefined) {
          let current = '<unknown>';
          if (statuses?.length > i && !!statuses[i].containerResource) {
            current = statuses[i].containerResource.currentAverageValue;
          }
          list.push({
            type: `resource ${spec.containerResource.name} of container "${spec.containerResource.container}" on pods`,
            value: `${current} / ${spec.containerResource.targetAverageValue}`,
          });
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
          list.push({
            type: `resource ${spec.containerResource.name} of container "${spec.containerResource.container}" on pods (as a percentage of request)`,
            value: `${current} / ${target}`,
          });
        }
        break;
      }
      default: {
        list.push({
          type: `<unknown metric type ${spec.type}`,
          value: '<unkown>',
        });
        break;
      }
    }
  }

  return list;
}
