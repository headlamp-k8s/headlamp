import deleteIcon from '@iconify/icons-mdi/delete';
import { Icon } from '@iconify/react';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteClusterObjects } from '../../redux/actions/actions';

export default function DeleteButton(props) {
  const dispatch = useDispatch();
  const { items, deletionCallback, options } = props;

  return (
    <Tooltip title="Delete">
      <IconButton
        aria-label="delete"
        onClick={() => {
          dispatch(deleteClusterObjects(items, deletionCallback, options));
        }}
      >
        <Icon icon={deleteIcon} />
      </IconButton>
    </Tooltip>
  );
}
