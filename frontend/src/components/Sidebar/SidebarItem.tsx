import { IconProps } from '@iconify/react';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem, { ListItemProps } from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { generatePath } from 'react-router';
import { createRouteURL, getRoute } from '../../lib/router';
import { getCluster, getClusterPrefixedPath } from '../../lib/util';
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
  subList?: this[];
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

  function handleSpecificClickForBackSidebarOption() {
    if (name === 'back') {
      // todo: Handle the case when there is no history present
      window.history.back();
    }
  }
  return (
    <React.Fragment>
      <ListItemLink
        selected={isSelected()}
        pathname={fullURL || ''}
        primary={fullWidth ? label : ''}
        classes={{
          selected: classes.linkSelected,
        }}
        className={linkClass}
        icon={icon}
        name={label}
        search={search}
        onClick={handleSpecificClickForBackSidebarOption}
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
