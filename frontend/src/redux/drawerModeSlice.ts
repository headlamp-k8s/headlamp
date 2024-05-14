import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { useParams } from 'react-router-dom';

interface DrawerModeState {
  isDetailDrawerEnabled: boolean;
  isDetailDrawerOpen: boolean;
  currentDrawerCluster: string;
  currentDrawerResource: any;
  currentDrawerNamespace: string;
  currentDrawerName: string;
}

const getLocalDrawerStatus = (key: string) => {
  const local = localStorage.getItem(key);
  if (local === null) return false;
  return local === 'true';
};

const initialState: DrawerModeState = {
  isDetailDrawerEnabled: getLocalDrawerStatus('detailDrawerEnabled'),
  isDetailDrawerOpen: getLocalDrawerStatus('detailDrawerOpen'),
  currentDrawerCluster: '',
  currentDrawerResource: '',
  currentDrawerNamespace: '',
  currentDrawerName: '',
};

const drawerModeSlice = createSlice({
  name: 'drawerMode',
  initialState,
  reducers: {
    setDetailDrawerEnabled: (state, action: PayloadAction<boolean>) => {
      state.isDetailDrawerEnabled = action.payload;
      localStorage.setItem('detailDrawerEnabled', `${action.payload}`);
    },
    setDetailDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.isDetailDrawerOpen = action.payload;
      localStorage.setItem('detailDrawerOpen', `${action.payload}`);
    },
    updateDrawerCluster: (state, action: PayloadAction<string>) => {
      state.currentDrawerCluster = action.payload;
      console.log('slice updateDrawerCluster', action.payload);
    },
    updateDrawerResource: (state, action: PayloadAction<string>) => {
      state.currentDrawerResource = action.payload;
      console.log('slice updateDrawerResource', action.payload);
      localStorage.setItem('currentDrawerResource', `${action.payload}`);
    },
    updateDrawerNamespace: (state, action: PayloadAction<string>) => {
      state.currentDrawerNamespace = action.payload;
      console.log('slice updateDrawerNamespace', action.payload);
      localStorage.setItem('currentDrawerNamespace', `${action.payload}`);
    },
    updateDrawerName: (state, action: PayloadAction<string>) => {
      state.currentDrawerName = action.payload;
      console.log('slice updateDrawerName', action.payload);
      localStorage.setItem('currentDrawerName', `${action.payload}`);
    },
  },
});

export const {
  setDetailDrawerEnabled,
  setDetailDrawerOpen,
  updateDrawerCluster,
  updateDrawerName,
  updateDrawerNamespace,
  updateDrawerResource,
} = drawerModeSlice.actions;
export default drawerModeSlice.reducer;
