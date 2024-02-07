import { AppLogoType } from '../../components/App/AppLogo';
import { ClusterChooserType } from '../../components/cluster/ClusterChooser';

export const HEADLAMP_EVENT = 'HEADLAMP_EVENT';
export const UI_SET_CLUSTER_CHOOSER_BUTTON = 'UI_SET_CLUSTER_CHOOSER_BUTTON';
export const UI_HIDE_APP_BAR = 'UI_HIDE_APP_BAR';
export const UI_FUNCTIONS_OVERRIDE = 'UI_FUNCTIONS_OVERRIDE';
export const UI_VERSION_DIALOG_OPEN = 'UI_VERSION_DIALOG_OPEN';
export const UI_INITIALIZE_PLUGIN_VIEWS = 'UI_INITIALIZE_PLUGIN_VIEWS';

export interface BrandingProps {
  logo: AppLogoType;
}

export interface Action {
  type: string;
  [propName: string]: any;
}

export function setHideAppBar(hideAppBar: boolean | undefined) {
  return { type: UI_HIDE_APP_BAR, hideAppBar };
}

export function setClusterChooserButtonComponent(component: ClusterChooserType) {
  return { type: UI_SET_CLUSTER_CHOOSER_BUTTON, component };
}

export function setVersionDialogOpen(isVersionDialogOpen: boolean) {
  return { type: UI_VERSION_DIALOG_OPEN, isVersionDialogOpen };
}

export type FunctionsToOverride = {
  [key: string]: (...args: any) => any;
};

export function setFunctionsToOverride(override: FunctionsToOverride) {
  return { type: UI_FUNCTIONS_OVERRIDE, override };
}
