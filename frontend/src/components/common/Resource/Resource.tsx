import { Icon } from '@iconify/react';
import { Button, InputLabel, Theme } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Grid, { GridProps } from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Input, { InputProps } from '@material-ui/core/Input';
import { TextFieldProps } from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/styles';
import Editor from '@monaco-editor/react';
import { Location } from 'history';
import { Base64 } from 'js-base64';
import _ from 'lodash';
import * as monaco from 'monaco-editor';
import React, { isValidElement, PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, NavLinkProps, useHistory, useLocation } from 'react-router-dom';
import { labelSelectorToQuery } from '../../../lib/k8s';
import {
  KubeCondition,
  KubeContainer,
  KubeContainerStatus,
  KubeObject,
  KubeObjectInterface,
} from '../../../lib/k8s/cluster';
import Pod, { KubePod } from '../../../lib/k8s/pod';
import { createRouteURL, RouteURLProps } from '../../../lib/router';
import { getThemeName } from '../../../lib/themes';
import { useTypedSelector } from '../../../redux/reducers/reducers';
import { useHasPreviousRoute } from '../../App/RouteSwitcher';
import Loader from '../../common/Loader';
import { SectionBox } from '../../common/SectionBox';
import SectionHeader, { HeaderStyleProps } from '../../common/SectionHeader';
import SimpleTable, { NameValueTable, NameValueTableRow } from '../../common/SimpleTable';
import DetailsViewSection from '../../DetailsViewSection';
import { PodListProps, PodListRenderer } from '../../pod/List';
import { LightTooltip } from '..';
import Empty from '../EmptyContent';
import ErrorBoundary from '../ErrorBoundary';
import { DateLabel, HoverInfoLabel, StatusLabel, StatusLabelProps, ValueLabel } from '../Label';
import Link, { LinkProps } from '../Link';
import { useMetadataDisplayStyles } from '.';
import DeleteButton from './DeleteButton';
import EditButton from './EditButton';
import { MetadataDictGrid, MetadataDisplay } from './MetadataDisplay';
import PortForward from './PortForward';
import ScaleButton from './ScaleButton';

export interface ResourceLinkProps extends Omit<LinkProps, 'routeName' | 'params'> {
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

export interface MainInfoSectionProps {
  resource: KubeObject | null;
  headerSection?: ((resource: KubeObject | null) => React.ReactNode) | React.ReactNode;
  title?: string;
  extraInfo?:
    | ((resource: KubeObject | null) => NameValueTableRow[] | null)
    | NameValueTableRow[]
    | null;
  actions?: ((resource: KubeObject | null) => React.ReactNode[] | null) | React.ReactNode[] | null;
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
  const headerActions = useTypedSelector(state => state.ui.views.details.headerActions);
  const { t } = useTranslation('frequent');
  const history = useHistory();

  const header = typeof headerSection === 'function' ? headerSection(resource) : headerSection;

  const allActions = (function stateActions() {
    return React.Children.toArray(
      headerActions.map(Action => {
        if (isValidElement(Action)) {
          return <ErrorBoundary>{Action}</ErrorBoundary>;
        } else if (Action === null) {
          return null;
        } else {
          return (
            <ErrorBoundary>
              <Action item={resource} />
            </ErrorBoundary>
          );
        }
      })
    );
  })()
    .concat(
      (function propsActions() {
        return React.Children.toArray(
          typeof actions === 'function' ? actions(resource) || [] : actions
        );
      })()
    )
    .concat(
      (function defaultActions() {
        return !noDefaultActions && resource
          ? [
              <ScaleButton item={resource} />,
              <EditButton item={resource} />,
              <DeleteButton item={resource} />,
            ]
          : [];
      })()
    );

  return (
    <>
      {(backLink || backLink === '' || resource) && (
        <Button
          startIcon={<Icon icon="mdi:chevron-left" />}
          size="small"
          onClick={() => {
            // Empty string means go back using the history.
            if (backLink === '') {
              history.goBack();
              return;
            }
            if (typeof backLink === 'string') {
              history.push(backLink);
              return;
            }

            history.push(backLink || createRouteURL(resource.listRoute));
          }}
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
            actions={allActions}
          />
        }
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
    </>
  );
}

export interface DetailsGridProps
  extends PropsWithChildren<Omit<MainInfoSectionProps, 'resource'>> {
  resourceType: KubeObject;
  name: string;
  namespace?: string;
  sectionsFunc?: (item: KubeObject) => React.ReactNode;
}

export function DetailsGrid(props: DetailsGridProps) {
  const { sectionsFunc, resourceType, name, namespace, children, ...otherMainInfoSectionProps } =
    props;
  const location = useLocation<{ backLink: NavLinkProps['location'] }>();
  const hasPreviousRoute = useHasPreviousRoute();

  const backLink: string | Location | undefined = React.useMemo(() => {
    const stateLink = location.state?.backLink || null;
    if (!!stateLink) {
      return generatePath(stateLink.pathname);
    }

    if (!!hasPreviousRoute) {
      // Will make it go back to the previous route
      return '';
    }

    let route;
    try {
      route = new resourceType().listRoute;
    } catch (err) {
      console.error(
        `Error creating route for details grid (resource type=${resourceType}): ${err}`
      );

      // Let the MainInfoSection handle it.
      return undefined;
    }

    return createRouteURL(route);
  }, []);

  const [item, error] = resourceType.useGet(name, namespace);

  return (
    <PageGrid>
      <MainInfoSection
        resource={item}
        error={error}
        backLink={backLink}
        {...otherMainInfoSectionProps}
      />
      <>{!!sectionsFunc && sectionsFunc(item)}</>
      {children}
      <DetailsViewSection resource={item} />
    </PageGrid>
  );
}

export interface PageGridProps extends GridProps {
  sections?: React.ReactNode;
  children?: React.ReactNode;
}

export function PageGrid(props: PageGridProps) {
  const { sections = [], children = [], ...other } = props;
  const childrenArray = React.Children.toArray(children).concat(React.Children.toArray(sections));
  return (
    <Grid container spacing={1} justifyContent="flex-start" alignItems="stretch" {...other}>
      {childrenArray.map((section, i) => (
        <Grid item key={i} xs={12}>
          <Box mt={[4, 0, 0]}>{section}</Box>
        </Grid>
      ))}
    </Grid>
  );
}

export interface SectionGridProps {
  items: React.ReactNode[];
  useDivider?: boolean;
}

export function SectionGrid(props: SectionGridProps) {
  const { items } = props;
  return (
    <Grid container justifyContent="space-between">
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
  // Make sure we reload after a theme change
  useTheme();
  const themeName = getThemeName();

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
            theme={themeName === 'dark' ? 'vs-dark' : 'light'}
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
          <Icon icon={showPassword ? 'mdi:eye-off' : 'mdi:eye'} />
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

export interface ConditionsTableProps {
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
      data={(resource && resource.status && resource.status.conditions) || []}
      columns={getColumns()}
    />
  );
}

export interface VolumeMountsProps {
  mounts?:
    | {
        mountPath: string;
        name: string;
        readOnly: boolean;
      }[];
}

export function VolumeMounts(props: VolumeMountsProps) {
  const { mounts } = props;
  const { t } = useTranslation();
  if (!mounts) {
    return null;
  }

  return (
    <SimpleTable
      columns={[
        {
          label: t('frequent|Mount Path'),
          getter: (data: any) => data.mountPath,
        },
        {
          label: t('frequent|from'),
          getter: (data: any) => data.name,
        },
        {
          label: t('frequent|I/O'),
          getter: (data: any) => (data.readOnly ? 'ReadOnly' : 'ReadWrite'),
        },
      ]}
      data={mounts}
    />
  );
}

export function LivenessProbes(props: { liveness: KubeContainer['livenessProbe'] }) {
  const classes = useMetadataDisplayStyles({});

  const { liveness } = props;

  function LivenessProbeItem(props: { children: React.ReactNode }) {
    return props.children ? (
      <Box p={0.5}>
        <Typography className={classes.metadataValueLabel} display="inline">
          {props.children}
        </Typography>
      </Box>
    ) : null;
  }

  return (
    <Box display="flex" flexDirection="column">
      <LivenessProbeItem>
        {`http-get, path: ${liveness?.httpGet?.path}, port: ${liveness?.httpGet?.port},
    scheme: ${liveness?.httpGet?.scheme}`}
      </LivenessProbeItem>
      <LivenessProbeItem>
        {liveness?.exec?.command && `exec[${liveness?.exec?.command.join(' ')}]`}
      </LivenessProbeItem>
      <LivenessProbeItem>
        {liveness?.successThreshold && `success = ${liveness?.successThreshold}`}
      </LivenessProbeItem>
      <LivenessProbeItem>
        {liveness?.failureThreshold && `failure = ${liveness?.failureThreshold}`}
      </LivenessProbeItem>
      <LivenessProbeItem>
        {liveness?.initialDelaySeconds && `delay = ${liveness?.initialDelaySeconds}s`}
      </LivenessProbeItem>
      <LivenessProbeItem>
        {liveness?.timeoutSeconds && `timeout = ${liveness?.timeoutSeconds}s`}
      </LivenessProbeItem>
      <LivenessProbeItem>
        {liveness?.periodSeconds && `period = ${liveness?.periodSeconds}s`}
      </LivenessProbeItem>
    </Box>
  );
}

const useContainerInfoStyles = makeStyles((theme: Theme) => ({
  imageID: {
    paddingTop: theme.spacing(1),
    fontSize: '.95rem',
  },
}));

export interface ContainerInfoProps {
  container: KubeContainer;
  resource?: KubeObjectInterface | null;
  status?: Omit<KubePod['status']['KubeContainerStatus'], 'name'>;
}

export function ContainerInfo(props: ContainerInfoProps) {
  const { container, status, resource } = props;
  const theme = useTheme();
  const classes = useContainerInfoStyles(theme);
  const { t } = useTranslation('glossary');

  function getContainerStatusLabel() {
    if (!status || !container) {
      return undefined;
    }

    let state: KubeContainerStatus['state']['waiting' | 'terminated'] | null = null;
    let label = t('frequent|Ready');
    let statusType: StatusLabelProps['status'] = '';

    if (!!status.state.waiting) {
      state = status.state.waiting;
      statusType = 'warning';
      label = t('frequent|Waiting');
    } else if (!!status.state.running) {
      statusType = 'success';
      label = t('frequent|Running');
    } else if (!!status.state.terminated) {
      statusType = status.state.terminated.exitCode === 0 ? '' : 'error';
      label = t('frequent|Error');
    }

    const tooltipID = 'container-state-message-' + container.name;

    return (
      <>
        <StatusLabel status={statusType} aria-describedby={tooltipID}>
          {label + (state?.reason ? ` (${state.reason})` : '')}
        </StatusLabel>
        {!!state && state.message && (
          <LightTooltip role="tooltip" title={state.message} interactive id={tooltipID}>
            <Box aria-label="hidden" display="inline" px={1} style={{ verticalAlign: 'bottom' }}>
              <Icon icon="mdi:alert-outline" width="1.3rem" height="1.3rem" aria-label="hidden" />
            </Box>
          </LightTooltip>
        )}
      </>
    );
  }

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
        name: t('Status'),
        value: getContainerStatusLabel(),
        hide: !status,
      },
      {
        name: t('frequent|Restart Count'),
        value: status?.restartCount,
        hide: !status,
      },
      {
        name: t('Container ID'),
        value: status?.containerID,
        hide: !status,
      },
      {
        name: t('Image Pull Policy'),
        value: container.imagePullPolicy,
      },
      {
        name: t('Image'),
        value: (
          <>
            <Typography>{container.image}</Typography>
            {status?.imageID && (
              <Typography className={classes.imageID}>
                <Typography component="span" style={{ fontWeight: 'bold' }}>
                  ID:
                </Typography>{' '}
                {status?.imageID}
              </Typography>
            )}
          </>
        ),
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
      {
        name: t('Liveness Probes'),
        value: <LivenessProbes liveness={container.livenessProbe} />,
        hide: _.isEmpty(container.livenessProbe),
      },
      {
        name: t('Ports'),
        value: (
          <Grid container>
            {container.ports?.map(({ containerPort, protocol }, index) => (
              <>
                <Grid item xs={12} key={`port_line_${index}`}>
                  <Box display="flex" alignItems={'center'}>
                    <Box px={0.5} minWidth={120}>
                      <ValueLabel>{`${protocol}:`}</ValueLabel>
                      <ValueLabel>{containerPort}</ValueLabel>
                    </Box>
                    <PortForward
                      isPod
                      containerPort={containerPort}
                      name={resource?.metadata.name}
                      namespace={resource?.metadata.namespace}
                      isPodRunning={resource?.status.phase !== 'Failed'}
                    />
                  </Box>
                </Grid>
                {index < container.ports!.length - 1 && (
                  <Grid item xs={12}>
                    <Box mt={2} mb={2}>
                      <Divider />
                    </Box>
                  </Grid>
                )}
              </>
            ))}
          </Grid>
        ),
        hide: _.isEmpty(container.ports),
      },
    ];
  }

  return (
    <Box py={1}>
      <SectionHeader noPadding title={container.name} headerStyle="normal" />
      <NameValueTable rows={containerRows()} />
      {!_.isEmpty(container.volumeMounts) && (
        <>
          <Divider />
          <SectionHeader noPadding title={t('Volume Mounts')} headerStyle="label" />
          <VolumeMounts mounts={container.volumeMounts} />
        </>
      )}
    </Box>
  );
}

export interface OwnedPodsSectionProps {
  resource: KubeObjectInterface;
  hideColumns?: PodListProps['hideColumns'];
}

export function OwnedPodsSection(props: OwnedPodsSectionProps) {
  const { resource, hideColumns } = props;

  const queryData = {
    namespace: resource.kind === 'Namespace' ? resource.metadata.name : undefined,
    labelSelector: resource?.spec?.selector ? labelSelectorToQuery(resource?.spec?.selector) : '',
    fieldSelector: resource.kind === 'Node' ? `spec.nodeName=${resource.metadata.name}` : undefined,
  };

  const [pods, error] = Pod.useList(queryData);

  return <PodListRenderer hideColumns={hideColumns} pods={pods} error={error} />;
}

export function ContainersSection(props: { resource: KubeObjectInterface | null }) {
  const { resource } = props;
  const { t } = useTranslation('glossary');

  let title = '…';

  function getContainers() {
    if (!resource) {
      return [];
    }

    let containers: KubeContainer[] = [];

    if (resource.spec) {
      if (resource.spec.containers) {
        title = t('Containers');
        containers = resource.spec.containers;
      } else if (resource.spec.template && resource.spec.template.spec) {
        title = t('Container Spec');
        containers = resource.spec.template.spec.containers;
      }
    }

    return containers;
  }

  function getStatuses() {
    if (!resource || resource.kind !== 'Pod') {
      return {};
    }

    const statuses: {
      [key: string]: ContainerInfoProps['status'];
    } = {};

    ((resource as KubePod).status.containerStatuses || []).forEach(containerStatus => {
      const { name, ...status } = containerStatus;
      statuses[name] = { ...status };
    });

    return statuses;
  }

  const containers = getContainers();
  const statuses = getStatuses();
  const numContainers = containers.length;

  return (
    <>
      <SectionBox title={title} />
      <>
        {numContainers === 0 ? (
          <SectionBox>
            <Empty>{t('resource|No data to be shown.')}</Empty>
          </SectionBox>
        ) : (
          containers.map((container: any, i: number) => (
            <SectionBox key={i} outterBoxProps={{ pt: 1 }}>
              <ContainerInfo
                resource={resource}
                container={container}
                status={statuses[container.name]}
              />
            </SectionBox>
          ))
        )}
      </>
    </>
  );
}

export function ConditionsSection(props: { resource: KubeObjectInterface | null }) {
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
