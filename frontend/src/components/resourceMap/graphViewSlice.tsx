/**
 * This slice contains custom graph elements registered by plugins
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReactNode } from 'react';
import { GraphSource } from './graph/graphModel';

export interface IconDefinition {
  /**
   * Icon element
   */
  icon: ReactNode;
  /**
   * Color of the icon
   * @example #FF0000
   * @example rgba(255, 100, 20, 0.5)
   */
  color?: string;
}

interface GraphViewSliceState {
  graphSources: GraphSource[];
  kindIcons: Record<string, IconDefinition>;
}

const initialState: GraphViewSliceState = {
  graphSources: [],
  kindIcons: {},
};

export const graphViewSlice = createSlice({
  name: 'graphViewSlice',
  initialState,
  reducers: {
    addGraphSource(state, action: PayloadAction<GraphSource>) {
      if (state.graphSources.find(it => it.id === action.payload?.id) !== undefined) {
        console.error(`Source with id ${action.payload.id} was already registered`);
        return;
      }
      state.graphSources.push(action.payload);
    },
    addKindIcon(state, action: PayloadAction<{ kind: string; definition: IconDefinition }>) {
      state.kindIcons[action.payload.kind] = action.payload.definition;
    },
  },
});
