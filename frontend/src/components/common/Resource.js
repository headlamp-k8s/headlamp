import menuDown from '@iconify/icons-mdi/menu-down';
import menuUp from '@iconify/icons-mdi/menu-up';
import { Icon } from '@iconify/react';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { localeDate } from '../../lib/util';
import Loader from '../common/Loader';
import { SectionBox } from '../common/SectionBox';
import SectionHeader from '../common/SectionHeader';
import { NameValueTable } from '../common/SimpleTable';
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
  let { resource, noName=true } = props;

  let mainRows = [
    {
      name: 'Name',
      value: resource.metadata.name,
      hide: noName,
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

function MetadataDictGrid(props) {
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
  const classes = useStyle();
  let { resource, title, mainInfo=[] } = props;

  return (
    <Paper>
      <SectionHeader
        title={title || (resource ? resource.kind : '')}
      />
      <SectionBox>
        {resource === null ?
          <Loader />
        :
          <Box px={1}>
            <Grid
              container
              justify="space-between"
            >
              <Grid
                item
                lg
                md={12}
                xs={12}
              >
                <NameValueTable
                  rows={[
                    {
                      name: 'Name',
                      valueComponent:
                        <Typography variant="h6" >
                          {resource.metadata.name}
                        </Typography>
                    },
                    ...mainInfo
                  ]}
                />
              </Grid>
              <Grid
                item
                md={12}
                xs={12}
                className={classes.tinyDivider}
              >
                <Divider />
              </Grid>
              <Grid
                item
                lg
                md={12}
                xs={12}
              >
                <MetadataDisplay resource={resource} />
              </Grid>
            </Grid>
          </Box>
        }
      </SectionBox>
    </Paper>
  );
}
