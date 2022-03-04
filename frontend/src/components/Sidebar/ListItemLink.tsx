import { Icon, IconProps } from '@iconify/react';
import { Tooltip } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';

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
  icon?: IconProps['icon'];
}

export default function ListItemLink(props: ListItemLinkProps) {
  const { primary, pathname, search, icon, name, ...other } = props;

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
      <ListItemIcon>
        <Icon icon={icon} width={30} height={30} />
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
    <li>
      <ListItem button component={renderLink} {...other}>
        {listItemLinkContainer}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
}
