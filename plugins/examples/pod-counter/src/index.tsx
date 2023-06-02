import {
  AppBarActionsProcessorArgs,
  DefaultAppBarAction,
  K8s,
  registerAppBarAction,
} from '@kinvolk/headlamp-plugin/lib';
import Message from './Message';

function PodCounter() {
  const [pods, error] = K8s.ResourceClasses.Pod.useList();
  const msg = pods === null ? 'Loading…' : pods.length.toString();
  return <Message msg={msg} error={error} />;
}

registerAppBarAction(PodCounter);

// We can also reorder the actions in the app bar.
registerAppBarAction(function reorderNotifications({ actions }: AppBarActionsProcessorArgs) {
  // Remove the notifications action button
  const newActions = actions.filter(action => action.id !== DefaultAppBarAction.NOTIFICATION);

  // This is an example of how you can add an extra pod counter action button.
  // newActions.push({action: <PodCounter />, id: 'pod-counter });

  // Move the notification action to the end.
  const notificationAction = actions.find(action => action.id === DefaultAppBarAction.NOTIFICATION);
  if (notificationAction) {
    newActions.push(notificationAction);
  }

  return newActions;
});
