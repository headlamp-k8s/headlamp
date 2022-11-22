import { Icon } from '@iconify/react';
import { Box, IconButton, Menu, MenuItem, Tooltip, Typography, useTheme } from '@material-ui/core';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Notification } from '../../../lib/notification';
import { setUINotifications, updateUINotification } from '../../../redux/actions/actions';
import { useTypedSelector } from '../../../redux/reducers/reducers';
import { DateLabel, SectionBox, SectionFilterHeader, SimpleTable } from '../../common';
import Empty from '../../common/EmptyContent';

export default function NotificationList() {
  const notifications = useTypedSelector(state => state.ui.notifications);
  const config = useTypedSelector(state => state.config);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const search = useTypedSelector(state => state.filter.search);
  const history = useHistory();

  function checkIfAllNotificationsDeleted() {
    return notifications.filter(notification => notification.deleted === false).length === 0;
  }

  function notificationSeenUnseenHandler(event: any, notification?: Notification) {
    if (!notification) {
      return;
    }
    notification.seen = !notification.seen;
    dispatch(updateUINotification(notification));
  }

  function clearAllNotifications() {
    const currentSetOfNotifications = notifications;
    const massagedNotifications = currentSetOfNotifications.map(notification => {
      notification.deleted = true;
      return notification;
    });
    dispatch(setUINotifications(massagedNotifications));
  }

  function markAllAsRead() {
    const massagedNotifications = notifications.map(notification => {
      notification.seen = true;
      return notification;
    });
    dispatch(setUINotifications(massagedNotifications));
  }

  function notificationItemClickHandler(notification: Notification) {
    notification.url && history.push(notification.url);
    notification.seen = true;
    dispatch(updateUINotification(notification));
  }

  function NotificationActionMenu() {
    const [anchorEl, setAnchorEl] = useState(null);

    function handleClick(event: any) {
      setAnchorEl(event.currentTarget);
    }

    function handleClose() {
      setAnchorEl(null);
    }

    return (
      <>
        <IconButton>
          <Icon icon="mdi:dots-vertical" onClick={handleClick} />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
          <MenuItem onClick={markAllAsRead}>
            <Typography color={'primary'}>{t('Mark all as read')}</Typography>
          </MenuItem>
          <MenuItem onClick={clearAllNotifications}>
            <Typography color="primary">{t('Clear all')}</Typography>
          </MenuItem>
        </Menu>
      </>
    );
  }

  return (
    <SectionBox
      title={
        <SectionFilterHeader
          title={t('Notifications')}
          noNamespaceFilter
          actions={[<NotificationActionMenu />]}
        />
      }
    >
      {checkIfAllNotificationsDeleted() ? (
        <Empty>{t(`notifications|You don't have any notifications right now`)}</Empty>
      ) : (
        <SimpleTable
          filterFunction={(notification: Notification) =>
            (notification?.message?.toLowerCase() || '').includes(search.toLowerCase())
          }
          columns={[
            {
              label: t('Message'),
              getter: (notification: Notification) => (
                <Box width={'30vw'}>
                  <Tooltip
                    title={`${t(`notifications|${notification.message}`)}`}
                    disableHoverListener={!notification.message}
                  >
                    <Typography
                      style={{
                        fontWeight: notification.seen ? 'normal' : 'bold',
                        cursor: 'pointer',
                      }}
                      noWrap
                      onClick={() => notificationItemClickHandler(notification)}
                    >
                      {`${notification.message || t(`notifications|No message`)}`}
                    </Typography>
                  </Tooltip>
                </Box>
              ),
            },
            {
              label: t('Cluster'),
              getter: (notification: Notification) => (
                <Box display={'flex'} alignItems="center">
                  {Object.entries(config?.clusters || {}).length > 1 && notification.cluster && (
                    <Box
                      border={1}
                      p={0.5}
                      mr={1}
                      textOverflow="ellipsis"
                      overflow={'hidden'}
                      whiteSpace="nowrap"
                    >
                      {notification.cluster}
                    </Box>
                  )}{' '}
                </Box>
              ),
            },
            {
              label: t('Date'),
              getter: (notification: Notification) => <DateLabel date={notification.date} />,
            },
            {
              label: t('Visible'),
              getter: (notification: Notification) =>
                !notification.seen && (
                  <Tooltip title={t(`notifications|Mark as read`)}>
                    <IconButton
                      onClick={e => notificationSeenUnseenHandler(e, notification)}
                      aria-label={t(`notifications|Mark as read`)}
                    >
                      <Icon
                        icon="mdi:circle"
                        color={theme.palette.error.main}
                        height={12}
                        width={12}
                      />
                    </IconButton>
                  </Tooltip>
                ),
            },
          ]}
          data={notifications}
          noTableHeader
        />
      )}
    </SectionBox>
  );
}
