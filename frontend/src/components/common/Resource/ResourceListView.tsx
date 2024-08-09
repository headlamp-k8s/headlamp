import React, { PropsWithChildren } from 'react';
import { ClassWithBaseObject, KubeObject } from '../../../lib/k8s/cluster';
import { CreateResourceButton } from '../CreateResourceButton';
import SectionBox from '../SectionBox';
import SectionFilterHeader, { SectionFilterHeaderProps } from '../SectionFilterHeader';
import ResourceTable, { ResourceTableProps } from './ResourceTable';

export interface ResourceListViewProps<ItemType>
  extends PropsWithChildren<ResourceTableProps<ItemType>> {
  title: string | JSX.Element;
  headerProps?: Omit<SectionFilterHeaderProps, 'title'>;
}

export interface ResourceListViewWithResourceClassProps<ItemType>
  extends Omit<ResourceListViewProps<ItemType>, 'data'> {
  resourceClass: ClassWithBaseObject<ItemType>;
}

export default function ResourceListView<ItemType>(
  props: ResourceListViewProps<ItemType> | ResourceListViewWithResourceClassProps<ItemType>
) {
  const { title, children, headerProps, ...tableProps } = props;
  const withNamespaceFilter =
    'resourceClass' in props && (props.resourceClass as KubeObject)?.isNamespaced;
  const resourceClass =
    'resourceClass' in props && props.resourceClass.getBaseObject ? props.resourceClass : null;

  return (
    <SectionBox
      title={
        typeof title === 'string' ? (
          <SectionFilterHeader
            title={title}
            noNamespaceFilter={!withNamespaceFilter}
            {...headerProps}
            titleSideActions={
              resourceClass ? [<CreateResourceButton resourceClass={resourceClass} />] : undefined
            }
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
