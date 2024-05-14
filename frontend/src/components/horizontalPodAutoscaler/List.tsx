import { Chip } from '@mui/material';
import { styled } from '@mui/system';
import { useTranslation } from 'react-i18next';
import HPA from '../../lib/k8s/hpa';
import { Link } from '../common';
import ResourceListView from '../common/Resource/ResourceListView';

const RootDiv = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'left',
  flexWrap: 'wrap',
  '& > *': {
    margin: theme.spacing(0.5),
  },
}));

const PaddedChip = styled(Chip)({
  paddingTop: '2px',
  paddingBottom: '2px',
});

export default function HpaList() {
  const { t } = useTranslation(['glossary', 'translation']);

  return (
    <ResourceListView
      title={t('glossary|Horizontal Pod Autoscalers')}
      resourceClass={HPA}
      columns={[
        'name',
        'namespace',
        {
          id: 'reference',
          label: t('translation|Reference'),
          getValue: item => item.referenceObject?.metadata.name,
          render: item => (
            <Link kubeObject={item.referenceObject}>
              {item.referenceObject?.kind}/{item.referenceObject?.metadata.name}
            </Link>
          ),
        },
        {
          id: 'targets',
          label: t('translation|Targets'),
          getValue: item =>
            item
              .metrics(t)
              .map(it => it.shortValue)
              .join(', '),
          render: (hpa: HPA) => {
            const value: JSX.Element[] = [];
            const metrics = hpa.metrics(t);
            if (metrics.length) {
              value.push(
                <PaddedChip label={metrics[0].shortValue} variant="outlined" size="small" key="1" />
              );
              if (metrics.length > 1) {
                value.push(
                  <PaddedChip
                    label={metrics.length - 1 + t('translation|more…')}
                    variant="outlined"
                    size="small"
                    key="2"
                  />
                );
              }
            }
            return <RootDiv>{value}</RootDiv>;
          },
        },
        {
          id: 'minReplicas',
          label: t('translation|MinReplicas'),
          getValue: item => item.spec.minReplicas,
        },
        {
          id: 'maxReplicas',
          label: t('translation|MaxReplicas'),
          getValue: item => item.spec.maxReplicas,
        },
        {
          id: 'currentReplicas',
          label: t('glossary|Replicas'),
          getValue: item => item.status.currentReplicas,
        },
        'age',
      ]}
    />
  );
}
