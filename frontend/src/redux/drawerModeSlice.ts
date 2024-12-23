import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { KubeObject } from '../lib/k8s/KubeObject';

interface DrawerModeState {
  isDetailDrawerEnabled: boolean;
  selectedResource: KubeObject | undefined;
}

const getLocalDrawerStatus = (key: string) => localStorage.getItem(key) === 'true';

const localStorageName = 'detailDrawerEnabled';

const initialState: DrawerModeState = {
  isDetailDrawerEnabled: getLocalDrawerStatus(localStorageName),
  selectedResource: undefined,
};

const drawerModeSlice = createSlice({
  name: 'drawerMode',
  initialState,
  reducers: {
    setDetailDrawerEnabled: (state, action: PayloadAction<boolean>) => {
      state.isDetailDrawerEnabled = action.payload;
      localStorage.setItem(localStorageName, `${action.payload}`);
    },
    setSelectedResource: (state, action: any) => {
      state.selectedResource = action.payload;
    },
  },
});

export const { setDetailDrawerEnabled, setSelectedResource } = drawerModeSlice.actions;
export default drawerModeSlice.reducer;
