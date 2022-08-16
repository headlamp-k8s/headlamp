import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { KubeContainer } from '../../lib/k8s/cluster';
import Deployment from '../../lib/k8s/deployment';
import { LightTooltip, StatusLabel } from '../common';
import ResourceListView from '../common/Resource/ResourceListView';

export default function DeploymentsList() {
  const { t } = useTranslation(['glossary', 'translation']);

  function renderPods(deployment: Deployment) {
    const { replicas, availableReplicas } = deployment.status;

    return `${availableReplicas || 0}/${replicas || 0}`;
  }

  function sortByPods(d1: Deployment, d2: Deployment) {
    const { replicas: r1, availableReplicas: avail1 } = d1.status;
    const { replicas: r2, availableReplicas: avail2 } = d2.status;

    const availSorted = avail1 - avail2;
    if (availSorted === 0) {
      return r1 - r2;
    }

    return availSorted;
  }

  function renderConditions(deployment: Deployment) {
    const { conditions } = deployment.status;
    if (!conditions) {
      return null;
    }

    return conditions
      .sort((c1: any, c2: any) => {
        if (c1.type < c2.type) {
          return -1;
        } else if (c1.type > c2.type) {
          return 1;
        } else {
          return 0;
        }
      })
      .map((condition: any) => {
        const { type, message } = condition;
        return (
          <Box pr={0.5} display="inline-block">
            <StatusLabel status="">
              <span title={message} key={type}>
                {type}
              </span>
            </StatusLabel>
          </Box>
        );
      });
  }

  return (
    <ResourceListView
      title={t('Deployments')}
      resourceClass={Deployment}
      columns={[
        'name',
        'namespace',
        {
          id: 'pods',
          label: t('Pods'),
          getter: deployment => renderPods(deployment),
          sort: sortByPods,
          gridTemplate: 0.5,
        },
        {
          id: 'replicas',
          label: t('Replicas'),
          getter: deployment => deployment.spec.replicas || 0,
          sort: true,
          gridTemplate: 0.6,
        },
        {
          id: 'conditions',
          label: t('translation|Conditions'),
          getter: deployment => renderConditions(deployment),
        },
        {
          id: 'containers',
          label: t('Containers'),
          getter: deployment => {
            const containers = deployment.getContainers().map((c: KubeContainer) => c.name);
            const containerText = containers.join(', ');
            const containerTooltip = containers.join('\n');
            return (
              <LightTooltip title={containerTooltip} interactive>
                {containerText}
              </LightTooltip>
            );
          },
        },
        {
          id: 'images',
          label: t('Images'),
          getter: deployment => {
            const images = deployment.getContainers().map((c: KubeContainer) => c.image);
            const imageText = images.join(', ');
            const imageTooltip = images.join('\n');
            return (
              <LightTooltip title={imageTooltip} interactive>
                {imageText}
              </LightTooltip>
            );
          },
        },
        {
          id: 'selector',
          label: t('Selector'),
          getter: deployment => {
            const matchLabels = deployment.getMatchLabelsList();
            const text = matchLabels.join(', ');
            const tooltip = matchLabels.join('\n');
            return (
              <LightTooltip title={tooltip} interactive>
                {text}
              </LightTooltip>
            );
          },
          show: false,
        },
        'age',
      ]}
    />
  );
}
