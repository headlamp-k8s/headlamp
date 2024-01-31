import {
  AppBarActionsProcessorArgs,
  DefaultAppBarAction,
  K8s,
  registerAppBarAction,
  registerPluginSettings,
} from '@kinvolk/headlamp-plugin/lib';
import { NameValueTable } from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
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

/**
 * A component for displaying and editing plugin settings, specifically for customizing error messages.
 * It renders a text input field that allows users to specify a custom error message.
 * This message is intended to be displayed when a specific error condition occurs (e.g., pod count cannot be retrieved).
 *
 * @param {PluginSettingsDetailsProps} props - Properties passed to the Settings component.
 * @param {Object} props.data - The current configuration data for the plugin, including the current error message.
 * @param {function(Object): void} props.onDataChange - Callback function to handle changes to the data, specifically the error message.
 */
function Settings(props) {
  const { data, onDataChange } = props;

  /**
   * Handles changes to the error message input field by invoking the onDataChange callback
   * with the new error message.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event from the input field.
   */
  const handleChange = event => {
    onDataChange({ errorMessage: event.target.value });
  };

  const settingsRows = [
    {
      name: 'Custom Error Message',
      value: (
        <TextField
          fullWidth
          helperText="Enter the custom error message to display when the pod count cannot be retrieved."
          defaultValue={data?.errorMessage ? data.errorMessage : 'Uh... pods!?'}
          onChange={handleChange}
          variant="standard"
        />
      ),
    },
  ];

  return (
    <Box width={'80%'}>
      <NameValueTable rows={settingsRows} />
    </Box>
  );
}

registerPluginSettings('@kinvolk/headlamp-pod-counter', Settings, true);
