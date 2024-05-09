import React, { PropsWithChildren } from 'react';
import { KubeObject } from '../../../lib/k8s/cluster';
import SectionBox from '../SectionBox';
import SectionFilterHeader, { SectionFilterHeaderProps } from '../SectionFilterHeader';
import ResourceTable, { ResourceTableProps } from './ResourceTable';

export interface ResourceListViewProps<ItemType>
  extends PropsWithChildren<ResourceTableProps<ItemType>> {
  title: string | JSX.Element;
  headerProps?: Omit<SectionFilterHeaderProps, 'title'>;
}

type Class<T> = new (...args: any[]) => T;

export interface ResourceListViewWithResourceClassProps<ItemType>
  extends Omit<ResourceListViewProps<ItemType>, 'data'> {
  resourceClass: Class<ItemType>;
}

export default function ResourceListView<ItemType>(
  props: ResourceListViewProps<ItemType> | ResourceListViewWithResourceClassProps<ItemType>
) {
  const { title, children, headerProps, ...tableProps } = props;
  const withNamespaceFilter =
    'resourceClass' in props && (props.resourceClass as KubeObject)?.isNamespaced;

  return (
    <SectionBox
      title={
        typeof title === 'string' ? (
          <SectionFilterHeader
            title={title}
            noNamespaceFilter={!withNamespaceFilter}
            {...headerProps}
          />
        ) : (
          title
        )
      }
    >
      <ResourceTable {...tableProps} />
      {children}
    </SectionBox>
  );
}
