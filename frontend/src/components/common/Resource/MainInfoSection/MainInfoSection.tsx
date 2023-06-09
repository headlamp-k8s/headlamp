import { has } from 'lodash';
import React, { isValidElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { KubeObject } from '../../../../lib/k8s/cluster';
import { createRouteURL } from '../../../../lib/router';
import {
  DefaultHeaderAction,
  HeaderAction,
  HeaderActionType,
} from '../../../../redux/actionButtonsSlice';
import { useTypedSelector } from '../../../../redux/reducers/reducers';
import Loader from '../../../common/Loader';
import SectionHeader, { HeaderStyleProps } from '../../../common/SectionHeader';
import { NameValueTableRow } from '../../../common/SimpleTable';
import Empty from '../../EmptyContent';
import ErrorBoundary from '../../ErrorBoundary';
import SectionBox from '../../SectionBox';
import DeleteButton from '../DeleteButton';
import EditButton from '../EditButton';
import { MetadataDisplay } from '../MetadataDisplay';
import { RestartButton } from '../RestartButton';
import ScaleButton from '../ScaleButton';

export interface MainInfoSectionProps {
  resource: KubeObject | null;
  headerSection?: ((resource: KubeObject | null) => React.ReactNode) | React.ReactNode;
  title?: string;
  extraInfo?:
    | ((resource: KubeObject | null) => NameValueTableRow[] | null)
    | NameValueTableRow[]
    | null;
  actions?:
    | ((resource: KubeObject | null) => React.ReactNode[] | null)
    | React.ReactNode[]
    | null
    | HeaderAction[];
  headerStyle?: HeaderStyleProps['headerStyle'];
  noDefaultActions?: boolean;
  /** The route or location to go to. If it's an empty string, then the "browser back" function is used. If null, no back button will be shown. */
  backLink?: string | ReturnType<typeof useLocation> | null;
  error?: string | Error | null;
}

export function MainInfoSection(props: MainInfoSectionProps) {
  const {
    resource,
    headerSection,
    title,
    extraInfo = [],
    actions = [],
    headerStyle = 'main',
    noDefaultActions = false,
    backLink,
    error = null,
  } = props;
  const headerActions = useTypedSelector(state => state.actionButtons.headerActions);
  const headerActionsProcessors = useTypedSelector(
    state => state.actionButtons.headerActionsProcessors
  );
  const { t } = useTranslation('frequent');
  const header = typeof headerSection === 'function' ? headerSection(resource) : headerSection;

  function setupAction(headerAction: HeaderActionType) {
    let Action = has(headerAction, 'action') ? (headerAction as HeaderAction).action : headerAction;

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

    if (!Action || (headerAction as HeaderAction).action === null) {
      return null;
    }

    if (isValidElement(Action)) {
      return <ErrorBoundary>{Action}</ErrorBoundary>;
    } else if (Action === null) {
      return null;
    } else if (typeof Action === 'function') {
      return (
        <ErrorBoundary>
          <Action item={resource} />
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
    hAccs = [...accs].map((action, i) => {
      if ((action as HeaderAction).id !== undefined) {
        return action as HeaderAction;
      } else {
        return { id: `gen-${i}`, action };
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

  function getBackLink() {
    if (!!backLink || backLink === '') {
      return backLink;
    }

    if (!!resource) {
      return createRouteURL(resource.listRoute);
    }
  }

  return (
    <SectionBox
      aria-busy={resource === null}
      aria-live="polite"
      title={
        <SectionHeader
          title={title || (resource ? resource.kind : '')}
          headerStyle={headerStyle}
          actions={allActions}
        />
      }
      backLink={getBackLink()}
    >
      {resource === null ? (
        !!error ? (
          <Empty color="error">{error.toString()}</Empty>
        ) : (
          <Loader title={t('frequent|Loading resource data')} />
        )
      ) : (
        <React.Fragment>
          {header}
          <MetadataDisplay resource={resource} extraRows={extraInfo} />
        </React.Fragment>
      )}
    </SectionBox>
  );
}
