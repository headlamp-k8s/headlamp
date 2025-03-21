import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReactElement, ReactNode } from 'react';

export type ItemType = ((...args: any[]) => ReactNode) | null | ReactElement | ReactNode;

export interface DialogProps {
  cluster: any;
  openConfirmDialog: string;
  setOpenConfirmDialog: (value: string) => void;
}

export interface MenuItemProps {
  cluster: any;
  handleMenuClose: () => void;
  setOpenConfirmDialog: (value: string) => void;
}

export interface AddClusterProviderProps {}

export type DialogComponent = (props: DialogProps) => React.ReactElement | null;
export type MenuItemComponent = (props: MenuItemProps) => React.ReactElement | null;
export type AddClusterProviderComponent = (
  props: AddClusterProviderProps
) => React.ReactElement | null;

export interface ClusterProviderSliceState {
  dialogs: DialogComponent[];
  menuItems: MenuItemComponent[];
  addClusterProviders: AddClusterProviderComponent[];
}

export const initialState: ClusterProviderSliceState = {
  menuItems: [],
  dialogs: [],
  addClusterProviders: [],
};

const clusterProviderSlice = createSlice({
  name: 'clusterProviderSlice',
  initialState,
  reducers: {
    addDialog(state, action: PayloadAction<DialogComponent>) {
      state.dialogs.push(action.payload);
    },
    addMenuItem(state, action: PayloadAction<MenuItemComponent>) {
      state.menuItems.push(action.payload);
    },
    addAddClusterProvider(state, action: PayloadAction<AddClusterProviderComponent>) {
      state.addClusterProviders.push(action.payload);
    },
  },
});

export const { addDialog, addMenuItem, addAddClusterProvider } = clusterProviderSlice.actions;

export default clusterProviderSlice.reducer;
