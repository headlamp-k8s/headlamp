import { Box } from '@material-ui/core';
import React from 'react';
import Deployment from '../../lib/k8s/deployment';
import { useFilterFunc } from '../../lib/util';
import { Link, StatusLabel } from '../common';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';
import SimpleTable from '../common/SimpleTable';

export default function DeploymentsList() {
  const [deployments, error] = Deployment.useList();
  const filterFunc = useFilterFunc();

  function renderPods(deployment: Deployment) {
    const { replicas, availableReplicas } = deployment.status;

    return `${availableReplicas || 0}/${replicas || 0}`;
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
    <SectionBox title={<SectionFilterHeader title="Deployments" />}>
      <SimpleTable
        rowsPerPage={[15, 25, 50]}
        filterFunction={filterFunc}
        errorMessage={Deployment.getErrorMessage(error)}
        columns={[
          {
            label: 'Name',
            getter: deployment => <Link kubeObject={deployment} />,
            sort: (d1: Deployment, d2: Deployment) => {
              if (d1.metadata.name < d2.metadata.name) {
                return -1;
              } else if (d1.metadata.name > d2.metadata.name) {
                return 1;
              }
              return 0;
            },
          },
          {
            label: 'Namespace',
            getter: deployment => deployment.getNamespace(),
          },
          {
            label: 'Pods',
            getter: deployment => renderPods(deployment),
          },
          {
            label: 'Replicas',
            getter: deployment => deployment.spec.replicas || 0,
          },
          {
            label: 'Conditions',
            getter: deployment => renderConditions(deployment),
          },
          {
            label: 'Age',
            getter: deployment => deployment.getAge(),
            sort: (d1: Deployment, d2: Deployment) =>
              new Date(d2.metadata.creationTimestamp).getTime() -
              new Date(d1.metadata.creationTimestamp).getTime(),
          },
        ]}
        data={deployments}
        defaultSortingColumn={6}
      />
    </SectionBox>
  );
}
