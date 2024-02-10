/**
 * This plugin listens to Headlamp events and shows a snackbar with the event type and the name of the resource,
 * except for OBJECT_EVENTS, which are ignored.
 */
import {
  DefaultHeadlampEvents,
  HeadlampEvent,
  registerAppBarAction,
  registerHeadlampEventCallback,
} from '@kinvolk/headlamp-plugin/lib';
import { useSnackbar } from 'notistack';
import React from 'react';

let alreadyRegisteredEventHandler = false;

function EventNotifier() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [currentEvent, setCurrentEvent] = React.useState(null);
  const snackbarKey = React.useRef('');
  const timeoutHandler = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    // This should happen only once
    if (!alreadyRegisteredEventHandler) {
      registerHeadlampEventCallback((event: HeadlampEvent) => {
        setCurrentEvent(event);
      });
      alreadyRegisteredEventHandler = true;
    }
  }, []);

  React.useEffect(() => {
    if (!currentEvent) {
      return;
    }

    const k8sResource = currentEvent.data.resource;

    // Ignore OBJECT_EVENTS for now
    if (currentEvent.type === DefaultHeadlampEvents.OBJECT_EVENTS) {
      return;
    }

    let msg = '';
    // If we have a resource, we can show its name in the snackbar
    if (!!k8sResource) {
      msg = `Headlamp Event: ${currentEvent.type}, ${k8sResource.getName()}`;
    } else {
      msg = `Headlamp Event: ${currentEvent.type}`;
    }

    if (snackbarKey.current !== currentEvent.type || !timeoutHandler.current) {
      if (!!snackbarKey.current) {
        closeSnackbar(snackbarKey.current);
      }
      snackbarKey.current = currentEvent.type;

      enqueueSnackbar(msg, {
        key: currentEvent.type,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center',
        },
        persist: true,
      });
    }

    // Handle snackbar hiding after a timeout. We do it manually because we want to
    // extend the timeout if we receive another event of the same type.
    if (!!timeoutHandler.current) {
      clearTimeout(timeoutHandler.current);
    }

    timeoutHandler.current = setTimeout(() => {
      closeSnackbar(currentEvent.type);

      timeoutHandler.current = null;

      if (snackbarKey.current === currentEvent.type) {
        snackbarKey.current = '';
      }
    }, 5000);
  }, [currentEvent]);

  return null;
}

registerAppBarAction(EventNotifier);
