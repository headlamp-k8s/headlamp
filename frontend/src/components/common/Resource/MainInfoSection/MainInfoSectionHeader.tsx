import React from 'react';
import { useLocation } from 'react-router-dom';
import { KubeObject } from '../../../../lib/k8s/KubeObject';
import { HeaderAction } from '../../../../redux/actionButtonsSlice';
import SectionHeader, { HeaderStyle } from '../../SectionHeader';
import { generateActions } from '../generateHeaderActions';

export interface MainInfoHeaderProps<T extends KubeObject> {
  resource: T | null;
  headerSection?: ((resource: T | null) => React.ReactNode) | React.ReactNode;
  title?: string;
  actions?:
    | ((resource: T | null) => React.ReactNode[] | HeaderAction[] | null)
    | React.ReactNode[]
    | null
    | HeaderAction[];
  headerStyle?: HeaderStyle;
  noDefaultActions?: boolean;
  /** The route or location to go to. If it's an empty string, then the "browser back" function is used. If null, no back button will be shown. */
  backLink?: string | ReturnType<typeof useLocation> | null;
}

export function MainInfoHeader<T extends KubeObject>(props: MainInfoHeaderProps<T>) {
  const { resource, title, actions = [], headerStyle = 'main', noDefaultActions = false } = props;
  const allActions = generateActions(resource, 'action', actions, noDefaultActions);
  return (
    <SectionHeader
      title={title || (resource ? `${resource.kind}: ${resource.getName()}` : '')}
      headerStyle={headerStyle}
      actions={allActions}
    />
  );
}
