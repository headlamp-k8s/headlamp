import { Box, Chip } from '@mui/material';
import { styled } from '@mui/system';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ApiError } from '../../lib/k8s/apiProxy';
import ResourceQuota from '../../lib/k8s/resourceQuota';
import { useNamespaces } from '../../redux/filterSlice';
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
  errors: ApiError[] | null;
  hideColumns?: string[];
  reflectTableInURL?: SimpleTableProps['reflectInURL'];
  noNamespaceFilter?: boolean;
}

export function ResourceQuotaRenderer(props: ResourceQuotaProps) {
  const {
    resourceQuotas,
    errors,
    hideColumns = [],
    reflectTableInURL = 'resourcequotas',
    noNamespaceFilter,
  } = props;
  const { t } = useTranslation(['glossary', 'translation']);

  return (
    <ResourceListView
      title={t('glossary|Resource Quotas')}
      hideColumns={hideColumns}
      columns={[
        'name',
        'namespace',
        'cluster',
        {
          id: 'requests',
          label: t('translation|Request'),
          getValue: item => item.requests.join(', '),
          render: item => {
            const requests: ReactNode[] = [];
            item.requests.forEach((request: string) => {
              requests.push(<PaddedChip label={request} variant="outlined" size="small" />);
            });
            return <WrappingBox>{requests}</WrappingBox>;
          },
        },
        {
          id: 'limits',
          label: t('translation|Limit'),
          getValue: item => item?.limits?.join(', '),
          render: item => {
            const limits: ReactNode[] = [];
            item.limits.forEach((limit: string) => {
              limits.push(<PaddedChip label={limit} variant="outlined" size="small" />);
            });
            return <WrappingBox>{limits}</WrappingBox>;
          },
        },
        'age',
      ]}
      headerProps={{
        noNamespaceFilter,
      }}
      errors={errors}
      data={resourceQuotas}
      reflectInURL={reflectTableInURL}
      id="headlamp-resourcequotas"
    />
  );
}

export default function ResourceQuotaList() {
  const { items: resourceQuotas, errors } = ResourceQuota.useList({ namespace: useNamespaces() });

  return (
    <ResourceQuotaRenderer resourceQuotas={resourceQuotas} errors={errors} reflectTableInURL />
  );
}
