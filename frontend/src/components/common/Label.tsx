import { Icon, IconProps } from '@iconify/react';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import Typography, { TypographyProps } from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import React from 'react';
import { DateFormatOptions, localeDate, timeAgo } from '../../lib/util';
import { LightTooltip, TooltipIcon } from './Tooltip';

const useStyles = makeStyles(theme => ({
  nameLabel: {
    color: theme.palette.text.secondary,
    fontSize: theme.typography.pxToRem(16),
    textAlign: 'right',
  },
  nameLabelItem: {
    textAlign: 'right',
    flex: '0 0 200px',
  },
  valueLabel: {
    color: theme.palette.text.primary,
    fontSize: theme.typography.pxToRem(16),
    wordBreak: 'break-word',
  },
  statusLabel: {
    color: theme.palette.primary.contrastText,
    fontSize: theme.typography.pxToRem(14),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    display: 'inline-block',
    textAlign: 'center',
    alignItems: 'center',
  },
}));

export interface InfoLabelProps {
  name: string;
  value?: string | null;
}

export function InfoLabel(props: React.PropsWithChildren<InfoLabelProps>) {
  const classes = useStyles();
  const { name, value = null } = props;

  return (
    <Grid container item spacing={2} justifyContent="flex-start" alignItems="flex-start">
      <Grid item xs className={classes.nameLabelItem}>
        <NameLabel>{name}</NameLabel>{' '}
      </Grid>
      <Grid item xs>
        {value !== null ? <ValueLabel>{value}</ValueLabel> : props.children}
      </Grid>
    </Grid>
  );
}

export function NameLabel(props: React.PropsWithChildren<{}>) {
  const classes = useStyles();
  return (
    <Typography className={classes.nameLabel} component="span">
      {props.children}
    </Typography>
  );
}

export function ValueLabel(props: React.PropsWithChildren<{}>) {
  const classes = useStyles();
  return (
    <Typography className={classes.valueLabel} component="span">
      {props.children}
    </Typography>
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
  const bgColor = statuses.includes(status)
    ? theme.palette[status].light
    : theme.palette.normalEventBg;
  const color = statuses.includes(status) ? theme.palette[status].main : theme.palette.text.primary;

  return (
    <Typography
      className={clsx(classes.statusLabel, className)}
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
    <StatusLabel status={label === successStatusName ? 'success' : 'error'}>{label}</StatusLabel>
  );
}

const useHeaderLabelStyles = makeStyles(() => ({
  value: {
    fontSize: '3rem;',
  },
  label: {
    textAlign: 'center',
    fontSize: '1.2em',
    flexGrow: 1,
    fontWeight: 'bold',
  },
}));

export interface HeaderLabelProps {
  label: string;
  value: string;
  tooltip?: string | null;
}

export function HeaderLabel(props: HeaderLabelProps) {
  const classes = useHeaderLabelStyles();
  const { value, label, tooltip } = props;

  return (
    <Grid container alignItems="center" direction="column">
      <Grid item>
        <Typography className={classes.label} display="inline">
          {label}
        </Typography>
        {!!tooltip && <TooltipIcon>{tooltip}</TooltipIcon>}
      </Grid>
      <Grid item container alignItems="center" justifyContent="center">
        <Grid item>
          <Typography className={classes.value}>{value}</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}

export interface HoverInfoLabelProps {
  label: React.ReactNode;
  hoverInfo?: React.ReactNode;
  labelProps?: TypographyProps;
  icon?: IconProps['icon'];
  iconProps?: Omit<IconProps, 'icon'>;
  iconPosition?: 'start' | 'end';
}

const useHoverInfoLabelStyles = makeStyles({
  display: {
    display: 'inline-flex',
  },
  noWrap: {
    whiteSpace: 'nowrap',
  },
  icon: {
    marginRight: '0.2rem',
    marginLeft: '0.2rem',
    alignSelf: 'center',
  },
});

export function HoverInfoLabel(props: HoverInfoLabelProps) {
  const { label, hoverInfo, icon = null, iconProps = {}, labelProps, iconPosition = 'end' } = props;
  const classes = useHoverInfoLabelStyles();
  const labelFirst = iconPosition === 'end';

  return (
    <LightTooltip title={hoverInfo || ''}>
      <Typography className={clsx(classes.noWrap, classes.display)} {...labelProps}>
        {labelFirst && label}
        {hoverInfo && (
          <Icon
            icon={icon || 'mdi:information-outline'}
            width="1rem"
            height="1rem"
            className={classes.icon}
            {...iconProps}
          />
        )}
        {!labelFirst && label}
      </Typography>
    </LightTooltip>
  );
}

export interface DateLabelProps {
  date: number | string | Date;
  format?: DateFormatOptions;
  iconProps?: Omit<IconProps, 'icon'>;
}

export function DateLabel(props: DateLabelProps) {
  const { date, format = 'brief', iconProps = {} } = props;
  return (
    <HoverInfoLabel
      label={timeAgo(date, { format })}
      hoverInfo={localeDate(date)}
      icon="mdi:calendar"
      iconProps={iconProps}
    />
  );
}
