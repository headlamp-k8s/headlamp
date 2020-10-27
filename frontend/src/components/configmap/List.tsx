import React from 'react';
import ConfigMap from '../../lib/k8s/configMap';
import { useFilterFunc } from '../../lib/util';
import Link from '../common/Link';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';
import SimpleTable from '../common/SimpleTable';

export default function ConfigMapList() {
  const [configMaps, error] = ConfigMap.useList();
  const filterFunc = useFilterFunc();

  return (
    <SectionBox
      title={
        <SectionFilterHeader
          title="Config Maps"
        />
      }
    >
      <SimpleTable
        rowsPerPage={[15, 25, 50]}
        filterFunction={filterFunc}
        errorMessage={ConfigMap.getErrorMessage(error)}
        columns={[
          {
            label: 'Name',
            getter: (configMap) =>
              <Link kubeObject={configMap} />,
            sort: (c1: ConfigMap, c2: ConfigMap) => {
              if (c1.metadata.name < c2.metadata.name) {
                return -1;
              } else if (c1.metadata.name > c2.metadata.name) {
                return 1;
              }
              return 0;
            }
          },
          {
            label: 'Namespace',
            getter: (configMap) => configMap.getNamespace(),
          },
          {
            label: 'Age',
            getter: (configMap) => configMap.getAge(),
            sort: (c1: ConfigMap, c2: ConfigMap) =>
              new Date(c2.metadata.creationTimestamp).getTime() -
              new Date(c1.metadata.creationTimestamp).getTime()
          },
        ]}
        data={configMaps}
        defaultSortingColumn={3}
      />
    </SectionBox>
  );
}
