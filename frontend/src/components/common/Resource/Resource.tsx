import { Icon } from '@iconify/react';
import Editor from '@monaco-editor/react';
import { InputLabel, Theme } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid, { GridProps, GridSize } from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Input, { InputProps } from '@mui/material/Input';
import Paper from '@mui/material/Paper';
import { TextFieldProps } from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { makeStyles, useTheme } from '@mui/styles';
import { Location } from 'history';
import { Base64 } from 'js-base64';
import _, { has } from 'lodash';
import React, { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, NavLinkProps, useLocation } from 'react-router-dom';
import YAML from 'yaml';
import { labelSelectorToQuery, ResourceClasses } from '../../../lib/k8s';
import { ApiError } from '../../../lib/k8s/apiProxy';
import {
  KubeCondition,
  KubeContainer,
  KubeContainerStatus,
  KubeObject,
  KubeObjectInterface,
} from '../../../lib/k8s/cluster';
import Pod, { KubePod, KubeVolume } from '../../../lib/k8s/pod';
import { createRouteURL, RouteURLProps } from '../../../lib/router';
import { getThemeName } from '../../../lib/themes';
import { useTypedSelector } from '../../../redux/reducers/reducers';
import { useHasPreviousRoute } from '../../App/RouteSwitcher';
import { SectionBox } from '../../common/SectionBox';
import SimpleTable, { NameValueTable } from '../../common/SimpleTable';
import {
  DefaultDetailsViewSection,
  DetailsViewSection,
} from '../../DetailsViewSection/detailsViewSectionSlice';
import { PodListProps, PodListRenderer } from '../../pod/List';
import { LightTooltip, Loader, ObjectEventList } from '..';
import BackLink from '../BackLink';
import Empty from '../EmptyContent';
import ErrorBoundary from '../ErrorBoundary';
import InnerTable from '../InnerTable';
import { DateLabel, HoverInfoLabel, StatusLabel, StatusLabelProps, ValueLabel } from '../Label';
import Link, { LinkProps } from '../Link';
import { useMetadataDisplayStyles } from '.';
import { MainInfoSection, MainInfoSectionProps } from './MainInfoSection/MainInfoSection';
import { MainInfoHeader } from './MainInfoSection/MainInfoSectionHeader';
import { MetadataDictGrid, MetadataDisplay } from './MetadataDisplay';
import PortForward from './PortForward';

export { MainInfoSection };
export type { MainInfoSectionProps };

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

const useDetailsGridStyles = makeStyles((theme: Theme) => ({
  section: {
    marginBottom: theme.spacing(2),
  },
}));

export interface DetailsGridProps
  extends PropsWithChildren<Omit<MainInfoSectionProps, 'resource'>> {
  /** Resource type to fetch (from the ResourceClasses). */
  resourceType: KubeObject;
  /** Name of the resource. */
  name: string;
  /** Namespace of the resource. If not provided, it's assumed the resource is not namespaced. */
  namespace?: string;
  /** Sections to show in the details grid (besides the default ones). */
  extraSections?:
    | ((item: KubeObject) => boolean | DetailsViewSection[])
    | boolean
    | DetailsViewSection[];
  /** @deprecated Use extraSections instead. */
  sectionsFunc?: (item: KubeObject) => React.ReactNode | DetailsViewSection[];
  /** If true, will show the events section. */
  withEvents?: boolean;
  /** Called when the resource instance is created/updated, or there is an error. */
  onResourceUpdate?: (resource: KubeObject, error: ApiError) => void;
}

/** Renders the different parts that constibute an actual resource's details view.
 * Those are: the back link, the header, the main info section, the extra sections, and the events section.
 */
export function DetailsGrid(props: DetailsGridProps) {
  const {
    sectionsFunc,
    resourceType,
    name,
    namespace,
    children,
    withEvents,
    extraSections,
    onResourceUpdate,
    ...otherMainInfoSectionProps
  } = props;
  const { t } = useTranslation();
  const location = useLocation<{ backLink: NavLinkProps['location'] }>();
  const classes = useDetailsGridStyles();
  const hasPreviousRoute = useHasPreviousRoute();
  const detailViews = useTypedSelector(state => state.detailsViewSection.detailsViewSections);
  const detailViewsProcessors = useTypedSelector(
    state => state.detailsViewSection.detailsViewSectionsProcessors
  );
  // This component used to have a MainInfoSection with all these props passed to it, so we're
  // using them to accomplish the same behavior.
  const { extraInfo, actions, noDefaultActions, headerStyle, backLink, title, headerSection } =
    otherMainInfoSectionProps;

  const [item, error] = resourceType.useGet(name, namespace);
  const prevItemRef = React.useRef<{ uid?: string; version?: string; error?: ApiError }>({});

  React.useEffect(() => {
    // We cannot call this callback more than once on each version of the item, in order to avoid
    // infinite loops.
    const prevItem = prevItemRef.current;
    if (
      prevItem?.uid === item?.metatada?.uid &&
      prevItem?.version === item?.metadata?.resourceVersion &&
      error === prevItem.error
    ) {
      return;
    }

    prevItemRef.current = {
      uid: item?.metatada?.uid,
      version: item?.metadata?.resourceVersion,
      error,
    };
    onResourceUpdate?.(item, error);
  }, [item, error]);

  const actualBackLink: string | Location | undefined = React.useMemo(() => {
    if (!!backLink || backLink === '') {
      return backLink;
    }

    const stateLink = location.state?.backLink || null;
    if (!!stateLink) {
      return generatePath(stateLink.pathname);
    }

    if (!!hasPreviousRoute) {
      // Will make it go back to the previous route
      return '';
    }

    let route;

    if (!!item) {
      route = item.listRoute;
    } else {
      try {
        route = new resourceType().listRoute;
      } catch (err) {
        console.error(
          `Error creating route for details grid (resource type=${resourceType}): ${err}`
        );

        // Let the MainInfoSection handle it.
        return undefined;
      }
    }

    return createRouteURL(route);
  }, [item]);

  const sections: DetailsViewSection[] = [];

  // Back link
  if (!!actualBackLink || actualBackLink === '') {
    sections.push({
      id: DefaultDetailsViewSection.BACK_LINK,
      section: <BackLink to={actualBackLink} />,
    });
  }

  // Title / Header
  sections.push({
    id: DefaultDetailsViewSection.MAIN_HEADER,
    section: (
      <MainInfoHeader
        title={title}
        resource={item}
        actions={actions}
        noDefaultActions={noDefaultActions}
        headerStyle={headerStyle}
      />
    ),
  });

  // Error / Loading or Metadata
  if (item === null) {
    sections.push(
      !!error
        ? {
            id: DefaultDetailsViewSection.ERROR,
            section: (
              <Paper variant="outlined">
                <Empty color="error">{error.toString()}</Empty>
              </Paper>
            ),
          }
        : {
            id: DefaultDetailsViewSection.LOADING,
            section: <Loader title={t('translation|Loading resource data')} />,
          }
    );
  } else {
    const mainInfoHeader =
      typeof headerSection === 'function' ? headerSection(item) : headerSection;
    sections.push({
      id: DefaultDetailsViewSection.METADATA,
      section: (
        <SectionBox aria-busy={item === null} aria-live="polite">
          {mainInfoHeader}
          <MetadataDisplay resource={item} extraRows={extraInfo} />
        </SectionBox>
      ),
    });
  }

  // Other sections
  if (!!sectionsFunc) {
    console.info(
      `Using legacy sectionsFunc in DetailsGrid for ${
        title || resourceType + '/' + namespace + '/' + name
      }. Please use the children, or set up a details view processor.`
    );
    sections.push({
      id: 'LEGACY_SECTIONS_FUNC',
      section: sectionsFunc(item),
    });
  }

  if (!!extraSections) {
    let actualExtraSections: DetailsViewSection[] = [];
    if (Array.isArray(extraSections)) {
      actualExtraSections = extraSections;
    } else if (typeof extraSections === 'function') {
      const extraSectionsResult = extraSections(item) || [];
      if (Array.isArray(extraSectionsResult)) {
        actualExtraSections = extraSectionsResult;
      }
    }

    sections.push(...actualExtraSections);
  }

  // Children
  if (!!children) {
    sections.push({
      id: DefaultDetailsViewSection.CHILDREN,
      section: children,
    });
  }

  // Plugin appended details views
  if (!!detailViews) {
    sections.push(...detailViews);
  }

  // Events
  if (withEvents && item) {
    sections.push({
      id: DefaultDetailsViewSection.EVENTS,
      section: <ObjectEventList object={item} />,
    });
  }

  let sectionsProcessed = [...sections];
  for (const detailViewsProcessor of detailViewsProcessors) {
    let processorsSections = sectionsProcessed;
    try {
      processorsSections = detailViewsProcessor.processor(item, sectionsProcessed);
      if (!Array.isArray(processorsSections)) {
        throw new Error(`Invalid return value: ${processorsSections}`);
      }
    } catch (err) {
      console.error(
        `Error processing details view sections for ${resourceType}/${namespace}/${name}: ${err}`
      );

      continue;
    }

    sectionsProcessed = processorsSections;
  }

  return (
    <PageGrid className={classes.section}>
      {React.Children.toArray(
        sectionsProcessed.map(section => {
          const Section = has(section, 'section')
            ? (section as DetailsViewSection).section
            : section;
          if (React.isValidElement(Section)) {
            return <ErrorBoundary>{Section}</ErrorBoundary>;
          } else if (Section === null) {
            return null;
          } else if (typeof Section === 'function') {
            return (
              <ErrorBoundary>
                <Section resource={item} />
              </ErrorBoundary>
            );
          }
        })
      )}
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

  function handleEditorDidMount(editor: any) {
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
  const { t } = useTranslation();

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
          size="medium"
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
          maxRows="20"
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
  const { t } = useTranslation(['glossary', 'translation']);

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
        label: t('translation|Status'),
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
        label: t('translation|Reason'),
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
    <InnerTable
      columns={[
        {
          label: t('translation|Mount Path'),
          getter: (data: any) => data.mountPath,
        },
        {
          label: t('translation|from'),
          getter: (data: any) => data.name,
        },
        {
          label: t('translation|I/O'),
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
  const { t } = useTranslation(['glossary', 'translation']);

  function getContainerStatusLabel() {
    if (!status || !container) {
      return undefined;
    }

    let state: KubeContainerStatus['state']['waiting' | 'terminated'] | null = null;
    let label = t('translation|Ready');
    let statusType: StatusLabelProps['status'] = '';

    if (!!status.state.waiting) {
      state = status.state.waiting;
      statusType = 'warning';
      label = t('translation|Waiting');
    } else if (!!status.state.running) {
      statusType = 'success';
      label = t('translation|Running');
    } else if (!!status.state.terminated) {
      statusType = status.state.terminated.exitCode === 0 ? '' : 'error';
      label = t('translation|Error');
    }

    const tooltipID = 'container-state-message-' + container.name;

    return (
      <>
        <StatusLabel
          status={statusType}
          aria-describedby={!!state?.message ? tooltipID : undefined}
        >
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
        name: container.name,
        withHighlightStyle: true,
      },
      {
        name: t('translation|Status'),
        value: getContainerStatusLabel(),
        hide: !status,
      },
      {
        name: t('translation|Restart Count'),
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
                    {!!resource && ['Service', 'Pod'].includes(resource.kind) && (
                      <PortForward containerPort={containerPort} resource={resource} />
                    )}
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
      {
        name: t('Volume Mounts'),
        value: <VolumeMounts mounts={container?.volumeMounts || undefined} />,
        valueCellProps: { sm: 12 as GridSize },
        hide: _.isEmpty(container?.volumeMounts),
      },
    ];
  }

  return (
    <Box pb={1}>
      <NameValueTable rows={containerRows()} />
    </Box>
  );
}

export interface OwnedPodsSectionProps {
  resource: KubeObjectInterface;
  hideColumns?: PodListProps['hideColumns'];
}

export function OwnedPodsSection(props: OwnedPodsSectionProps) {
  const { resource, hideColumns } = props;
  let namespace;

  if (resource.kind === 'Namespace') {
    namespace = resource.metadata.name;
  } else {
    namespace = resource.metadata.namespace;
  }
  const queryData = {
    namespace,
    labelSelector: resource?.spec?.selector ? labelSelectorToQuery(resource?.spec?.selector) : '',
    fieldSelector: resource.kind === 'Node' ? `spec.nodeName=${resource.metadata.name}` : undefined,
  };

  const [pods, error] = Pod.useList(queryData);
  const onlyOneNamespace = !!resource.metadata.namespace || resource.kind === 'Namespace';

  return (
    <PodListRenderer
      hideColumns={hideColumns || onlyOneNamespace ? ['namespace'] : undefined}
      pods={pods}
      error={error}
      noNamespaceFilter={onlyOneNamespace}
    />
  );
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

  function getInitContainers() {
    return resource?.spec?.initContainers || [];
  }

  function getEphemeralContainers() {
    return resource?.spec?.ephemeralContainers || [];
  }

  function getStatuses(
    statusKind: 'containerStatuses' | 'initContainerStatuses' | 'ephemeralContainerStatuses'
  ) {
    if (!resource || resource.kind !== 'Pod') {
      return {};
    }

    const statuses: {
      [key: string]: ContainerInfoProps['status'];
    } = {};

    ((resource as KubePod).status[statusKind] || []).forEach(containerStatus => {
      const { name, ...status } = containerStatus;
      statuses[name] = { ...status };
    });

    return statuses;
  }

  const containers = getContainers();
  const initContainers = getInitContainers();
  const ephemContainers = getEphemeralContainers();
  const statuses = getStatuses('containerStatuses');
  const initStatuses = getStatuses('initContainerStatuses');
  const ephemStatuses = getStatuses('ephemeralContainerStatuses');
  const numContainers = containers.length;

  return (
    <>
      <SectionBox title={title}>
        {numContainers === 0 ? (
          <Empty>{t('translation|No data to be shown.')}</Empty>
        ) : (
          containers.map((container: any) => (
            <ContainerInfo
              key={`container_${container.name}`}
              resource={resource}
              container={container}
              status={statuses[container.name]}
            />
          ))
        )}
      </SectionBox>

      {ephemContainers.length > 0 && (
        <SectionBox title={t('glossary|Ephemeral Containers')}>
          {ephemContainers.map((ephemContainer: KubeContainer) => (
            <ContainerInfo
              key={`ephem_container_${ephemContainer.name}`}
              resource={resource}
              container={ephemContainer}
              status={ephemStatuses[ephemContainer.name]}
            />
          ))}
        </SectionBox>
      )}

      {initContainers.length > 0 && (
        <SectionBox title={t('translation|Init Containers')}>
          {initContainers.map((initContainer: KubeContainer, i: number) => (
            <ContainerInfo
              key={`init_container_${i}`}
              resource={resource}
              container={initContainer}
              status={initStatuses[initContainer.name]}
            />
          ))}
        </SectionBox>
      )}
    </>
  );
}

export function ConditionsSection(props: { resource: KubeObjectInterface | null }) {
  const { resource } = props;
  const { t } = useTranslation(['glossary']);

  if (!resource) {
    return null;
  }

  return (
    <SectionBox title={t('translation|Conditions')}>
      <ConditionsTable resource={resource} />
    </SectionBox>
  );
}

export interface VolumeSectionProps {
  resource: KubeObjectInterface | null;
}

export interface VolumeRowsProps {
  volume: KubeVolume;
}

export interface PrintVolumeLinkProps {
  volumeName: string;
  volumeKind: string;
  volume: KubeVolume;
}

export interface VolumePrints {
  directPrint?: any[];
  yamlPrint?: any[];
}

export function VolumeSection(props: VolumeSectionProps) {
  const { t } = useTranslation('glossary');
  const { resource } = props;
  const volumes = resource?.spec?.volumes;

  if (!volumes) {
    return null;
  }

  const namespace = resource?.metadata?.namespace;

  /*
   * printVolumeLink will print a working link that is set within the router using fields from the resource as params
   */
  function PrintVolumeLink(props: PrintVolumeLinkProps) {
    const { volumeName, volumeKind, volume } = props;
    const resourceClasses = ResourceClasses;
    const classList = Object.keys(resourceClasses);

    for (const kind of classList) {
      if (kind.toLowerCase() === volumeKind.toLowerCase()) {
        const volumeClass = resourceClasses[kind];
        const volumeRoute = volumeClass.detailsRoute;
        const volumeNamespace = volumeClass.isNamespaced ? namespace : null;

        const volumeKindNames = {
          configMap: 'name',
          secret: 'secretName',
          persistentVolumeClaim: 'claimName',
        };

        const volumeNameKey = volumeKindNames[volumeKind as keyof typeof volumeKindNames];
        if (!!volumeNameKey) {
          const detailName = volume[volumeKind][volumeNameKey];
          if (!!detailName) {
            return (
              <Link
                routeName={volumeRoute}
                params={{ namespace: volumeNamespace, name: detailName }}
              >
                {volumeName}
              </Link>
            );
          }
        }
      }
    }

    return <Typography>{volumeName}</Typography>;
  }

  function volumeRows(volume: VolumeRowsProps['volume']) {
    const { name, ...objWithVolumeKind } = volume;
    const volumeKind = Object.keys(objWithVolumeKind)[0] || '';

    if (!volume) {
      return [];
    }

    function printVolumeDetails(volume: VolumeRowsProps['volume']): VolumePrints {
      const { ...vol } = volume[volumeKind];

      // array for items that are printable
      const directPrint = [];

      // array for items that are not printable and need to be printed to yaml
      const yamlPrint = [];

      // loop over volumeKeys and check if the value is a string, number, or bool
      for (const key in vol) {
        if (!(vol[key] === '')) {
          if (
            typeof vol[key] === 'string' ||
            typeof vol[key] === 'number' ||
            typeof vol[key] === 'boolean'
          ) {
            directPrint.push({
              volKey: key,
              volValue: typeof vol[key] === 'boolean' ? vol[key].toString() : vol[key],
            });
          } else {
            yamlPrint.push({
              volKey: key,
              volValue: vol[key],
            });
          }
        }
      }

      const volumePrints = {
        directPrint,
        yamlPrint,
      };

      return volumePrints;
    }

    const volumeDetails: VolumePrints = printVolumeDetails(volume);

    return [
      {
        name: name,
        withHighlightStyle: true,
      },
      ...(volumeKind
        ? [
            {
              name: 'Kind',
              value: volumeKind,
            },
          ]
        : []),
      {
        name: 'Source',
        value: <PrintVolumeLink volumeName={name} volumeKind={volumeKind} volume={volume} />,
      },
      ...(volumeDetails.directPrint
        ? volumeDetails.directPrint.map(
            ({ volKey, volValue }: { volKey: string; volValue: any }) => {
              return {
                name: volKey,
                value: volValue,
              };
            }
          )
        : []),
      ...(volumeDetails.yamlPrint
        ? volumeDetails.yamlPrint.map(({ volKey, volValue }: { volKey: string; volValue: any }) => {
            return {
              name: volKey,
              value: (
                <Typography component="pre" variant="body2">
                  {YAML.stringify(volValue)}
                </Typography>
              ),
            };
          })
        : []),
    ];
  }

  return (
    <SectionBox title={t('translation|Volumes')}>
      {volumes.map((volume: VolumeRowsProps['volume']) => (
        <NameValueTable key={volume.name} rows={volumeRows(volume)} />
      ))}
    </SectionBox>
  );
}
