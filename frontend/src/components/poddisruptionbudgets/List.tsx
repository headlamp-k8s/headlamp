import { useTranslation } from 'react-i18next';
import PodDisruptionBudget from '../../lib/k8s/podDisruptionBudget';
import { timeAgo, useFilterFunc } from '../../lib/util';
import { Link, SectionBox, SectionFilterHeader, SimpleTable } from '../common';

export default function HpaList() {
  const [hpas, error] = PodDisruptionBudget.useList();
  const filterFunc = useFilterFunc();
  const { t } = useTranslation('glossary');

  return (
    <SectionBox title={<SectionFilterHeader title={t('Pod Disruption Budgets')} />}>
      <SimpleTable
        rowsPerPage={[25, 50]}
        filterFunction={filterFunc}
        errorMessage={PodDisruptionBudget.getErrorMessage(error)}
        columns={[
          {
            label: t('frequent|Name'),
            getter: hpa => <Link kubeObject={hpa} />,
            sort: (i1: PodDisruptionBudget, i2: PodDisruptionBudget) => {
              if (i1.metadata.name < i2.metadata.name) {
                return -1;
              } else if (i1.metadata.name > i2.metadata.name) {
                return 1;
              }
              return 0;
            },
          },
          {
            label: 'Min Unavailable',
            getter: hpa => hpa.jsonData.spec.minUnavailable || 'N/A',
            sort: true,
          },
          {
            label: 'Max Unavailable',
            getter: hpa => hpa.jsonData.spec.maxUnavailable || 'N/A',
            sort: true,
          },
          {
            label: 'Allowed Disruptions',
            getter: hpa => hpa.jsonData.status?.disruptionsAllowed,
            sort: true,
          },
          {
            label: t('frequent|Age'),
            getter: hpa => timeAgo(hpa.metadata.creationTimestamp),
            sort: (i1: PodDisruptionBudget, i2: PodDisruptionBudget) =>
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
