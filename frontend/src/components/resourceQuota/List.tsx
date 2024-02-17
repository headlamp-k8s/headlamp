import { Box, Chip } from '@mui/material';
import { styled } from '@mui/system';
import { useTranslation } from 'react-i18next';
import { ApiError } from '../../lib/k8s/apiProxy';
import ResourceQuota from '../../lib/k8s/resourceQuota';
import { SimpleTableProps } from '../common';
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

export interface ResourceQuotaProps {
  resourceQuotas: ResourceQuota[] | null;
  error: ApiError | null;
  hideColumns?: string[];
  reflectTableInURL?: SimpleTableProps['reflectInURL'];
  noSearch?: boolean;
}

export function ResourceQuotaRenderer(props: ResourceQuotaProps) {
  const {
    resourceQuotas,
    error,
    hideColumns = [],
    reflectTableInURL = 'resourcequotas',
    noSearch,
  } = props;
  const { t } = useTranslation(['glossary', 'translation']);

  return (
    <ResourceListView
      title={t('glossary|Resource Quotas')}
      hideColumns={hideColumns}
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
      headerProps={{
        noSearch,
      }}
      errorMessage={ResourceQuota.getErrorMessage(error)}
      data={resourceQuotas}
      reflectInURL={reflectTableInURL}
      id="headlamp-resourcequotas"
    />
  );
}

export default function ResourceQuotaList() {
  const [resourceQuotas, error] = ResourceQuota.useList();

  return <ResourceQuotaRenderer resourceQuotas={resourceQuotas} error={error} reflectTableInURL />;
}
