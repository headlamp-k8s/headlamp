import bellIcon from '@iconify/icons-mdi/bell';
import { Icon } from '@iconify/react';
import { Badge, Grid, IconButton, makeStyles, Theme, Tooltip, Typography } from '@material-ui/core';
import { Menu, MenuItem } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import Event, { KubeEvent } from '../../../lib/k8s/event';
import { Notification } from '../../../lib/notification';
import { createRouteURL } from '../../../lib/router';
import { setUINotifications, updateUINotification } from '../../../redux/actions/actions';
import { useTypedSelector } from '../../../redux/reducers/reducers';
import { DateLabel } from '../../common';

const useStyles = makeStyles((theme: Theme) => ({
  notificationItem: {
    '&.MuiMenuItem-root': {
      borderBottom: `1px solid ${theme.palette.notificationBorderColor}`,
      padding: '1rem',
    },
  },
  notificationMessage: {
    '&': {
      wordBreak: 'break-word',
      whiteSpace: 'normal',
    },
  },
  root: {
    '& .MuiPaper-root': {
      width: '30vw',
      minWidth: '300px',
      maxHeight: '70vh',
    },
  },
  errorItem: {
    '&': {
      color: theme.palette.error,
    },
  },
}));

function NotificationsList(props: {
  notifications: Notification[];
  clickEventHandler: (notification?: Notification, closeMenu?: boolean) => void;
}) {
  const { notifications, clickEventHandler } = props;
  const { t } = useTranslation();
  const classes = useStyles();
  const history = useHistory();
  if (!notifications || notifications.length === 0) {
    return (
      <MenuItem onClick={() => clickEventHandler()} className={classes.notificationItem} disabled>
        {t(`notifications|You don't have any notifications right now`)}
      </MenuItem>
    );
  }

  function notificationSeenUnseenHandler(event: any, notification?: Notification) {
    event.stopPropagation();
    if (!notification) {
      return;
    }
    notification.seen = true;
    clickEventHandler(notification);
  }

  function notificationItemClickHandler(notification: Notification) {
    notification.url && history.push(notification.url);
    notification.seen = true;
    clickEventHandler(notification, true);
  }

  function Row(props: ListChildComponentProps) {
    const { index, style } = props;
    const notification = notifications[index];
    return (
      <MenuItem
        key={`${notification}__${index}`}
        className={classes.notificationItem}
        style={style}
      >
        <Grid
          container
          justifyContent="space-between"
          spacing={1}
          onClick={() => notificationItemClickHandler(notification)}
        >
          <Grid item md={notification.seen ? 11 : 10}>
            <Tooltip title={`${t(`notifications|${notification.message}`)}`}>
              <Typography style={{ fontWeight: notification.seen ? 'normal' : 'bold' }} noWrap>
                {`${notification.message || t(`notifications|No message`)}`}
              </Typography>
            </Tooltip>
          </Grid>
          {!notification.seen && (
            <Grid item md={1}>
              <Badge
                variant="dot"
                color="error"
                onClick={e => notificationSeenUnseenHandler(e, notification)}
              ></Badge>
            </Grid>
          )}
          <Grid item md={12}>
            <DateLabel date={notification.date} />
          </Grid>
        </Grid>
      </MenuItem>
    );
  }

  return (
    <FixedSizeList
      itemCount={notifications?.length}
      height={400}
      itemData={notifications}
      width="100"
      itemSize={100}
    >
      {Row}
    </FixedSizeList>
  );
}

export default function Notifications() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const notifications = useTypedSelector(state => state.ui.notifications);
  const dispatch = useDispatch();
  const [events] = Event.useList();
  const { t } = useTranslation();

  useEffect(() => {
    if (events && events.length !== 0) {
      const importantEvents: Notification[] = events
        .filter((event: KubeEvent) => event.type !== 'Normal')
        .map((event: KubeEvent) => {
          const notificationIndexFromStore = notifications.findIndex(
            notification => notification.id === event.metadata.uid
          );
          if (notificationIndexFromStore !== -1) {
            return notifications[notificationIndexFromStore];
          }
          const message = event.message;
          const date = new Date(event.metadata.creationTimestamp).getTime();
          const notification = new Notification(message, date);
          notification.id = event.metadata.uid;
          notification.url = createRouteURL('cluster') + `?eventsFilter=${notification.id}`;
          return notification;
        });
      // we are here means the events list changed and we have now new set of events, so we will notify the store about it
      dispatch(setUINotifications(importantEvents));
    }
  }, [events]);

  function handleNotificationsWithStorage() {
    const notificationsInStorage = localStorage.getItem('notifications');
    if (notificationsInStorage) {
      const parsedNotifications = JSON.parse(notificationsInStorage);
      dispatch(setUINotifications(parsedNotifications));
    }
  }

  useEffect(() => {
    handleNotificationsWithStorage();
  }, []);

  useEffect(() => {
    handleNotificationsWithStorage();
  }, [notifications.length]);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function menuItemClickHandler(notification?: Notification, closeMenu?: boolean) {
    if (notification) {
      dispatch(updateUINotification(notification));
    }
    if (closeMenu) {
      setAnchorEl(null);
    }
  }
  const areThereUnseenNotifications =
    notifications.filter(notification => notification.seen !== true).length > 0;

  const notificationMenuId = 'notification-menu';

  return (
    <>
      <IconButton
        aria-label={t('notifications|Show notifications')}
        aria-controls={notificationMenuId}
        aria-haspopup="true"
        onClick={handleClick}
      >
        {areThereUnseenNotifications ? (
          <Badge variant="dot" color="error">
            <Tooltip title={`${t('notifications|You have unread notifications')}`}>
              <Icon icon={bellIcon} />
            </Tooltip>
          </Badge>
        ) : (
          <Icon icon={bellIcon} />
        )}
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        keepMounted={false}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        className={classes.root}
        getContentAnchorEl={null}
        PaperProps={{}}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        id={notificationMenuId}
      >
        <NotificationsList notifications={notifications} clickEventHandler={menuItemClickHandler} />
      </Menu>
    </>
  );
}
