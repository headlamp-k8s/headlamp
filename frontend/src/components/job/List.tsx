import React from 'react';
import Job from '../../lib/k8s/job';
import { useFilterFunc } from '../../lib/util';
import { Link } from '../common';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';
import SimpleTable from '../common/SimpleTable';

export default function JobsList() {
  const [jobs, error] = Job.useList();
  const filterFunc = useFilterFunc();

  function getCompletions(job: Job) {
    return `${job.spec.completions}/${job.spec.parallelism}`;
  }

  function getCondition(job: Job) {
    const {conditions} = job.status;
    if (!conditions) {
      return null;
    }

    return conditions.find(({status}: {status: string}) => status === 'True').type;
  }

  return (
    <SectionBox
      title={
        <SectionFilterHeader
          title="Jobs"
        />
      }
    >
      <SimpleTable
        rowsPerPage={[15, 25, 50]}
        filterFunction={filterFunc}
        errorMessage={Job.getErrorMessage(error)}
        columns={[
          {
            label: 'Name',
            getter: (job) => <Link kubeObject={job} />,
            sort: (j1: Job, j2: Job) => {
              if (j1.metadata.name < j2.metadata.name) {
                return -1;
              } else if (j1.metadata.name > j2.metadata.name) {
                return 1;
              }
              return 0;
            }
          },
          {
            label: 'Namespace',
            getter: (job) => job.getNamespace()
          },
          {
            label: 'Completions',
            getter: (job) => getCompletions(job)
          },
          {
            label: 'Conditions',
            getter: (job) => getCondition(job)
          },
          {
            label: 'Age',
            getter: (job) => job.getAge(),
            sort: (j1: Job, j2: Job) =>
              new Date(j2.metadata.creationTimestamp).getTime() -
              new Date(j1.metadata.creationTimestamp).getTime()
          }
        ]}
        data={jobs}
        defaultSortingColumn={5}
      />
    </SectionBox>
  );
}
