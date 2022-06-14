import bellIcon from '@iconify/icons-mdi/bell';
import { Icon } from '@iconify/react';
import {
  Badge,
  Box,
  Button,
  Grid,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  Theme,
  Tooltip,
  Typography,
  useTheme,
} from '@material-ui/core';
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
import Empty from '../../common/EmptyContent';

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
    return <Empty>{t(`notifications|You don't have any notifications right now`)}</Empty>;
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

    if (notification.deleted) {
      return null;
    }

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
  const theme = useTheme();

  useEffect(() => {
    let notificationsToShow: Notification[] = [];
    let currentNotifications = notifications;
    let changed = false;

    if (currentNotifications.length === 0) {
      currentNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      changed = currentNotifications.length > 0;
    }

    if (events && events.length !== 0) {
      const eventIds = new Set<string>();
      notificationsToShow = events
        .filter((event: KubeEvent) => event.type !== 'Normal')
        .map((event: KubeEvent) => {
          const notificationIndexFromStore = currentNotifications.findIndex(
            notification => notification.id === event.metadata.uid
          );
          if (notificationIndexFromStore !== -1) {
            return currentNotifications[notificationIndexFromStore];
          }

          eventIds.add(event.metadata.uid);

          const message = event.message;
          const date = new Date(event.metadata.creationTimestamp).getTime();
          const notification = new Notification(message, date);
          notification.id = event.metadata.uid;
          notification.url = createRouteURL('cluster') + `?eventsFilter=${notification.id}`;

          changed = true;

          return notification;
        });

      // Ensure that notifications which are not part of this stream of events are still shown
      currentNotifications.forEach(notification => {
        if (!eventIds.has(notification.id)) {
          notificationsToShow.push(notification);
        }
      });
    } else {
      notificationsToShow = currentNotifications;
    }

    // It's important to dispatch only if something changed, otherwise we will get into an infinite loop.
    if (changed) {
      // we are here means the events list changed and we have now new set of events, so we will notify the store about it
      dispatch(setUINotifications(notificationsToShow));
    }
  }, [events, notifications]);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function handleNotificationMarkAllRead() {
    const massagedNotifications = notifications.map(notification => {
      notification.seen = true;
      return notification;
    });
    dispatch(setUINotifications(massagedNotifications));
  }

  function handleNotificationClear() {
    const currentSetOfNotifications = notifications;
    const massagedNotifications = currentSetOfNotifications.map(notification => {
      notification.deleted = true;
      return notification;
    });
    dispatch(setUINotifications(massagedNotifications));
  }

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
  const areAllNotificationsInDeleteState =
    notifications.filter(notification => !notification.deleted).length === 0;
  const notificationMenuId = 'notification-menu';

  return (
    <>
      <IconButton
        aria-label={t('notifications|Show notifications')}
        aria-controls={notificationMenuId}
        aria-haspopup="true"
        onClick={handleClick}
      >
        {!areAllNotificationsInDeleteState && areThereUnseenNotifications ? (
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
        <Box borderBottom={`1px solid ${theme.palette.notificationBorderColor}`} p={1}>
          <Grid container justifyContent="space-between">
            <Grid item>
              <Box mx={1}>
                <Typography style={{ fontWeight: 'bold' }}>
                  {t('notifications|Notifications')}
                </Typography>
              </Box>
            </Grid>
            <Grid item>
              <Box display={'flex'} justifyContent="space-between">
                <Box>
                  <Button
                    style={{ textTransform: 'none', paddingTop: 0 }}
                    color="primary"
                    onClick={handleNotificationMarkAllRead}
                    disabled={areAllNotificationsInDeleteState || !areThereUnseenNotifications}
                  >
                    {t('notifications|Mark all as read')}
                  </Button>
                </Box>
                <Box>
                  <Button
                    style={{ textTransform: 'none', paddingTop: 0 }}
                    color="primary"
                    onClick={handleNotificationClear}
                    disabled={areAllNotificationsInDeleteState}
                  >
                    {t('frequent|Clear')}
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <NotificationsList
          notifications={areAllNotificationsInDeleteState ? [] : notifications}
          clickEventHandler={menuItemClickHandler}
        />
      </Menu>
    </>
  );
}
