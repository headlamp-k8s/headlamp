import { has } from 'lodash';
import { MRT_Row } from 'material-react-table';
import { isValidElement } from 'react';
import React from 'react';
import { KubeObject } from '../../../lib/k8s/KubeObject';
import {
  DefaultHeaderAction,
  HeaderAction,
  HeaderActionType,
} from '../../../redux/actionButtonsSlice';
import { useTypedSelector } from '../../../redux/reducers/reducers';
import { ButtonStyle } from '../ActionButton/ActionButton';
import ErrorBoundary from '../ErrorBoundary';
import DeleteButton from './DeleteButton';
import EditButton from './EditButton';
import { RestartButton } from './RestartButton';
import ScaleButton from './ScaleButton';

export function generateActions<T extends KubeObject>(
  resource: T | null,
  buttonStyle: ButtonStyle,
  actions:
    | ((resource: T | null) => React.ReactNode[] | HeaderAction[] | null)
    | React.ReactNode[]
    | null
    | HeaderAction[],
  noDefaultActions?: boolean,
  closeMenu?: () => void
): React.ReactNode[] {
  const headerActions = useTypedSelector(state => state.actionButtons.headerActions);
  const headerActionsProcessors = useTypedSelector(
    state => state.actionButtons.headerActionsProcessors
  );
  function setupAction(headerAction: HeaderAction) {
    let Action = has(headerAction, 'action') ? (headerAction as any).action : headerAction;

    if (!noDefaultActions && has(headerAction, 'id')) {
      switch ((headerAction as HeaderAction).id) {
        case DefaultHeaderAction.RESTART:
          Action = RestartButton;
          break;
        case DefaultHeaderAction.SCALE:
          Action = ScaleButton;
          break;
        case DefaultHeaderAction.EDIT:
          Action = EditButton;
          break;
        case DefaultHeaderAction.DELETE:
          Action = DeleteButton;
          break;
        default:
          break;
      }
    }

    if (!Action || (headerAction as unknown as HeaderAction).action === null) {
      return null;
    }

    if (isValidElement(Action)) {
      return <ErrorBoundary>{Action}</ErrorBoundary>;
    } else if (Action === null) {
      return null;
    } else if (typeof Action === 'function') {
      return (
        <ErrorBoundary>
          <Action item={resource} buttonStyle={buttonStyle} closeMenu={closeMenu} />
        </ErrorBoundary>
      );
    }
  }

  const defaultActions = [
    {
      id: DefaultHeaderAction.RESTART,
    },
    {
      id: DefaultHeaderAction.SCALE,
    },
    {
      id: DefaultHeaderAction.EDIT,
    },
    {
      id: DefaultHeaderAction.DELETE,
    },
  ];

  let hAccs: HeaderAction[] = [];
  const accs = typeof actions === 'function' ? actions(resource) || [] : actions;
  if (accs !== null) {
    hAccs = [...accs].map((action, i): HeaderAction => {
      if ((action as HeaderAction)?.id !== undefined) {
        return action as HeaderAction;
      } else {
        return { id: `gen-${i}`, action: action as HeaderActionType };
      }
    });
  }

  let actionsProcessed = [...headerActions, ...hAccs, ...defaultActions];
  if (headerActionsProcessors.length > 0) {
    for (const headerProcessor of headerActionsProcessors) {
      actionsProcessed = headerProcessor.processor(resource, actionsProcessed);
    }
  }

  const allActions = React.Children.toArray(
    (function propsActions() {
      const pluginAddedActions = actionsProcessed.map(setupAction);
      return React.Children.toArray(pluginAddedActions);
    })()
  );
  return allActions;
}

export default function generateRowActionsMenu(actions: HeaderAction[] | null | undefined) {
  return ({ closeMenu, row }: { closeMenu: () => void; row: MRT_Row<Record<string, any>> }) => {
    const actionsProcessed = generateActions(
      row.original as any,
      'menu',
      actions || [],
      false,
      closeMenu
    );
    if (actionsProcessed.length === 0) {
      return null;
    }
    return actionsProcessed;
  };
}
