import { Chip, createStyles, makeStyles, Theme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import HPA from '../../lib/k8s/hpa';
import { Link } from '../common';
import ResourceListView from '../common/Resource/ResourceListView';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'left',
      flexWrap: 'wrap',
      '& > *': {
        margin: theme.spacing(0.5),
      },
    },
    chip: {
      paddingTop: '2px',
      paddingBottom: '2px',
    },
  })
);

export default function HpaList() {
  const classes = useStyles();
  const { t } = useTranslation(['glossary', 'hpa', 'frequent']);

  return (
    <ResourceListView
      title={t('glossary|Horizontal Pod Autoscalers')}
      resourceClass={HPA}
      columns={[
        'name',
        'namespace',
        {
          id: 'reference',
          label: t('hpa|Reference'),
          getter: item => (
            <Link kubeObject={item.referenceObject}>
              {item.referenceObject?.kind}/{item.referenceObject?.metadata.name}
            </Link>
          ),
        },
        {
          id: 'targets',
          label: t('hpa|Targets'),
          getter: (hpa: HPA) => {
            const value: JSX.Element[] = [];
            const metrics = hpa.metrics(t);
            if (metrics.length) {
              value.push(
                <Chip
                  className={classes.chip}
                  label={metrics[0].shortValue}
                  variant="outlined"
                  size="small"
                />
              );
              if (metrics.length > 1) {
                value.push(
                  <Chip
                    className={classes.chip}
                    label={metrics.length - 1 + t('frequent|more…')}
                    variant="outlined"
                    size="small"
                  />
                );
              }
            }
            return <div className={classes.root}>{value}</div>;
          },
          cellProps: {
            style: {
              width: 'fit-content',
              minWidth: '100%',
            },
          },
        },
        {
          id: 'minReplicas',
          label: t('hpa|MinReplicas'),
          getter: item => item.spec.minReplicas,
          sort: true,
        },
        {
          id: 'maxReplicas',
          label: t('hpa|MaxReplicas'),
          getter: item => item.spec.maxReplicas,
          sort: true,
        },
        {
          id: 'currentReplicas',
          label: t('glossary|Replicas'),
          getter: item => item.status.currentReplicas,
          sort: true,
        },
        'age',
      ]}
    />
  );
}
