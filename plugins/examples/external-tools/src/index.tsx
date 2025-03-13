import { registerPluginSettings } from '@kinvolk/headlamp-plugin/lib';
import { BinarySettings } from './Settings';

/**
 * Register the settings component for the external-tools plugin.
 *
 * This allows users to manage Minikube installation through
 * Headlamp's binary management system.
 */
registerPluginSettings('external-tools', BinarySettings, false);
