import { IconProps } from '@iconify/react';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem, { ListItemProps } from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React from 'react';
import { generatePath } from 'react-router';
import { createRouteURL, getRoute } from '../../lib/router';
import { getCluster, getClusterPrefixedPath } from '../../lib/util';
import ListItemLink from './ListItemLink';
import { DefaultSidebars } from './Sidebar';

const useItemStyle = makeStyles(theme => ({
  link: {
    color: theme.palette.sidebarLink.color,
    borderRadius: '4px',
    marginRight: '5px',
    marginLeft: theme.spacing(4),
    marginBottom: '1px',

    '& *': {
      fontSize: '.875rem',
      backgroundColor: 'unset',
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
    '& svg': {
      color: theme.palette.sidebarLink.color,
    },
    '& .MuiListItemIcon-root': {
      minWidth: 0,
      marginRight: (props: { fullWidth: boolean }) => (props.fullWidth ? '8px' : '0'),
    },
  },
  linkMain: {
    textTransform: 'uppercase',
    color: theme.palette.sidebarLink.main.color,
    marginLeft: '5px',
    marginRight: '5px',
    borderRadius: '4px',

    '& .MuiListItem-root': {
      paddingTop: '7px',
      paddingBottom: '7px',
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
    color: theme.palette.sidebarLink.main.selected.color,
    backgroundColor: `${theme.palette.sidebarLink.main.selected.backgroundColor}!important`,
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
 * Represents an entry in the sidebar menu.
 */
export interface SidebarEntryProps {
  /**
   * Name of this SidebarItem.
   */
  name: string;
  /**
   * Label to display.
   */
  label: string;
  /**
   * Name of the parent SidebarEntry.
   */
  parent?: string | null;
  /**
   * URL to go to when this item is followed.
   */
  url?: string;
  /**
   * Should URL have the cluster prefix? (default=true)
   */
  useClusterURL?: boolean;
  /**
   * An iconify string or icon object that will be used for the sidebar's icon
   *
   * @see https://icon-sets.iconify.design/mdi/ for icons.
   */
  icon?: IconProps['icon'];
  /** The sidebar to display this item in. If not specified, it will be displayed in the default sidebar.
   */
  sidebar?: DefaultSidebars | string;
}

/**
 * Adds onto SidebarEntryProps for the display of the sidebars.
 */
export interface SidebarItemProps extends ListItemProps, SidebarEntryProps {
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
  }

  function shouldExpand() {
    return isSelected() || !!subList.find(item => item.name === selectedName);
  }

  const expanded = subList.length > 0 && shouldExpand();
  const listItemClasses = [classes.link];
  if (!hasParent) {
    listItemClasses.push(classes.linkMain);
    if (isSelected()) {
      listItemClasses.push(classes.linkMainSelected);
    }
  } else {
    if (isSelected()) {
      listItemClasses.push(classes.linkSelected);
    }
  }

  return hide ? null : (
    <React.Fragment>
      <ListItemLink
        selected={isSelected()}
        pathname={fullURL || ''}
        primary={fullWidth ? label : ''}
        containerProps={{
          className: clsx(...listItemClasses),
        }}
        icon={icon}
        name={label}
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
