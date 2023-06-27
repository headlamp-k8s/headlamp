import clsx from 'clsx';
import { cloneDeep } from 'lodash';
import { AutoSizer, Column, Table } from 'react-virtualized';
import { useTableStyle } from './SimpleTable';

export interface VirtualizedTableProps {
  cellRenderer: (...args: any) => any;
  headerRenderer: (...args: any) => any;
  rowCount: number;
  columns: { [key: string]: any }[];
  rowGetter: (...args: any) => any;
}

export default function VirtualizedTable(props: VirtualizedTableProps) {
  const { cellRenderer, headerRenderer, rowCount, columns, rowGetter } = props;
  const modifiedColumnsForVirtualizedTableCorrectIndexing = cloneDeep(columns);
  // react-virtualized starts indexing from 1 so this is a temporary hack to fix first column not getting rendered
  // @todo: find a better way to fix this
  modifiedColumnsForVirtualizedTableCorrectIndexing.unshift({});
  const classes = useTableStyle();
  return (
    <AutoSizer>
      {({ height, width }) => (
        <Table
          gridStyle={{
            direction: 'inherit',
          }}
          height={height}
          width={width}
          rowHeight={60}
          headerHeight={48}
          rowCount={rowCount}
          rowGetter={rowGetter}
          className={classes.table}
          rowClassName={clsx(classes.flexContainer)}
        >
          {modifiedColumnsForVirtualizedTableCorrectIndexing.map((col, index) => {
            if (index === 0) {
              return null;
            }
            return (
              <Column
                key={index}
                headerRenderer={() =>
                  headerRenderer({
                    ...col,
                    columnIndex: index - 1,
                  })
                }
                cellRenderer={cellRenderer}
                width={50}
                cellDataGetter={({ rowData }) => {
                  if (!rowData || Object.keys(col).length === 0) {
                    return null;
                  }
                  return 'datum' in col ? rowData[col.datum] : col.getter(rowData);
                }}
                dataKey={String(index)}
              />
            );
          })}
        </Table>
      )}
    </AutoSizer>
  );
}
