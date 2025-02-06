import { useTranslation } from 'react-i18next';
import { ApiError } from '../../lib/k8s/apiProxy';
import { LimitRange } from '../../lib/k8s/limitRange';
import { useNamespaces } from '../../redux/filterSlice';
import { SimpleTableProps } from '../common';
import ResourceListView from '../common/Resource/ResourceListView';

export interface LimitRangeProps {
  limitRanges: LimitRange[] | null;
  errors: ApiError[] | null;
  hideColumns?: string[];
  reflectTableInURL?: SimpleTableProps['reflectInURL'];
  noNamespaceFilter?: boolean;
}

export function LimitRangeRenderer(props: LimitRangeProps) {
  const {
    errors,
    limitRanges,
    hideColumns = [],
    reflectTableInURL = 'limitranges',
    noNamespaceFilter,
  } = props;
  const { t } = useTranslation(['glossary', 'translation']);

  return (
    <ResourceListView
      title={t('glossary|LimitRange')}
      columns={['name', 'namespace', 'cluster', 'age']}
      hideColumns={hideColumns}
      headerProps={{
        noNamespaceFilter,
      }}
      errors={errors}
      data={limitRanges}
      reflectInURL={reflectTableInURL}
      id="headlamp-limitranges"
    />
  );
}

export function LimitRangeList() {
  const { items: limitRanges, errors } = LimitRange.useList({ namespace: useNamespaces() });

  return <LimitRangeRenderer limitRanges={limitRanges} errors={errors} reflectTableInURL />;
}
