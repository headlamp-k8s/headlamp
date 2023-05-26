import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReactElement, ReactNode } from 'react';
import { KubeObject } from '../../../lib/k8s/cluster';

export type HeaderActionType =
  | ((...args: any[]) => JSX.Element | null | ReactNode)
  | null
  | ReactElement
  | ReactNode;
export type DetailsViewFunc = HeaderActionType;

export type HeaderAction = {
  id: string;
  action?: HeaderActionType;
};

export enum DefaultHeaderAction {
  RESTART = 'RESTART',
  DELETE = 'DELETE',
  EDIT = 'EDIT',
  SCALE = 'SCALE',
  POD_LOGS = 'POD_LOGS',
  POD_TERMINAL = 'POD_TERMINAL',
  POD_ATTACH = 'POD_ATTACH',
}
export type HeaderActionsProcessor = {
  id: string;
  processor: (resource: KubeObject | null, actions: HeaderAction[]) => HeaderAction[];
};

export interface HeaderActionState {
  headerActions: HeaderAction[];
  headerActionsProcessors: HeaderActionsProcessor[];
}
const initialState: HeaderActionState = {
  headerActions: [],
  headerActionsProcessors: [],
};

export const headerActionSlice = createSlice({
  name: 'headerAction',
  initialState,
  reducers: {
    setDetailsViewHeaderAction(state, action: PayloadAction<HeaderActionType | HeaderAction>) {
      let headerAction = action.payload as HeaderAction;

      if (headerAction.id === undefined) {
        if (headerAction.action === undefined) {
          headerAction = { id: '', action: headerAction };
        } else {
          headerAction = { id: '', action: headerAction.action };
        }
      }
      headerAction.id = headerAction.id || `generated-id-${Date.now().toString(36)}`;

      state.headerActions.push(headerAction);
    },
    addDetailsViewHeaderActionsProcessor(
      state,
      action: PayloadAction<HeaderActionsProcessor | HeaderActionsProcessor['processor']>
    ) {
      let headerActionsProcessor = action.payload as HeaderActionsProcessor;
      if (headerActionsProcessor.id === undefined && typeof headerActionsProcessor === 'function') {
        headerActionsProcessor = {
          id: '',
          processor: headerActionsProcessor,
        };
      }
      headerActionsProcessor.id =
        headerActionsProcessor.id || `generated-id-${Date.now().toString(36)}`;
      state.headerActionsProcessors.push(headerActionsProcessor);
    },
  },
});

export const { setDetailsViewHeaderAction, addDetailsViewHeaderActionsProcessor } =
  headerActionSlice.actions;

export default headerActionSlice.reducer;
