import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItem, { ListItemProps } from '@mui/material/ListItem';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import React from 'react';
import { generatePath } from 'react-router';
import { createRouteURL, getRoute } from '../../lib/router';
import { getCluster, getClusterPrefixedPath } from '../../lib/util';
import ListItemLink from './ListItemLink';
import { SidebarEntry } from './sidebarSlice';

const useItemStyle = makeStyles(theme => ({
  link: {
    color: theme.palette.sidebarLink.color,
    borderRadius: '4px',
    marginRight: '5px',
    marginLeft: theme.spacing(5),
    marginBottom: '1px',

    '& *': {
      fontSize: '.875rem',
      textTransform: 'none',
    },
    '& .MuiListItem-root': {
      paddingTop: '4px',
      paddingBottom: '4px',
    },
    '& .MuiListItem-button:hover': {
      backgroundColor: 'unset',
    },
    '&:hover': {
      backgroundColor: theme.palette.sidebarLink.hover.backgroundColor,

      '& svg': {
        color: theme.palette.sidebarLink.hover.color,
      },
    },
    '& a.Mui-focusVisible': {
      backgroundColor: theme.palette.sidebarLink.hover.backgroundColor,
    },
    '& svg': {
      color: theme.palette.sidebarLink.color,
    },
    '& .MuiListItemIcon-root': {
      minWidth: 0,
      alignSelf: (props: { fullWidth: boolean; hasSubtitle: boolean }) =>
        props.fullWidth && props.hasSubtitle ? 'stretch' : 'auto',
      paddingTop: (props: { fullWidth: boolean; hasSubtitle: boolean }) =>
        props.fullWidth && props.hasSubtitle ? theme.spacing(1) : 0,
      marginRight: (props: { fullWidth: boolean }) => (props.fullWidth ? '8px' : '0'),
    },
    '& .MuiListItemText-secondary': {
      fontSize: '.85rem',
      fontStyle: 'italic',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflowWrap: 'anywhere',
      overflow: 'hidden',
      color: theme.palette.sidebarLink.color,
    },
  },
  linkMain: {
    textTransform: 'uppercase',
    color: theme.palette.sidebarLink.main.color,
    marginLeft: '5px',
    marginRight: '5px',
    borderRadius: '4px',

    '& .MuiListItem-root': {
      paddingTop: (props: { hasSubtitle: boolean }) => (props.hasSubtitle ? '0' : '7px'),
      paddingBottom: (props: { hasSubtitle: boolean }) => (props.hasSubtitle ? '0' : '7px'),
      paddingLeft: '19px',
      minHeight: (props: { fullWidth: boolean }) => (!props.fullWidth ? '56px' : 'unset'),
    },

    '& *': {
      fontSize: '1rem',
    },

    '&:hover, &:active': {
      color: theme.palette.sidebarLink.main.color,
      '& svg': {
        color: theme.palette.sidebarLink.main.color,
      },
    },
  },
  linkMainNoVerticalPadding: {
    '& .MuiListItem-root': {
      paddingTop: '0',
      paddingBottom: '0',
    },
  },
  linkMainSelected: {
    '& svg': {
      color: theme.palette.sidebarLink.main.selected.color,
    },
    '&:hover, &:active': {
      color: theme.palette.sidebarLink.main.selected.color,
      '& svg': {
        color: theme.palette.sidebarLink.main.selected.color,
      },
    },
    '&, & *': {
      color: theme.palette.sidebarLink.main.selected.color,
    },
    backgroundColor: `${theme.palette.sidebarLink.main.selected.backgroundColor}!important`,
    '& .MuiListItemText-secondary': {
      color: theme.palette.sidebarLink.main.selected.color,
    },
    '& a.Mui-focusVisible': {
      backgroundColor: theme.palette.sidebarLink.selected.backgroundColor,
    },
  },
  linkSelected: {
    fontWeight: 'bold',
    '& .Mui-selected': {
      background: theme.palette.sidebarLink.selected.backgroundColor,
      '& *': {
        fontWeight: 'bold',
        color: theme.palette.sidebarLink.selected.color,
      },
    },
  },
  nested: {
    '& .MuiListItem-root': {
      fontSize: '.875rem',
      paddingTop: '2px',
      paddingBottom: '2px',
    },
  },
  linkSmallWidth: {
    backgroundColor: 'inherit !important',
  },
  fullWidth: {
    width: '100%',
  },
  fullWidthList: {
    padding: 0,
  },
}));

/**
 * Adds onto SidebarEntryProps for the display of the sidebars.
 */
export interface SidebarItemProps extends ListItemProps, SidebarEntry {
  /** The route name which is selected. */
  selectedName?: string | null;
  /** The navigation is a child. */
  hasParent?: boolean;
  /** Displayed wide with icon and text, otherwise with just a small icon. */
  fullWidth?: boolean;
  /** Search part of the URL. */
  search?: string;
  /** If a menu item has sub menu items, they will be in here. */
  subList?: Omit<this, 'sidebar'>[];
  /** Whether to hide the sidebar item. */
  hide?: boolean;
}

export default function SidebarItem(props: SidebarItemProps) {
  const {
    label,
    name,
    subtitle,
    url = null,
    search,
    useClusterURL = false,
    subList = [],
    selectedName,
    hasParent = false,
    icon,
    fullWidth = true,
    hide,
    ...other
  } = props;
  const classes = useItemStyle({ fullWidth, hasSubtitle: !!subtitle });
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

  const isSelected = React.useMemo(() => {
    if (name === selectedName) {
      return true;
    }

    let subListToCheck = [...subList];
    for (let i = 0; i < subListToCheck.length; i++) {
      const subItem = subListToCheck[i];
      if (subItem.name === selectedName) {
        return true;
      }

      if (!!subItem.subList) {
        subListToCheck = subListToCheck.concat(subItem.subList);
      }
    }
    return false;
  }, [subList, name, selectedName]);

  function shouldExpand() {
    return isSelected || !!subList.find(item => item.name === selectedName);
  }

  const expanded = subList.length > 0 && shouldExpand();
  const listItemClasses = [classes.link];
  if (!hasParent) {
    listItemClasses.push(classes.linkMain);
    if (isSelected) {
      listItemClasses.push(classes.linkMainSelected);
    }
  } else {
    if (isSelected) {
      listItemClasses.push(classes.linkSelected);
    }
  }

  return hide ? null : (
    <React.Fragment>
      <ListItemLink
        selected={isSelected}
        pathname={fullURL || ''}
        primary={fullWidth ? label : ''}
        containerProps={{
          className: clsx(...listItemClasses),
        }}
        icon={icon}
        name={label}
        subtitle={subtitle}
        search={search}
        iconOnly={!fullWidth}
        {...other}
      />
      {subList.length > 0 && (
        <ListItem className={classes.fullWidthList}>
          <Collapse in={fullWidth && expanded} className={classes.fullWidth}>
            <List component="ul" disablePadding className={classes.nested}>
              {subList.map((item: SidebarItemProps) => (
                <SidebarItem
                  key={item.name}
                  selectedName={selectedName}
                  hasParent
                  search={search}
                  {...item}
                />
              ))}
            </List>
          </Collapse>
        </ListItem>
      )}
    </React.Fragment>
  );
}
