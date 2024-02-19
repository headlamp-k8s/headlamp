import { Icon, IconProps } from '@iconify/react';
import { Tooltip } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import withStyles from '@mui/styles/withStyles';
import React from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';

const ExpandedIconSize = 20;
const CollapsedIconSize = 24;

const IconTooltip = withStyles(() => ({
  tooltip: {
    backgroundColor: '#474747',
    color: '#fff',
    minWidth: 60,
    padding: '0.5rem',
    fontSize: '0.8rem',
    border: '1px solid #474747',
    marginLeft: '1rem',
  },
}))(Tooltip);

interface ListItemLinkProps {
  primary: string;
  pathname: string;
  search?: string;
  name: string;
  subtitle?: string;
  icon?: IconProps['icon'];
  iconOnly?: boolean;
  containerProps?: {
    [prop: string]: any;
  };
}

export default function ListItemLink(props: ListItemLinkProps) {
  const { primary, pathname, search, icon, name, containerProps, iconOnly, subtitle, ...other } =
    props;

  const iconSize = React.useMemo(
    () => (iconOnly ? CollapsedIconSize : ExpandedIconSize),
    [iconOnly]
  );

  const renderLink = React.useMemo(
    () =>
      React.forwardRef<any, Omit<RouterLinkProps, 'to'>>((itemProps, ref) => (
        <RouterLink to={{ pathname: pathname, search: search }} ref={ref} {...itemProps} />
      )),
    [pathname, search]
  );
  let listItemLink = null;

  if (icon) {
    listItemLink = (
      <ListItemIcon sx={{ minWidth: '24px' }}>
        <Icon icon={icon} width={iconSize} height={iconSize} />
      </ListItemIcon>
    );
  }

  let listItemLinkContainer = listItemLink;
  if (!primary) {
    listItemLinkContainer = listItemLink && (
      <IconTooltip title={name} placement="right-start">
        {listItemLink}
      </IconTooltip>
    );
  }

  return (
    <li {...containerProps}>
      <ListItem button component={renderLink} {...other}>
        {listItemLinkContainer}
        {!iconOnly && <ListItemText primary={primary} secondary={subtitle} />}
      </ListItem>
    </li>
  );
}
