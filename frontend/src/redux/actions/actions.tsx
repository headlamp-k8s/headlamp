import { AppLogoType } from '../../components/App/AppLogo';
import { ClusterChooserType } from '../../components/cluster/ClusterChooser';
import { DetailsViewSectionType } from '../../components/DetailsViewSection';
import { SidebarEntryProps } from '../../components/Sidebar';
import { Route } from '../../lib/router';
import { UIState } from '../reducers/ui';

export const UI_SIDEBAR_SET_SELECTED = 'UI_SIDEBAR_SET_SELECTED';
export const UI_SIDEBAR_SET_VISIBLE = 'UI_SIDEBAR_SET_VISIBLE';
export const UI_SIDEBAR_SET_ITEM = 'UI_SIDEBAR_SET_ITEM';
export const UI_SIDEBAR_SET_ITEM_FILTER = 'UI_SIDEBAR_SET_ITEM_FILTER';
export const UI_SIDEBAR_SET_EXPANDED = 'UI_SIDEBAR_SET_EXPANDED';
export const UI_ROUTER_SET_ROUTE = 'UI_ROUTER_SET_ROUTE';
export const UI_ROUTER_SET_ROUTE_FILTER = 'UI_ROUTER_SET_ROUTE_FILTER';
export const UI_DETAILS_VIEW_SET_HEADER_ACTION = 'UI_DETAILS_VIEW_SET_HEADER_ACTION';
export const UI_DETAILS_VIEW_ADD_HEADER_ACTIONS_PROCESSOR =
  'UI_DETAILS_VIEW_ADD_HEADER_ACTIONS_PROCESSOR';
export const UI_SET_DETAILS_VIEW = 'UI_SET_DETAILS_VIEW';
export const UI_INITIALIZE_PLUGIN_VIEWS = 'UI_INITIALIZE_PLUGIN_VIEWS';
export const UI_PLUGINS_LOADED = 'UI_PLUGINS_LOADED';
export const UI_VERSION_DIALOG_OPEN = 'UI_VERSION_DIALOG_OPEN';
export const UI_SET_CLUSTER_CHOOSER_BUTTON = 'UI_SET_CLUSTER_CHOOSER_BUTTON';
export const UI_HIDE_APP_BAR = 'UI_HIDE_APP_BAR';
export const UI_FUNCTIONS_OVERRIDE = 'UI_FUNCTIONS_OVERRIDE';

export interface BrandingProps {
  logo: AppLogoType;
}

export interface Action {
  type: string;
  [propName: string]: any;
}

type SidebarType = UIState['sidebar'];

export function setSidebarSelected(selected: string | null, sidebar: string | null = '') {
  return { type: UI_SIDEBAR_SET_SELECTED, selected: { item: selected, sidebar } };
}

export function setWhetherSidebarOpen(isSidebarOpen: boolean) {
  localStorage.setItem('sidebar', JSON.stringify({ shrink: !isSidebarOpen }));
  return { type: UI_SIDEBAR_SET_EXPANDED, isSidebarOpen, isSidebarOpenUserSelected: isSidebarOpen };
}

export function setHideAppBar(hideAppBar: boolean | undefined) {
  return { type: UI_HIDE_APP_BAR, hideAppBar };
}

export function setSidebarVisible(isVisible: SidebarType['isVisible']) {
  return { type: UI_SIDEBAR_SET_VISIBLE, isVisible };
}

export function setSidebarItem(item: SidebarEntryProps) {
  // @todo: Clarify the spec when we port this to Ts.
  if (item.parent === undefined) {
    item['parent'] = null;
  }
  return { type: UI_SIDEBAR_SET_ITEM, item };
}

export function setSidebarItemFilter(
  filterFunc: (entry: SidebarEntryProps) => SidebarEntryProps | null
) {
  return { type: UI_SIDEBAR_SET_ITEM_FILTER, filterFunc };
}

export function setRoute(routeSpec: Route) {
  return { type: UI_ROUTER_SET_ROUTE, route: routeSpec };
}

export function setRouteFilter(filterFunc: (entry: Route) => Route | null) {
  return { type: UI_ROUTER_SET_ROUTE_FILTER, filterFunc };
}

export function setDetailsView(viewSection: DetailsViewSectionType) {
  return {
    type: UI_SET_DETAILS_VIEW,
    action: viewSection,
  };
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
