import { Icon } from '@iconify/react';
import { Box, IconButton, Menu, MenuItem, Tooltip, Typography, useTheme } from '@material-ui/core';
import React, { useState } from 'react';
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
  const { t } = useTranslation(['notifications', 'glossary', 'frequent']);
  const dispatch = useDispatch();
  const theme = useTheme();
  const search = useTypedSelector(state => state.filter.search);
  const history = useHistory();

  const allNotificationsAreDeleted = React.useMemo(() => {
    return !notifications.find(notification => !notification.deleted);
  }, [notifications]);

  const hasUnseenNotifications = React.useMemo(() => {
    return !!notifications.find(notification => !notification.deleted && !notification.seen);
  }, [notifications]);

  function notificationSeenUnseenHandler(event: any, notification?: Notification) {
    if (!notification) {
      return;
    }
    dispatch(updateUINotification(notification));
  }

  function clearAllNotifications() {
    const massagedNotifications = notifications.map(notification => {
      const updatedNotification = Object.assign(new Notification(), notification);
      updatedNotification.deleted = true;
      return updatedNotification;
    });
    dispatch(setUINotifications(massagedNotifications));
  }

  function markAllAsRead() {
    const massagedNotifications = notifications.map(notification => {
      const updatedNotification = Object.assign(new Notification(), notification);
      updatedNotification.seen = true;
      return updatedNotification;
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
          <MenuItem onClick={markAllAsRead} disabled={!hasUnseenNotifications}>
            <Typography color={'primary'}>{t('notifications|Mark all as read')}</Typography>
          </MenuItem>
          <MenuItem onClick={clearAllNotifications} disabled={allNotificationsAreDeleted}>
            <Typography color="primary">{t('notifications|Clear all')}</Typography>
          </MenuItem>
        </Menu>
      </>
    );
  }

  return (
    <SectionBox
      title={
        <SectionFilterHeader
          title={t('frequent|Notifications')}
          noNamespaceFilter
          actions={[<NotificationActionMenu />]}
        />
      }
      backLink
    >
      {allNotificationsAreDeleted ? (
        <Empty>{t("notifications|You don't have any notifications right now")}</Empty>
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
                    title={notification.message || t('notifications|No message')}
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
              label: t('glossary|Cluster'),
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
              label: t('frequent|Date'),
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
