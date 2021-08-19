import chevronLeft from '@iconify/icons-mdi/chevron-left';
import eyeIcon from '@iconify/icons-mdi/eye';
import eyeOff from '@iconify/icons-mdi/eye-off';
import { Icon } from '@iconify/react';
import { Button, InputLabel } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Grid, { GridProps } from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Input, { InputProps } from '@material-ui/core/Input';
import { TextFieldProps } from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Editor from '@monaco-editor/react';
import { Base64 } from 'js-base64';
import _ from 'lodash';
import * as monaco from 'monaco-editor';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  KubeCondition,
  KubeContainer,
  KubeObject,
  KubeObjectInterface,
} from '../../../lib/k8s/cluster';
import { createRouteURL, RouteURLProps } from '../../../lib/router';
import { useTypedSelector } from '../../../redux/reducers/reducers';
import Loader from '../../common/Loader';
import { SectionBox } from '../../common/SectionBox';
import SectionHeader, { HeaderStyleProps } from '../../common/SectionHeader';
import SimpleTable, { NameValueTable, NameValueTableRow } from '../../common/SimpleTable';
import Empty from '../EmptyContent';
import { DateLabel, HoverInfoLabel, StatusLabel, StatusLabelProps } from '../Label';
import Link, { LinkProps } from '../Link';
import DeleteButton from './DeleteButton';
import EditButton from './EditButton';
import { MetadataDictGrid, MetadataDisplay } from './MetadataDisplay';

interface ResourceLinkProps extends Omit<LinkProps, 'routeName' | 'params'> {
  name?: string;
  routeName?: string;
  routeParams?: RouteURLProps;
  resource: KubeObjectInterface;
}

export function ResourceLink(props: ResourceLinkProps) {
  const {
    routeName = props.resource.kind,
    routeParams = props.resource.metadata as RouteURLProps,
    name = props.resource.metadata.name,
    state,
  } = props;

  return (
    <Link routeName={routeName} params={routeParams} state={state}>
      {name}
    </Link>
  );
}

interface MainInfoSectionProps {
  resource: KubeObject | null;
  headerSection?: React.ReactNode;
  title?: string;
  extraInfo?: NameValueTableRow[] | null;
  actions?: React.ReactNode[] | null;
  headerStyle?: HeaderStyleProps['headerStyle'];
  noDefaultActions?: boolean;
  backLink?: string | ReturnType<typeof useLocation> | null;
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
  } = props;
  const headerActions = useTypedSelector(state => state.ui.views.details.headerActions);
  const { t } = useTranslation('frequent');

  function getHeaderActions() {
    return React.Children.toArray(
      Object.values(headerActions).map(action => action({ item: resource }))
    );
  }

  let defaultActions: MainInfoSectionProps['actions'] = [];

  if (!noDefaultActions && resource) {
    defaultActions = [<EditButton item={resource} />, <DeleteButton item={resource} />];
  }

  return (
    <>
      {resource && (
        <Button
          startIcon={<Icon icon={chevronLeft} />}
          size="small"
          component={RouterLink}
          to={backLink || createRouteURL(resource.listRoute)}
        >
          <Typography style={{ paddingTop: '3px' }}>{t('frequent|Back')}</Typography>
        </Button>
      )}
      <SectionBox
        aria-busy={resource === null}
        aria-live="polite"
        title={
          <SectionHeader
            title={title || (resource ? resource.kind : '')}
            headerStyle={headerStyle}
            actions={getHeaderActions()
              .concat(React.Children.toArray(actions))
              .concat(defaultActions)}
          />
        }
      >
        {resource === null ? (
          <Loader title={t('frequent|Loading resource data')} />
        ) : (
          <React.Fragment>
            {headerSection}
            <MetadataDisplay resource={resource} extraRows={extraInfo} />
          </React.Fragment>
        )}
      </SectionBox>
    </>
  );
}

interface PageGridProps extends GridProps {
  sections?: React.ReactNode[];
}

export function PageGrid(props: PageGridProps) {
  const { sections = [], children = [], ...other } = props;
  const childrenArray = React.Children.toArray(children).concat(sections);
  return (
    <Grid container spacing={1} justify="flex-start" alignItems="stretch" {...other}>
      {childrenArray.map((section, i) => (
        <Grid item key={i} xs={12}>
          <Box mt={[4, 0, 0]}>{section}</Box>
        </Grid>
      ))}
    </Grid>
  );
}

interface SectionGridProps {
  items: React.ReactNode[];
  useDivider?: boolean;
}

export function SectionGrid(props: SectionGridProps) {
  const { items } = props;
  return (
    <Grid container justify="space-between">
      {items.map((item, i) => {
        return (
          <Grid item md={12} xs={12} key={i}>
            {item}
          </Grid>
        );
      })}
    </Grid>
  );
}

export function DataField(props: TextFieldProps) {
  const { label, value } = props;

  function handleEditorDidMount(editor: monaco.editor.IStandaloneCodeEditor) {
    const editorElement: HTMLElement | null = editor.getDomNode();
    if (!editorElement) {
      return;
    }
    const lineCount = editor.getModel()?.getLineCount() || 1;
    if (lineCount <= 10) {
      editorElement.style.height = '10vh';
    } else {
      editorElement.style.height = '40vh';
    }
    editor.layout();
  }
  let language = (label as string).split('.').pop() as string;
  if (language !== 'json') {
    language = 'yaml';
  }
  return (
    <>
      <Box borderTop={0} border={1}>
        <Box display="flex">
          <Box width="10%" borderTop={1} height={'1px'}></Box>
          <Box pb={1} mt={-1} px={0.5}>
            <InputLabel>{label}</InputLabel>
          </Box>
          <Box width="100%" borderTop={1} height={'1px'}></Box>
        </Box>
        <Box mt={1} px={1} pb={1}>
          <Editor
            value={value as string}
            language={language}
            onMount={handleEditorDidMount}
            options={{ readOnly: true, lineNumbers: 'off' }}
            theme="vs-dark"
          />
        </Box>
      </Box>
    </>
  );
}

export function SecretField(props: InputProps) {
  const { value, ...other } = props;
  const [showPassword, setShowPassword] = React.useState(false);
  const { t } = useTranslation('frequent');

  function handleClickShowPassword() {
    setShowPassword(!showPassword);
  }

  return (
    <Grid container alignItems="stretch" spacing={2}>
      <Grid item>
        <IconButton
          edge="end"
          aria-label={t('toggle field visibility')}
          onClick={handleClickShowPassword}
          onMouseDown={event => event.preventDefault()}
        >
          <Icon icon={showPassword ? eyeOff : eyeIcon} />
        </IconButton>
      </Grid>
      <Grid item xs>
        <Input
          readOnly
          type="password"
          fullWidth
          multiline={showPassword}
          rowsMax="20"
          value={showPassword ? Base64.decode(value as string) : '******'}
          {...other}
        />
      </Grid>
    </Grid>
  );
}

interface ConditionsTableProps {
  resource: KubeObjectInterface | null;
  showLastUpdate?: boolean;
}

export function ConditionsTable(props: ConditionsTableProps) {
  const { resource, showLastUpdate = true } = props;
  const { t } = useTranslation('glossary');

  function makeStatusLabel(condition: KubeCondition) {
    let status: StatusLabelProps['status'] = '';
    if (condition.type === 'Available') {
      status = condition.status === 'True' ? 'success' : 'error';
    }

    return <StatusLabel status={status}>{condition.type}</StatusLabel>;
  }

  function getColumns() {
    const cols: {
      label: string;
      getter: (arg: KubeCondition) => void;
      hide?: boolean;
    }[] = [
      {
        label: t('Condition'),
        getter: makeStatusLabel,
      },
      {
        label: t('Status'),
        getter: condition => condition.status,
      },
      {
        label: t('Last Transition'),
        getter: condition => <DateLabel date={condition.lastTransitionTime as string} />,
      },
      {
        label: t('Last Update'),
        getter: condition =>
          condition.lastUpdateTime ? <DateLabel date={condition.lastUpdateTime as string} /> : '-',
        hide: !showLastUpdate,
      },
      {
        label: t('Reason'),
        getter: condition =>
          condition.reason ? (
            <HoverInfoLabel label={condition.reason} hoverInfo={condition.message} />
          ) : (
            '-'
          ),
      },
    ];

    // Allow to filter the columns by using a hide field
    return cols.filter(col => !col.hide);
  }

  return (
    <SimpleTable
      data={(resource && resource.status && resource.status.conditions) || {}}
      columns={getColumns()}
    />
  );
}

export function ContainerInfo(props: { container: KubeContainer }) {
  const { container } = props;
  const { t } = useTranslation('glossary');

  function containerRows() {
    const env: { [name: string]: string } = {};
    (container.env || []).forEach(envVar => {
      let value = '';

      if (envVar.value) {
        value = envVar.value;
      } else if (envVar.valueFrom) {
        if (envVar.valueFrom.fieldRef) {
          value = envVar.valueFrom.fieldRef.fieldPath;
        } else if (envVar.valueFrom.secretKeyRef) {
          value = envVar.valueFrom.secretKeyRef.key;
        }
      }

      env[envVar.name] = value;
    });

    return [
      {
        name: t('Image'),
        value: container.image,
      },
      {
        name: t('Args'),
        value: container.args && (
          <MetadataDictGrid dict={container.args as { [index: number]: string }} showKeys={false} />
        ),
        hide: !container.args,
      },
      {
        name: t('Command'),
        value: (container.command || []).join(' '),
        hide: !container.command,
      },
      {
        name: t('Environment'),
        value: <MetadataDictGrid dict={env} />,
        hide: _.isEmpty(env),
      },
    ];
  }

  return (
    <Box py={1}>
      <SectionHeader noPadding title={container.name} headerStyle="normal" />
      <NameValueTable rows={containerRows()} />
    </Box>
  );
}

export function ContainersSection(props: { resource: KubeObjectInterface | null }) {
  const { resource } = props;
  const { t } = useTranslation('glossary');

  function getContainers() {
    if (!resource) {
      return [];
    }

    let containers: KubeContainer[] = [];

    if (resource.spec) {
      if (resource.spec.containers) {
        containers = resource.spec.containers;
      } else if (resource.spec.template && resource.spec.template.spec) {
        containers = resource.spec.template.spec.containers;
      }
    }

    return containers;
  }

  const containers = getContainers();
  const numContainers = containers.length;

  return (
    <SectionBox title={t('Containers')}>
      {numContainers === 0 ? (
        <Empty>No containers to show</Empty>
      ) : (
        containers.map((container: any, i: number) => {
          return (
            <React.Fragment key={i}>
              <ContainerInfo container={container} />
              {/* Don't show the divider if this is the last container */}
              {i !== numContainers - 1 && <Divider />}
            </React.Fragment>
          );
        })
      )}
    </SectionBox>
  );
}

export function ReplicasSection(props: { resource: KubeObjectInterface | null }) {
  const { resource } = props;
  const { t } = useTranslation('glossary');

  if (!resource) {
    return null;
  }

  return (
    <SectionBox title={t('Conditions')}>
      <ConditionsTable resource={resource} />
    </SectionBox>
  );
}
