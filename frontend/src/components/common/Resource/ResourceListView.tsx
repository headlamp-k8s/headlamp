import React, { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionButton } from '..';
import SectionBox from '../SectionBox';
import SectionFilterHeader, { SectionFilterHeaderProps } from '../SectionFilterHeader';
import ResourceTable, {
  ResourceTableFromResourceClassProps,
  ResourceTableProps,
} from './ResourceTable';

export interface ResourceListViewProps extends PropsWithChildren<ResourceTableProps> {
  title: string | JSX.Element;
  headerProps?: Omit<SectionFilterHeaderProps, 'title'>;
}

export interface ResourceListViewWithResourceClassProps
  extends Omit<ResourceListViewProps, 'data'> {
  resourceClass: ResourceTableFromResourceClassProps['resourceClass'];
}

export default function ResourceListView(
  props: ResourceListViewProps | ResourceListViewWithResourceClassProps
) {
  const { title, children, headerProps, ...tableProps } = props;
  const { t } = useTranslation();
  const [columnChooserAnchorEl, setColumnChooserAnchorEl] = React.useState<null | HTMLElement>(
    null
  );
  const withNamespaceFilter = (props as ResourceListViewWithResourceClassProps).resourceClass
    ?.isNamespaced;

  return (
    <SectionBox
      title={
        typeof title === 'string' ? (
          <SectionFilterHeader
            title={title}
            actions={[
              <ActionButton
                icon="mdi:view-column"
                description={t('Change columns displayed')}
                onClick={event => {
                  setColumnChooserAnchorEl(() => event.currentTarget);
                }}
              />,
            ]}
            noNamespaceFilter={!withNamespaceFilter}
            {...headerProps}
          />
        ) : (
          title
        )
      }
    >
      <ResourceTable
        columnChooserAnchor={columnChooserAnchorEl}
        onColumnChooserClose={() => setColumnChooserAnchorEl(null)}
        {...tableProps}
      />
      {children}
    </SectionBox>
  );
}
