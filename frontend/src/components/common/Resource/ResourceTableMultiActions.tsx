import { Grid } from '@mui/material';
import { MRT_TableInstance } from 'material-react-table';
import { useCallback } from 'react';
import { KubeObject } from '../../../lib/k8s/KubeObject';
import DeleteMultipleButton from './DeleteMultipleButton';

export interface ResourceTableMultiActionsProps<RowItem extends Record<string, any>> {
  table: MRT_TableInstance<RowItem>;
}

export default function ResourceTableMultiActions<RowItem extends Record<string, any>>(
  props: ResourceTableMultiActionsProps<RowItem>
) {
  const { table } = props;
  const items = table.getSelectedRowModel().rows.map(t => t.original as unknown as KubeObject);

  const afterConfirm = useCallback(() => {
    table.resetRowSelection();
  }, [table]);
  return (
    <Grid item>
      <Grid item container alignItems="center" justifyContent="flex-end">
        <DeleteMultipleButton items={items} afterConfirm={afterConfirm} />
      </Grid>
    </Grid>
  );
}
