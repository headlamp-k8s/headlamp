import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ResourceTableProps } from './ResourceTable';

export interface ResourceTableState {
  /**
   * List of table columns processors. Allowing the modification of what tables show.
   */
  tableColumnsProcessors: TableColumnsProcessor[];
}

export type TableColumnsProcessor = {
  /** Unique ID for this processor. */
  id: string;
  /** Function that will be called to process the columns.
   * @param args.id The table ID.
   * @param args.columns The current table columns.
   *
   * @returns The new table columns.
   */
  processor: (args: {
    id: string;
    columns: ResourceTableProps['columns'];
  }) => ResourceTableProps['columns'];
};

const initialState: ResourceTableState = {
  tableColumnsProcessors: [],
};

const resourceTableSlice = createSlice({
  name: 'resourceTable',
  initialState,
  reducers: {
    /**
     * Adds a table columns processor.
     */
    addResourceTableColumnsProcessor(
      state,
      action: PayloadAction<TableColumnsProcessor | TableColumnsProcessor['processor']>
    ) {
      let processor = action.payload as TableColumnsProcessor;

      if (typeof action.payload === 'function') {
        processor = {
          id: `generated-id-${Date.now().toString(36)}`,
          processor: action.payload,
        };
      }

      state.tableColumnsProcessors.push(processor);
    },
  },
});

export const { addResourceTableColumnsProcessor } = resourceTableSlice.actions;
export { resourceTableSlice };
export default resourceTableSlice.reducer;
