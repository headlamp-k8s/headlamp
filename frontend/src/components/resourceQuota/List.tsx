import { Box, Chip } from '@mui/material';
import { styled } from '@mui/system';
import { useTranslation } from 'react-i18next';
import ResourceQuota from '../../lib/k8s/resourceQuota';
import ResourceListView from '../common/Resource/ResourceListView';

const WrappingBox = styled(Box)(({ theme }) => ({
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

export default function ResourceQuotaList() {
  const { t } = useTranslation(['translation', 'glossary']);
  return (
    <ResourceListView
      title={t('glossary|Resource Quotas')}
      resourceClass={ResourceQuota}
      columns={[
        'name',
        'namespace',
        {
          id: 'requests',
          label: t('translation|Request'),
          getter: (item: ResourceQuota) => {
            const requests: JSX.Element[] = [];
            item.requests.forEach((request: string) => {
              requests.push(<PaddedChip label={request} variant="outlined" size="small" />);
            });
            return <WrappingBox>{requests}</WrappingBox>;
          },
          cellProps: {
            style: {
              width: 'fit-content',
              minWidth: '100%',
            },
          },
        },
        {
          id: 'limits',
          label: t('translation|Limit'),
          getter: (item: ResourceQuota) => {
            const limits: JSX.Element[] = [];
            item.limits.forEach((limit: string) => {
              limits.push(<PaddedChip label={limit} variant="outlined" size="small" />);
            });
            return <WrappingBox>{limits}</WrappingBox>;
          },
        },
        'age',
      ]}
    />
  );
}
