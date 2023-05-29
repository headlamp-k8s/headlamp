import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReactElement, ReactNode } from 'react';
import { KubeObject } from '../lib/k8s/cluster';

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

export enum DefaultAppBarAction {
  CLUSTER = 'CLUSTER',
  NOTIFICATION = 'NOTIFICATION',
  SETTINGS = 'SETTINGS',
  USER = 'USER',
}

export type HeaderActionsProcessor = {
  id: string;
  processor: (resource: KubeObject | null, actions: HeaderActionType[]) => HeaderAction[];
};

export interface HeaderActionState {
  headerActions: HeaderActionType[];
  headerActionsProcessors: HeaderActionsProcessor[];
  appBarActions: HeaderActionType[];
  appBarActionsProcessors: HeaderActionsProcessor[];
}
const initialState: HeaderActionState = {
  headerActions: [],
  headerActionsProcessors: [],
  appBarActions: [],
  appBarActionsProcessors: [],
};

/**
 * Normalizes a header actions processor by ensuring it has an 'id' and a processor function.
 *
 * If the processor is passed as a function, it will be wrapped in an object with a generated ID.
 *
 * @param action - The payload action containing the header actions processor.
 * @returns The normalized header actions processor.
 */
function _normalizeProcessor(
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
  return headerActionsProcessor;
}

export const actionButtonsSlice = createSlice({
  name: 'actionButtons',
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
      state.headerActionsProcessors.push(_normalizeProcessor(action));
    },

    setAppBarAction(state, action: PayloadAction<HeaderActionType | HeaderAction>) {
      state.appBarActions.push(action.payload);
    },

    setAppBarActionProcessor(
      state,
      action: PayloadAction<HeaderActionsProcessor | HeaderActionsProcessor['processor']>
    ) {
      state.appBarActionsProcessors.push(_normalizeProcessor(action));
    },
  },
});

export const {
  setDetailsViewHeaderAction,
  addDetailsViewHeaderActionsProcessor,
  setAppBarAction,
  setAppBarActionProcessor,
} = actionButtonsSlice.actions;

export default actionButtonsSlice.reducer;
