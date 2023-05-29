import { Chip, createStyles, makeStyles, Theme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import HPA from '../../lib/k8s/hpa';
import { Link, SectionBox, SectionFilterHeader } from '../common';
import ResourceTable from '../common/Resource/ResourceTable';

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
  })
);

export default function HpaList() {
  const classes = useStyles();
  const { t } = useTranslation(['glossary', 'hpa', 'frequent']);

  return (
    <SectionBox title={<SectionFilterHeader title={t('glossary|Horizontal Pod Autoscalers')} />}>
      <ResourceTable
        resourceClass={HPA}
        columns={[
          'name',
          'namespace',
          {
            label: t('hpa|Reference'),
            getter: item => (
              <Link kubeObject={item.referenceObject}>
                {item.referenceObject?.kind}/{item.referenceObject?.metadata.name}
              </Link>
            ),
          },
          {
            label: t('hpa|Targets'),
            getter: (hpa: HPA) => {
              const value: JSX.Element[] = [];
              const metrics = hpa.metrics(t);
              if (metrics.length) {
                value.push(<Chip label={metrics[0].shortValue} variant="outlined" />);
                if (metrics.length > 1) {
                  value.push(
                    <Chip label={metrics.length - 1 + t('frequent|more…')} variant="outlined" />
                  );
                }
              }
              return <div className={classes.root}>{value}</div>;
            },
          },
          {
            label: t('hpa|MinReplicas'),
            getter: item => item.spec.minReplicas,
            sort: true,
          },
          {
            label: t('hpa|MaxReplicas'),
            getter: item => item.spec.maxReplicas,
            sort: true,
          },
          {
            label: t('glossary|Replicas'),
            getter: item => item.status.currentReplicas,
            sort: true,
          },
          'age',
        ]}
      />
    </SectionBox>
  );
}
