import * as ApiProxy from '../lib/lib/k8s/apiProxy';
import * as K8s from '../lib/lib/k8s';
import * as Notification from '../lib/lib/notification';
import * as Router from '../lib/lib/router';
import * as Utils from '../lib/lib/util';
import { Headlamp, Plugin } from '../lib/plugin/lib';
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
} from '../lib/plugin/registry';

import * as CommonComponents from '../lib/components/common';

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
