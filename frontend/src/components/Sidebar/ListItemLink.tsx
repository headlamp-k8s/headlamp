import { Icon } from '@iconify/react';
import { Tooltip } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import React from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps, useLocation } from 'react-router-dom';
import { useTypedSelector } from '../../redux/reducers/reducers';

const IconTooltip = withStyles(theme => ({
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
  to: string;
  name: string;
  icon?: object;
}

export default function ListItemLink(props: ListItemLinkProps) {
  const { primary, to, icon, name, ...other } = props;
  const namespaces = useTypedSelector(state => state.filter.namespaces);
  const namespaceURLString = namespaces.size !== 0 ? `?namespace=${[...namespaces].join('+')}` : '';

  const renderLink = React.useMemo(
    () =>
      React.forwardRef<any, Omit<RouterLinkProps, 'to'>>((itemProps, ref) => (
        <RouterLink to={{ pathname: to, search: namespaceURLString }} ref={ref} {...itemProps} />
      )),
    [to, namespaceURLString]
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
