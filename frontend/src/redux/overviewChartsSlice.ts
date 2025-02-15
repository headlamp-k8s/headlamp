import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReactNode } from 'react';

export interface OverviewChart {
  id: string;
  component: () => ReactNode;
}

export interface OverviewChartsProcessor {
  id?: string;
  processor: (charts: OverviewChart[]) => OverviewChart[];
}

interface OverviewChartsState {
  processors: OverviewChartsProcessor[];
}

const initialState: OverviewChartsState = {
  processors: [],
};

const overviewChartsSlice = createSlice({
  name: 'overviewCharts',
  initialState,
  reducers: {
    addProcessor: (state, action: PayloadAction<OverviewChartsProcessor>) => {
      state.processors.push(action.payload);
    },
  },
});

export const { addProcessor: addOverviewChartsProcessor } = overviewChartsSlice.actions;
export default overviewChartsSlice.reducer;
