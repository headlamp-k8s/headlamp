import eyeIcon from '@iconify/icons-mdi/eye';
import eyeOff from '@iconify/icons-mdi/eye-off';
import menuDown from '@iconify/icons-mdi/menu-down';
import menuUp from '@iconify/icons-mdi/menu-up';
import { Icon } from '@iconify/react';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { localeDate } from '../../lib/util';
import Loader from '../common/Loader';
import { SectionBox } from '../common/SectionBox';
import SectionHeader from '../common/SectionHeader';
import SimpleTable, { NameValueTable } from '../common/SimpleTable';
import { DateLabel, HoverInfoLabel, StatusLabel } from './Label';
import Link from './Link';
import { LightTooltip } from './Tooltip';

const useStyles = makeStyles(theme => ({
  metadataValueLabel: {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.grey[400],
    fontSize: '1.1em',
    wordBreak: "break-word",
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    borderRadius: '2px',
  },
}));

export function MetadataDisplay(props) {
  let { resource } = props;

  let mainRows = [
    {
      name: 'Name',
      valueComponent:
        <Typography variant="h6" >
          {resource.metadata.name}
        </Typography>,
    },
    {
      name: 'Namespace',
      value: resource.metadata.namespace,
      hide: !resource.metadata.namespace
    },
    {
      name: 'Creation',
      value: localeDate(resource.metadata.creationTimestamp),
    },
    {
      name: 'Version',
      value: resource.metadata.resourceVersion,
    },
    {
      name: 'UID',
      value: resource.metadata.uid,
    },
    {
      name: 'Labels',
      valueComponent: <MetadataDictGrid dict={resource.metadata.labels} />,
      hide: !resource.metadata.labels,
    },
    {
      name: 'Annotations',
      valueComponent: <MetadataDictGrid dict={resource.metadata.annotations} />,
      hide: !resource.metadata.annotations,
    },
  ];

  return (
    <NameValueTable rows={mainRows}/>
  );
}

export function MetadataDictGrid(props) {
  const classes = useStyles();
  const { dict } = props;
  const [expanded, setExpanded] = React.useState(false);

  if (!dict) {
    return null;
  }

  const keys = Object.keys(dict);

  const MetadataEntry = React.forwardRef((props, ref) => {
    return (
      <Typography
        noWrap
        {...props}
        className={classes.metadataValueLabel}
        ref={ref}
      />
    );
  });

  function makeLabel(key) {
    const fullText = key + ': ' + dict[key] + '';
    let shortText = fullText;

    // Shorten the label manually because relying on the ellipsing methods
    // was not working (it would correctly ellipse the text, but the width of it
    // would still extend the area/section where the text is contained).
    if (fullText.length > 50) {
      shortText = fullText.substr(0, 50) + '…';
    }

    let labelComponent = <MetadataEntry>{shortText}</MetadataEntry>;

    // If the full label is not being shown, use a tooltip to show the full text
    // to the user (so they select it, etc.).
    if (fullText.length !== shortText.length) {
      labelComponent = (
        <LightTooltip
          title={fullText}
          children={labelComponent}
          interactive
        />
      );
    }
    return labelComponent;
  }

  return (
    <Grid
      container
      spacing={1}
      justify="flex-start"
    >
      {keys.length > 2 &&
        <Grid item>
          <IconButton onClick={() => setExpanded(!expanded)} size="small">
            <Icon icon={expanded ? menuUp : menuDown} />
          </IconButton>
        </Grid>
      }
      <Grid
        container
        item
        justify="flex-start"
        spacing={1}
        style={{
          maxWidth: "80%"
        }}
      >
        {/* Limit the size to two entries until the user chooses to expand the whole section */}
        {keys.slice(0, expanded ? keys.length : 2).map((key, i) =>
          <Grid key={i} item zeroMinWidth>
            {makeLabel(key)}
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}

export function ResourceLink(props) {
  let {
    routeName=props.resource.kind,
    routeParams=props.resource.metadata,
    name=props.resource.metadata.name,
  } = props;

  return (
    <Link
      routeName={routeName}
      params={routeParams}
    >
      {name}
    </Link>
  );
}

const useStyle = makeStyles(theme => ({
  tinyDivider: {
    margin: theme.spacing(1),
    display: 'none',
    [theme.breakpoints.down('md')]: {
      display: 'block'
    }
  },
  name: {
    marginBottom: theme.spacing(1),
  }
}));

export function MainInfoSection(props) {
  let { resource, headerSection, title, extraInfo=[] } = props;

  return (
    <Paper>
      <SectionHeader
        title={title || (resource ? resource.kind : '')}
      />
      <SectionBox>
        {resource === null ?
          <Loader />
        :
          <React.Fragment>
            {headerSection}
            <SectionGrid
              useDivider
              items={[
                <MetadataDisplay resource={resource} />,
                <NameValueTable
                  rows={extraInfo}
                />
              ]}
            />
          </React.Fragment>
        }
      </SectionBox>
    </Paper>
  );
}

export function PageGrid(props) {
  const { sections=[], children=[], ...other } = props;
  const childrenArray = React.Children.toArray(children).concat(sections);
  return (
    <Grid
      container
      spacing={1}
      justify="flex-start"
      alignItems="stretch"
      {...other}
    >
      {childrenArray.map((section, i) =>
        <Grid item key={i} xs={12}>
          {section}
        </Grid>
      )}
    </Grid>
  );
}

export function SectionGrid(props) {
  const classes = useStyle();
  const { items, useDivider=false } = props;
  return (
    <Grid
      container
      justify="space-between"
    >
      {items.map((item, i) => {
        return (
          <React.Fragment key={i}>
            <Grid
              item
              lg
              md={12}
              xs={12}
            >
              {item}
            </Grid>
            {/* Only use a divider if required and this item is not the last one */}
            {useDivider && (items.length - 1) != i &&
              <Grid
                item
                md={12}
                xs={12}
                className={classes.tinyDivider}
              >
                <Divider />
              </Grid>
            }
          </React.Fragment>
        );
      })}
    </Grid>
  );
}

export function DataField(props) {
  const { label, value, ...other } = props;
  return (
    <TextField
      label={label}
      InputProps={{
        readOnly: true,
        paddingLeft: '30px'
      }}
      InputLabelProps={{
        shrink: true,
        style: {fontSize: '1.3rem'}
      }}
      variant="outlined"
      fullWidth
      shrink
      multiline
      rowsMax="20"
      value={value}
      {...other}
    />
  );
}

export function SecretField(props) {
  const { label, value, ...other } = props;
  const [showPassword, setShowPassword] = React.useState(false);

  function handleClickShowPassword() {
    setShowPassword(!showPassword);
  }

  function handleMouseDownPassword(event) {
    event.preventDefault();
  }

  return (
    <Grid
      container
      alignItems="stretch"
      spacing={2}
    >
      <Grid item>
        <IconButton
          edge="end"
          aria-label="toggle field visibility"
          onClick={handleClickShowPassword}
          onMouseDown={handleMouseDownPassword}
        >
          <Icon icon={showPassword ? eyeOff : eyeIcon} />
        </IconButton>
      </Grid>
      <Grid item xs>
        <Input
          readOnly
          paddingLeft="30px"
          type="password"
          fullWidth
          multiline={showPassword}
          rowsMax="20"
          value={showPassword ? value : '******'}
          {...other}
        />
      </Grid>
    </Grid>
  );
}

export function ConditionsTable(props) {
  const { resource } = props;

  function makeStatusLabel(condition) {
    let status = '';
    if (condition.type == 'Available') {
      status = condition.status == 'True' ? 'success' : 'error';
    }

    return (
      <StatusLabel
        status={status}
      >
        {condition.type}
      </StatusLabel>
    );
  }

  return (
    <SimpleTable
      data={resource && resource.status.conditions}
      columns={[
        {
          label: 'Condition',
          getter: makeStatusLabel
        },
        {
          label: 'Status',
          getter: condition => condition.status,
        },
        {
          label: 'Last Transition',
          getter: condition => <DateLabel date={condition.lastTransitionTime} />,
        },
        {
          label: 'Last Update',
          getter: condition => <DateLabel date={condition.lastUpdateTime} />,
        },
        {
          label: 'Reason',
          getter: condition =>
            <HoverInfoLabel
              label={condition.reason}
              hoverInfo={condition.message}
            />
          ,
        }
      ]}
    />
  );
}