import * as CommonComponents from '../components/common';
import { Headlamp, Plugin } from '../plugin/lib';
import Registry, {
  AppLogoProps,
  ClusterChooserProps,
  DefaultSidebars,
  DetailsViewDefaultHeaderActions,
  DetailsViewSectionProps,
  registerAppBarAction,
  registerAppLogo,
  registerClusterChooser,
  registerDetailsViewHeaderAction,
  registerDetailsViewHeaderActionsProcessor,
  registerDetailsViewSection,
  registerGetTokenFunction,
  registerRoute,
  registerRouteFilter,
  registerSidebarEntry,
  registerSidebarEntryFilter,
} from '../plugin/registry';
import * as K8s from './k8s';
import * as ApiProxy from './k8s/apiProxy';
import * as Notification from './notification';
import * as Router from './router';
import * as Utils from './util';

// We export k8s (lowercase) since someone may use it as we do in the Headlamp source code.
export {
  ApiProxy,
  K8s,
  K8s as k8s,
  CommonComponents,
  Utils,
  Router,
  Plugin,
  Registry,
  Headlamp,
  Notification,
  AppLogoProps,
  ClusterChooserProps,
  DetailsViewSectionProps,
  DetailsViewDefaultHeaderActions,
  DefaultSidebars,
  registerAppLogo,
  registerAppBarAction,
  registerClusterChooser,
  registerDetailsViewHeaderAction,
  registerDetailsViewSection,
  registerRoute,
  registerRouteFilter,
  registerSidebarEntry,
  registerSidebarEntryFilter,
  registerDetailsViewHeaderActionsProcessor,
  registerGetTokenFunction,
};

export type { AppLogoProps, ClusterChooserProps, DetailsViewSectionProps };
