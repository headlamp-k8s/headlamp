import informationOutline from '@iconify/icons-mdi/information-outline';
import { Icon } from '@iconify/react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { LightTooltip } from './Tooltip';

const useStyles = makeStyles(theme => ({
  nameLabel: {
    color: theme.palette.text.secondary,
    fontSize: '1.1em',
    textAlign: "right"
  },
  nameLabelItem: {
    textAlign: "right",
    flex: "0 0 200px"
  },
  valueLabel: {
    color: theme.palette.text.primary,
    fontSize: '1.1em',
    wordBreak: "break-word"
  },
  statusLabel: {
    color: theme.palette.primary.contrastText,
    fontSize: '1.1em',
    wordBreak: "break-word",
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(.5),
    paddingBottom: theme.spacing(.5),
    borderRadius: '5%',
  },
}));

export function InfoLabel(props) {
  const classes = useStyles();
  let {name, value=null} = props;

  return (
    <Grid
      container
      item
      spacing={2}
      justify="flex-start"
      alignItems="flex-start"
    >
      <Grid item xs className={classes.nameLabelItem}>
        <NameLabel>{name}</NameLabel>{" "}
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

export function NameLabel(props) {
  const classes = useStyles();
  return (
    <Typography className={classes.nameLabel} component="span">{props.children}</Typography>
  );
}

export function ValueLabel(props) {
  const classes = useStyles();
  return (
    <Typography className={classes.valueLabel} component="span">{props.children}</Typography>
  );
}

export function StatusLabel(props) {
  const { status, ...other } = props;
  const classes = useStyles();
  const theme = useTheme();

  return (
    <Typography
      className={classes.statusLabel}
      style={{
        backgroundColor: theme.palette[status].main,
      }}
      component="span"
      {...other}
    />
  );
}

export function makeStatusLabel(label, successStatusName) {
  return (
    <StatusLabel status={label == successStatusName ? 'success' : 'error'} >
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

export function HeaderLabel(props) {
  const classes = useHeaderLabelStyles();
  const { value, label } = props;

  return (
    <Grid
      container
      alignItems="center"
      direction="column"
    >
      <Grid item>
        <Typography className={classes.label}>{label}</Typography>
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

export function HoverInfoLabel(props) {
  const { label, hoverInfo, icon=null } = props;

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