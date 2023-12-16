import { Icon, InlineIcon } from '@iconify/react';
import { Box, IconButton, Menu, MenuItem } from '@mui/material';
import MuiLink from '@mui/material/Link';
import makeStyles from '@mui/styles/makeStyles';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import helpers from '../../helpers';
import { listPortForward, startPortForward, stopOrDeletePortForward } from '../../lib/k8s/apiProxy';
import { getCluster } from '../../lib/util';
import { Link, Loader, SectionBox, SimpleTable, StatusLabel } from '../common';
import {
  PORT_FORWARD_RUNNING_STATUS,
  PORT_FORWARD_STOP_STATUS,
  PORT_FORWARDS_STORAGE_KEY,
} from '../common/Resource/PortForward';

const useStyles = makeStyles(theme => ({
  link: {
    // color: portforward.status === PORT_FORWARD_RUNNING_STATUS ? '#2774B3' : '',
    cursor: 'pointer',
    marginRight: theme.spacing(1),
  },
  disabledLink: {
    pointerEvents: 'none',
    color: theme.palette.text.disabled,
  },
  linkIcon: {
    marginLeft: theme.spacing(0.5),
  },
}));

const enum PortForwardAction {
  Start = 'Start',
  Stop = 'Stop',
  Delete = 'Delete',
}

export default function PortForwardingList() {
  const [portforwards, setPortForwards] = React.useState<any[]>([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [portForwardInAction, setPortForwardInAction] = React.useState<any>(null);
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const cluster = getCluster();
  const { t, i18n } = useTranslation(['translation', 'glossary']);
  const optionsTranslated = React.useMemo(
    () => ({
      [PortForwardAction.Start]: t('translation|Start'),
      [PortForwardAction.Stop]: t('translation|Stop'),
      [PortForwardAction.Delete]: t('translation|Delete'),
    }),
    [i18n.language]
  );
  const options = Object.keys(optionsTranslated) as (keyof typeof optionsTranslated)[];

  function fetchPortForwardList(showError?: boolean) {
    const cluster = getCluster();
    if (!cluster) return;

    // fetch port forwarding list
    listPortForward(cluster).then(portforwards => {
      const massagedPortForwards = portforwards === null ? [] : portforwards;
      massagedPortForwards.forEach((portforward: any) => {
        if (portForwardInAction?.id === portforward.id) {
          if (portforward.Error && showError) {
            enqueueSnackbar(portforward.Error, {
              key: 'portforward-error',
              preventDuplicate: true,
              autoHideDuration: 3000,
              variant: 'error',
            });
          }
        }
      });

      // sync portforwards from backend with localStorage
      const portforwardInStorage = localStorage.getItem(PORT_FORWARDS_STORAGE_KEY);
      const parsedPortForwards = JSON.parse(portforwardInStorage || '[]');
      parsedPortForwards.forEach((portforward: any) => {
        const index = massagedPortForwards.findIndex((pf: any) => pf.id === portforward.id);
        if (index === -1) {
          portforward.status = PORT_FORWARD_STOP_STATUS;
          massagedPortForwards.push(portforward);
        }
      });
      localStorage.setItem(
        PORT_FORWARDS_STORAGE_KEY,
        JSON.stringify(
          // in the locaStorage we store portforward status as stop
          // this is because the correct status is always present on the backend
          // the localStorage portforwards are used specifically when the user relaunches the app
          massagedPortForwards.map((portforward: any) => {
            const newPortforward = { ...portforward };
            newPortforward.status = PORT_FORWARD_STOP_STATUS;
            return newPortforward;
          })
        )
      );
      setPortForwards(massagedPortForwards);
    });
  }
  React.useEffect(() => {
    fetchPortForwardList();
  }, []);

  const handleClick = (event: any, portforward: any) => {
    setPortForwardInAction(portforward);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (option: string) => {
    setAnchorEl(null);
    if (!option || typeof option !== 'string') {
      return;
    }

    const { id, namespace, cluster, port, targetPort, pod, service, serviceNamespace } =
      portForwardInAction;

    let address = 'localhost';
    if (helpers.isDockerDesktop()) {
      address = '0.0.0.0';
    }

    portForwardInAction.loading = true;
    setPortForwardInAction(portForwardInAction);
    if (option === PortForwardAction.Start) {
      // start portforward
      startPortForward(
        cluster,
        namespace,
        pod,
        targetPort,
        service,
        serviceNamespace,
        port,
        address,
        id
      ).then(() => {
        portForwardInAction.loading = false;
        setPortForwardInAction(portForwardInAction);
        // update portforward list item
        fetchPortForwardList(true);
      });
    }
    if (option === PortForwardAction.Stop) {
      // stop portforward
      stopOrDeletePortForward(cluster, id, true).finally(() => {
        portForwardInAction.loading = false;
        setPortForwardInAction(portForwardInAction);
        // update portforward list item
        fetchPortForwardList(true);
      });
    }
    if (option === PortForwardAction.Delete) {
      // delete portforward
      stopOrDeletePortForward(cluster, id, false).finally(() => {
        portForwardInAction.loading = false;
        setPortForwardInAction(portForwardInAction);

        // remove portforward from storage too
        const portforwardInStorage = localStorage.getItem(PORT_FORWARDS_STORAGE_KEY);
        const parsedPortForwards = JSON.parse(portforwardInStorage || '[]');
        const index = parsedPortForwards.findIndex((pf: any) => pf.id === id);
        if (index !== -1) {
          parsedPortForwards.splice(index, 1);
        }
        localStorage.setItem(PORT_FORWARDS_STORAGE_KEY, JSON.stringify(parsedPortForwards));

        // update portforward list item
        fetchPortForwardList(true);
      });
    }
  };

  function prepareStatusLabel(portforward: any) {
    if (portForwardInAction?.id === portforward.id && portForwardInAction.loading) {
      return <Loader noContainer title={t('translation|Loading port forwarding')} size={30} />;
    }
    const error = portforward.error;
    if (error) {
      return <StatusLabel status="error">{t('translation|Error')}</StatusLabel>;
    }
    return (
      <StatusLabel status={portforward.status === PORT_FORWARD_RUNNING_STATUS ? 'success' : ''}>
        {portforward.status}
      </StatusLabel>
    );
  }

  return (
    <SectionBox title={t('glossary|Port Forwarding')}>
      <SimpleTable
        columns={[
          {
            label: t('translation|Name'),
            getter: portforward => {
              const podOrService = portforward.service ? 'service' : 'pod';
              const name = portforward.service || portforward.pod;
              const namespace = portforward.serviceNamespace || portforward.namespace;
              return (
                <Link routeName={podOrService} params={{ name, namespace }}>
                  {name}
                </Link>
              );
            },
          },
          {
            label: t('glossary|Namespace'),
            getter: portforward => {
              return portforward.serviceNamespace || portforward.namespace;
            },
          },
          {
            label: t('glossary|Kind'),
            getter: portforward => {
              return !!portforward.service ? 'Service' : 'Pod';
            },
          },
          {
            label: t('translation|Pod Port'),
            getter: portforward => {
              return portforward.targetPort;
            },
          },
          {
            label: t('translation|Local Port'),
            getter: portforward => {
              return (
                <Box display={'flex'} alignItems="center">
                  <MuiLink
                    onClick={() => {
                      window.open(`http://localhost:${portforward.port}`, '_blank');
                    }}
                    className={
                      portforward.status === PORT_FORWARD_RUNNING_STATUS
                        ? classes.link
                        : classes.disabledLink
                    }
                  >
                    {portforward.port}
                    <InlineIcon icon={'mdi:open-in-new'} className={classes.linkIcon} />
                  </MuiLink>
                </Box>
              );
            },
          },
          {
            label: t('translation|Status'),
            getter: portforward => {
              return prepareStatusLabel(portforward);
            },
          },
          {
            label: t('translation|Actions'),
            getter: portforward => {
              const filteredOptions = options.filter(option => {
                if (portForwardInAction?.error) {
                  return option === PortForwardAction.Delete;
                }
                if (portForwardInAction?.status === PORT_FORWARD_RUNNING_STATUS) {
                  return option !== PortForwardAction.Start;
                } else if (portForwardInAction?.status === PORT_FORWARD_STOP_STATUS) {
                  return option !== PortForwardAction.Stop;
                }
              });
              return (
                <>
                  <IconButton
                    aria-label={t('translation|More')}
                    onClick={e => handleClick(e, portforward)}
                    size="medium"
                  >
                    <Icon icon={'mdi:dots-vertical'} />
                  </IconButton>
                  <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                    {filteredOptions.map(option => (
                      <MenuItem onClick={() => handleClose(option)}>
                        {optionsTranslated[option]}
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              );
            },
          },
        ]}
        data={portforwards.filter((pf: any) => pf.cluster === cluster)}
      />
    </SectionBox>
  );
}
