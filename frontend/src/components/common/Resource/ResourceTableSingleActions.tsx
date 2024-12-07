import { MenuItem } from '@mui/material';
import { MRT_Row } from 'material-react-table';
import { DefaultHeaderAction, HeaderAction } from '../../../redux/actionButtonsSlice';
import { ButtonStyle } from '../ActionButton/ActionButton';
import DeleteButton from './DeleteButton';
import EditButton from './EditButton';
import { RestartButton } from './RestartButton';
import ScaleButton from './ScaleButton';

export function generateActions(actions: HeaderAction[], buttonStyle: ButtonStyle): HeaderAction[] {
  const defaultActions: HeaderAction[] = [
    {
      id: DefaultHeaderAction.RESTART,
      action: ({ item }) => <RestartButton item={item} buttonStyle={buttonStyle} />,
    },
    {
      id: DefaultHeaderAction.SCALE,
      action: ({ item }) => <ScaleButton item={item} buttonStyle={buttonStyle} />,
    },
    {
      id: DefaultHeaderAction.EDIT,
      action: ({ item, closeMenu }) => (
        <EditButton item={item} buttonStyle={buttonStyle} afterConfirm={closeMenu} />
      ),
    },
    {
      id: DefaultHeaderAction.DELETE,
      action: ({ item, closeMenu }) => (
        <DeleteButton item={item} buttonStyle={buttonStyle} afterConfirm={closeMenu} />
      ),
    },
  ];
  let hAccs: HeaderAction[] = [];
  if (actions !== undefined && actions !== null) {
    hAccs = actions;
  }

  const actionsProcessed: HeaderAction[] = [...hAccs, ...defaultActions];
  return actionsProcessed;
}

export default function generateRowActionsMenu(actions: HeaderAction[] | null | undefined) {
  const actionsProcessed = generateActions(actions || [], 'menu');
  if (actionsProcessed.length === 0) {
    return null;
  }
  return ({ closeMenu, row }: { closeMenu: () => void; row: MRT_Row<Record<string, any>> }) => {
    return actionsProcessed.map(action => {
      if (action.action === undefined || action.action === null) {
        return <MenuItem />;
      }
      if (typeof action.action === 'function') {
        return action.action({ item: row.original, closeMenu });
      }
      return action.action;
    });
  };
}
