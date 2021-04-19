import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem, { ListItemProps } from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { generatePath, useHistory } from 'react-router';
import { createRouteURL, getRoute } from '../../lib/router';
import { getCluster, getClusterPrefixedPath } from '../../lib/util';
import { SidebarEntry } from '../../redux/reducers/ui';
import ListItemLink from './ListItemLink';

const useItemStyle = makeStyles(theme => ({
  nested: {
    '& .MuiListItem-root': {
      paddingLeft: theme.spacing(9),
    },
  },
  linkMain: {
    textTransform: 'uppercase',
  },
  link: {
    color: theme.palette.sidebarLink.main,
    '&:hover': {
      color: theme.palette.primary.contrastText,
      backgroundColor: `${theme.palette.sidebarLink.selectedBg}!important`,
    },
    '& svg': {
      color: theme.palette.sidebarLink.main,
    },
    '& *': {
      fontSize: '1.2rem',
    },
    '& .MuiListItemIcon-root': {
      minWidth: 0,
      marginRight: '12px',
    },
    paddingLeft: '23px',
  },
  linkSelected: {
    color: theme.palette.primary.contrastText,
    // For some reason we need to use important as even though we override the
    // "selected" class, it uses the default one first.
    backgroundColor: `${theme.palette.sidebarLink.selectedBg}!important`,
    '& *': {
      fontWeight: 'bold',
    },
  },
  linkActive: {
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.sidebarLink.selectedBg,
      svg: {
        color: theme.palette.primary.contrastText,
      },
    },
    '& svg': {
      color: theme.palette.primary.contrastText,
    },
    '& *': {
      fontSize: '1.2rem',
    },
  },
  linkSmallWidth: {
    backgroundColor: 'inherit !important',
  },
}));

interface SidebarItemProps extends ListItemProps, SidebarEntry {
  selectedName?: string | null;
  hasParent?: boolean;
  fullWidth?: boolean;
}

export default function SidebarItem(props: SidebarItemProps) {
  const {
    label,
    name,
    url = null,
    useClusterURL = false,
    subList = [],
    selectedName,
    hasParent = false,
    icon,
    fullWidth = true,
    ...other
  } = props;

  const classes = useItemStyle({ fullWidth });

  let fullURL = url;
  if (fullURL && useClusterURL && getCluster()) {
    fullURL = generatePath(getClusterPrefixedPath(url), { cluster: getCluster()! });
  }

  if (!fullURL) {
    let routeName = name;
    if (!getRoute(name)) {
      routeName = subList.length > 0 ? subList[0].name : '';
    }
    fullURL = createRouteURL(routeName);
  }

  function isSelected() {
    return name === selectedName;
  }

  function shouldExpand() {
    return isSelected() || !!subList.find(item => item.name === selectedName);
  }

  const expanded = subList.length > 0 && shouldExpand();
  let linkClass = classes.link;
  if (hasParent || expanded) {
    linkClass += ' ' + classes.linkActive;
  }
  if (!hasParent) {
    linkClass += ' ' + classes.linkMain;
  }
  if (!fullWidth) {
    linkClass += ' ' + classes.linkSmallWidth;
  }

  return (
    <React.Fragment>
      <ListItemLink
        selected={isSelected()}
        to={fullURL || ''}
        primary={fullWidth ? label : ''}
        classes={{
          selected: classes.linkSelected,
        }}
        className={linkClass}
        icon={icon}
        name={label}
        {...other}
      />
      {subList.length > 0 && (
        <Collapse in={fullWidth && expanded}>
          <List component="div" disablePadding className={classes.nested}>
            {subList.map((item, i) => (
              <SidebarItem key={i} selectedName={selectedName} hasParent {...item} />
            ))}
          </List>
        </Collapse>
      )}
    </React.Fragment>
  );
}
