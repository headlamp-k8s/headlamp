import { Box } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Deployment from '../../lib/k8s/deployment';
import { StatusLabel } from '../common';
import ResourceTable from '../common/Resource/ResourceTable';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';

export default function DeploymentsList() {
  const { t } = useTranslation('glossary');

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
    <SectionBox title={<SectionFilterHeader title={t('Deployments')} />}>
      <ResourceTable
        resourceClass={Deployment}
        columns={[
          'name',
          'namespace',
          {
            label: t('Pods'),
            getter: deployment => renderPods(deployment),
            sort: sortByPods,
          },
          {
            label: t('Replicas'),
            getter: deployment => deployment.spec.replicas || 0,
            sort: true,
          },
          {
            label: t('Conditions'),
            getter: deployment => renderConditions(deployment),
          },
          'age',
        ]}
      />
    </SectionBox>
  );
}
