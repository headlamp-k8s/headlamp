import { makeStyles } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import PodDisruptionBudget from '../../lib/k8s/podDisruptionBudget';
import { SimpleTable } from '../common';
import { DetailsGrid } from '../common/Resource';

const useStyles = makeStyles(() => ({
  compactTable: {
    '& table': {
      tableLayout: 'auto',
      width: '200px',
      '& td': {
        padding: '4px 0',
      },
    },
  },
}));

export default function PodDisruptionBudgetDetails() {
  const classes = useStyles();
  const { namespace, name } = useParams<{ namespace: string; name: string }>();

  return (
    <DetailsGrid
      resourceType={PodDisruptionBudget}
      name={name}
      namespace={namespace}
      extraInfo={item =>
        item &&
        [
          {
            name: 'Min Unavailable',
            value: item.jsonData.spec.minUnavailable,
            hide: !item.jsonData.spec.minUnavailable,
          },
          {
            name: 'Max Unavailable',
            value: item.jsonData.spec.maxUnavailable,
            hide: !item.jsonData.spec.maxUnavailable,
          },
          //   {
          //     name: 'Selector',
          //     value: <LabelComponent fullText={getLabelSelector(item.jsonData) ?? '<undefined>'} />,
          //   },
          {
            name: 'Status',
            value: (
              <div className={classes.compactTable}>
                <SimpleTable
                  columns={[
                    {
                      label: '',
                      getter: t => t.type,
                    },
                    {
                      label: '',
                      getter: t => t.value,
                    },
                  ]}
                  data={[
                    {
                      type: 'Allowed disruptions',
                      value: item.jsonData.status?.disruptionsAllowed,
                    },
                    {
                      type: 'Current healthy',
                      value: item.jsonData.status?.currentHealthy,
                    },
                    {
                      type: 'Desired healthy',
                      value: item.jsonData.status?.desiredHealthy,
                    },
                    { type: 'Total expected', value: item.jsonData.status?.expectedPods },
                  ]}
                />
              </div>
            ),
          },
        ].filter(t => !t.hide)
      }
      sectionsFunc={item => item && <>{/* <ResourceEvents item={item} /> */}</>}
    />
  );
}
