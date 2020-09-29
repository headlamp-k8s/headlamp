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
              <Link kubeObject={configMap} />
          },
          {
            label: 'Namespace',
            getter: (configMap) => configMap.getNamespace(),
          },
          {
            label: 'Age',
            getter: (configMap) => configMap.getAge(),
          },
        ]}
        data={configMaps}
      />
    </SectionBox>
  );
}
