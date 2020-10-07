import calendarIcon from '@iconify/icons-mdi/calendar';
import informationOutline from '@iconify/icons-mdi/information-outline';
import { Icon } from '@iconify/react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { localeDate, timeAgo } from '../../lib/util';
import { LightTooltip, TooltipIcon } from './Tooltip';

const useStyles = makeStyles(theme => ({
  nameLabel: {
    color: theme.palette.text.secondary,
    fontSize: '1.1em',
    textAlign: 'right'
  },
  nameLabelItem: {
    textAlign: 'right',
    flex: '0 0 200px'
  },
  valueLabel: {
    color: theme.palette.text.primary,
    fontSize: '1.1em',
    wordBreak: 'break-word'
  },
  statusLabel: {
    color: theme.palette.primary.contrastText,
    fontSize: '1.1em',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(.5),
    paddingBottom: theme.spacing(.5),
    display: 'inline-block',
    textAlign: 'center',
  },
}));

interface InfoLabelProps {
  name: string;
  value?: string | null;
}

export function InfoLabel(props: React.PropsWithChildren<InfoLabelProps>) {
  const classes = useStyles();
  const {name, value = null} = props;

  return (
    <Grid
      container
      item
      spacing={2}
      justify="flex-start"
      alignItems="flex-start"
    >
      <Grid item xs className={classes.nameLabelItem}>
        <NameLabel>{name}</NameLabel>{' '}
      </Grid>
      <Grid item xs>
        {value !== null ?
          <ValueLabel>{value}</ValueLabel>
          :
          props.children
        }
      </Grid>
    </Grid>
  );
}

export function NameLabel(props: React.PropsWithChildren<{}>) {
  const classes = useStyles();
  return (
    <Typography className={classes.nameLabel} component="span">{props.children}</Typography>
  );
}

export function ValueLabel(props: React.PropsWithChildren<{}>) {
  const classes = useStyles();
  return (
    <Typography className={classes.valueLabel} component="span">{props.children}</Typography>
  );
}

export interface StatusLabelProps {
  status: 'success' | 'warning' | 'error' | '';
  [otherProps: string]: any;
}

export function StatusLabel(props: StatusLabelProps) {
  const { status, className = '', ...other } = props;
  const classes = useStyles();
  const theme = useTheme();

  const statuses = ['success', 'warning', 'error'];

  // Assign to a status color if it exists.
  const bgColor =
    statuses.includes(status) ? theme.palette[status].light : theme.palette.normalEventBg;
  const color = statuses.includes(status) ? theme.palette[status].main : theme.palette.text.primary;

  return (
    <Typography
      className={classes.statusLabel + ' ' + className}
      style={{
        backgroundColor: bgColor,
        color,
      }}
      component="span"
      {...other}
    />
  );
}

export function makeStatusLabel(label: string, successStatusName: string) {
  return (
    <StatusLabel status={label === successStatusName ? 'success' : 'error'} >
      {label}
    </StatusLabel>
  );
}

const useHeaderLabelStyles = makeStyles(theme => ({
  value: {
    fontSize: '3rem;'
  },
  label: {
    textAlign: 'center',
    fontSize: '1.2em',
    flexGrow: 1,
    fontWeight: 'bold',
  },
}));

interface HeaderLabelProps {
  label: string;
  value: string;
  tooltip?: string | null;
}

export function HeaderLabel(props: HeaderLabelProps) {
  const classes = useHeaderLabelStyles();
  const { value, label, tooltip } = props;

  return (
    <Grid
      container
      alignItems="center"
      direction="column"
    >
      <Grid item>
        <Typography className={classes.label} display="inline">{label}</Typography>
        {!!tooltip &&
          <TooltipIcon>{tooltip}</TooltipIcon>
        }
      </Grid>
      <Grid
        item
        container
        alignItems="center"
        justify="center"
      >
        <Grid item>
          <Typography className={classes.value}>{value}</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}

interface HoverInfoLabelProps {
  label: string;
  hoverInfo: string | JSX.Element | undefined;
  icon?: any;
}

export function HoverInfoLabel(props: HoverInfoLabelProps) {
  const { label, hoverInfo, icon = null } = props;

  return (
    <Grid
      container
      spacing={1}
    >
      <Grid item>
        {label}
      </Grid>
      <Grid item>
        <LightTooltip title={hoverInfo}>
          <Box>
            <Icon icon={icon || informationOutline} width="1rem" height="1rem"/>
          </Box>
        </LightTooltip>
      </Grid>
    </Grid>
  );
}

interface DateLabelProps {
  date: number | string | Date;
}

export function DateLabel(props: DateLabelProps) {
  const { date } = props;
  return (
    <HoverInfoLabel
      label={timeAgo(date)}
      hoverInfo={localeDate(date)}
      icon={calendarIcon}
    />
  );
}
