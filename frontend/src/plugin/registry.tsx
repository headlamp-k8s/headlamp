import { has } from 'lodash';
import React from 'react';
import { AppLogoProps, AppLogoType } from '../components/App/AppLogo';
import { setBrandingAppLogoComponent } from '../components/App/themeSlice';
import { ClusterChooserProps, ClusterChooserType } from '../components/cluster/ClusterChooser';
import {
  addResourceTableColumnsProcessor,
  TableColumnsProcessor,
} from '../components/common/Resource/resourceTableSlice';
import { SectionBox } from '../components/common/SectionBox';
import { DetailsViewSectionProps, DetailsViewSectionType } from '../components/DetailsViewSection';
import {
  addDetailsViewSectionsProcessor,
  DefaultDetailsViewSection,
  DetailsViewSectionsProcessor,
  setDetailsViewSection,
} from '../components/DetailsViewSection/detailsViewSectionSlice';
import { DefaultSidebars, SidebarEntryProps } from '../components/Sidebar';
import { setSidebarItem, setSidebarItemFilter } from '../components/Sidebar/sidebarSlice';
import { getHeadlampAPIHeaders } from '../helpers';
import { KubeObject } from '../lib/k8s/cluster';
import { Route } from '../lib/router';
import {
  addDetailsViewHeaderActionsProcessor,
  AppBarAction,
  AppBarActionProcessorType,
  AppBarActionsProcessor,
  AppBarActionType,
  DefaultAppBarAction,
  DefaultHeaderAction,
  HeaderActionsProcessor,
  HeaderActionType,
  setAppBarAction,
  setAppBarActionsProcessor,
  setDetailsViewHeaderAction,
} from '../redux/actionButtonsSlice';
import { setClusterChooserButtonComponent, setFunctionsToOverride } from '../redux/actions/actions';
import { setRoute, setRouteFilter } from '../redux/routesSlice';
import store from '../redux/stores/store';

export interface SectionFuncProps {
  title: string;
  component: (props: { resource: any }) => JSX.Element | null;
}

export type {
  AppLogoProps,
  AppLogoType,
  ClusterChooserProps,
  ClusterChooserType,
  DefaultSidebars,
  DetailsViewSectionProps,
  DetailsViewSectionType,
  SidebarEntryProps,
};
export const DetailsViewDefaultHeaderActions = DefaultHeaderAction;
export type { AppBarActionProcessorType };
/**
 * @deprecated please used DetailsViewSectionType and registerDetailViewSection
 */
export type sectionFunc = (resource: KubeObject) => SectionFuncProps | null | undefined;

// @todo: these might be better with a more well defined interface.
//        So that things like importing material-ui stuff,
//        tooltips and a11y stuff can be done.
//        Maybe in a ResourceAction component? That is used by Headlamp too.
// @todo: these should also have a *Props
// @todo: HeaderActionType should be deprecated.
export type DetailsViewHeaderActionType = HeaderActionType;
export type DetailsViewHeaderActionsProcessor = HeaderActionsProcessor;

export default class Registry {
  /**
   * @deprecated Registry.registerSidebarItem is deprecated. Please use registerSidebarItem.
   */
  registerSidebarItem(
    parentName: string | null,
    itemName: string,
    itemLabel: string,
    url: string,
    opts: Pick<SidebarEntryProps, 'sidebar' | 'useClusterURL' | 'icon'> = { useClusterURL: true }
  ) {
    console.warn('Registry.registerSidebarItem is deprecated. Please use registerSidebarItem.');
    const { useClusterURL = true, ...options } = opts;
    store.dispatch(
      setSidebarItem({
        name: itemName,
        label: itemLabel,
        url,
        parent: parentName,
        useClusterURL,
        ...options,
      })
    );
  }

  /**
   * @deprecated Registry.registerRoute is deprecated. Please use registerRoute.
   */
  registerRoute(routeSpec: Route) {
    console.warn('Registry.registerRoute is deprecated. Please use registerRoute.');
    return registerRoute(routeSpec);
  }

  /**
   * @deprecated Registry.registerDetailsViewHeaderAction is deprecated. Please use registerDetailsViewHeaderAction.
   */
  registerDetailsViewHeaderAction(actionName: string, actionFunc: HeaderActionType) {
    console.warn(
      'Registry.registerDetailsViewHeaderAction is deprecated. Please use registerDetailsViewHeaderAction.'
    );
    store.dispatch(setDetailsViewHeaderAction(actionFunc));
  }

  /**
   * @deprecated Registry.registerAppBarAction is deprecated. Please use registerAppBarAction.
   */
  registerAppBarAction(actionName: string, actionFunc: (...args: any[]) => JSX.Element | null) {
    console.warn('Registry.registerAppBarAction is deprecated. Please use registerAppBarAction.');
    return registerAppBarAction(actionFunc);
  }

  /**
   * @deprecated Registry.registerDetailsViewSection is deprecated. Please use registerDetailsViewSection.
   *
   * ```tsx
   *
   * register.registerDetailsViewSection('biolatency', resource => {
   *   if (resource?.kind === 'Node') {
   *     return {
   *       title: 'Block I/O Latency',
   *       component: () => <CustomComponent />,
   *     };
   *   }
   *   return null;
   * });
   *
   * ```
   */
  registerDetailsViewSection(
    sectionName: string,
    sectionFunc: (props: { resource: any }) => SectionFuncProps | null
  ) {
    console.warn(
      'Registry.registerDetailsViewSection is deprecated. Please use registerDetailsViewSection.'
    );

    function OurComponent({ resource }: DetailsViewSectionProps) {
      const res = sectionFunc(resource);
      if (res === null) {
        return null;
      }

      return (
        <SectionBox title={sectionName}>
          <res.component resource={resource} />
        </SectionBox>
      );
    }

    return registerDetailsViewSection(OurComponent);
  }

  /**
   * @deprecated Registry.registerAppLogo is deprecated. Please use registerAppLogo.
   */
  registerAppLogo(logo: AppLogoType) {
    console.warn('Registry.registerAppLogo is deprecated. Please use registerAppLogo.');
    return registerAppLogo(logo);
  }

  /**
   * @deprecated Registry.registerClusterChooserComponent is deprecated. Please use registerClusterChooser.
   */
  registerClusterChooserComponent(component: React.ComponentType<ClusterChooserProps> | null) {
    console.warn(
      'Registry.registerClusterChooserComponent is deprecated. Please use registerClusterChooser.'
    );
    return registerClusterChooser(component);
  }
}

/**
 * Add a Sidebar Entry to the menu (on the left side of Headlamp).
 *
 * @example
 *
 * ```tsx
 * import { registerSidebarEntry } from '@kinvolk/headlamp-plugin/lib';
 * registerSidebarEntry({ parent: 'cluster', name: 'traces', label: 'Traces', url: '/traces' });
 *
 * ```
 *
 * @see {@link http://github.com/kinvolk/headlamp/plugins/examples/sidebar/ Sidebar Example}
 */
export function registerSidebarEntry({
  parent,
  name,
  label,
  url,
  useClusterURL = true,
  icon,
  sidebar,
}: SidebarEntryProps) {
  store.dispatch(
    setSidebarItem({
      name,
      label,
      url,
      parent,
      useClusterURL,
      icon,
      sidebar,
    })
  );
}

/**
 * Remove sidebar menu items.
 *
 * @param filterFunc - a function for filtering sidebar entries.
 *
 * @example
 *
 * ```tsx
 * import { registerSidebarEntryFilter } from '@kinvolk/headlamp-plugin/lib';
 *
 * registerSidebarEntryFilter(entry => (entry.name === 'workloads' ? null : entry));
 * ```
 */
export function registerSidebarEntryFilter(
  filterFunc: (entry: SidebarEntryProps) => SidebarEntryProps | null
) {
  store.dispatch(setSidebarItemFilter(filterFunc));
}

/**
 * Remove routes.
 *
 * @param filterFunc - a function for filtering routes.
 *
 * @example
 *
 * ```tsx
 * import { registerRouteFilter } from '@kinvolk/headlamp-plugin/lib';
 *
 * registerRouteFilter(route => (route.path === '/workloads' ? null : route));
 * ```
 */
export function registerRouteFilter(filterFunc: (entry: Route) => Route | null) {
  store.dispatch(setRouteFilter(filterFunc));
}

/**
 * Add a Route for a component.
 *
 * @param routeSpec - details of URL, highlighted sidebar and component to use.
 *
 * @example
 *
 * ```tsx
 * import { registerRoute } from '@kinvolk/headlamp-plugin/lib';
 *
 * // Add a route that will display the given component and select
 * // the "traces" sidebar item.
 * registerRoute({
 *   path: '/traces',
 *   sidebar: 'traces',
 *   component: () => <TraceList />
 * });
 * ```
 *
 * @see {@link https://github.com/kinvolk/headlamp/blob/main/frontend/src/lib/router.tsx Route examples}
 * @see {@link http://github.com/kinvolk/headlamp/plugins/examples/sidebar/ Sidebar Example}
 *
 */
export function registerRoute(routeSpec: Route) {
  store.dispatch(setRoute(routeSpec));
}

/**
 * Add a component into the details view header.
 *
 * @param headerAction - The action (link) to put in the app bar.
 *
 * @example
 *
 * ```tsx
 * import { ActionButton } from '@kinvolk/headlamp-plugin/lib/CommonComponents';
 * import { registerDetailsViewHeaderAction } from '@kinvolk/headlamp-plugin/lib';
 *
 * function IconAction() {
 *   return (
 *     <ActionButton
 *      description="Launch"
 *      icon="mdi:comment-quote"
 *      onClick={() => console.log('Hello from IconAction!')}
 *    />
 *   )
 * }
 *
 * registerDetailsViewHeaderAction(IconAction);
 * ```
 */
export function registerDetailsViewHeaderAction(headerAction: DetailsViewHeaderActionType) {
  store.dispatch(setDetailsViewHeaderAction(headerAction));
}

/**
 * Add a processor for the details view header actions. Allowing the modification of header actions.
 *
 * @param processor - The processor to add. Receives a resource (for which we are processing the header actions) and the current header actions and returns the new header actions. Return an empty array to remove all header actions.
 *
 * @example
 *
 * ```tsx
 * import { registerDetailsViewHeaderActionsProcessor, DetailsViewDefaultHeaderActions } from '@kinvolk/headlamp-plugin/lib';
 *
 * // Processor that removes the default edit action.
 * registerDetailsViewHeaderActionsProcessor((resource, headerActions) => {
 *  return headerActions.filter(action => action.name !== DetailsViewDefaultHeaderActions.EDIT);
 * });
 *
 * More complete detail view example in plugins/examples/details-view:
 * @see {@link http://github.com/kinvolk/headlamp/plugins/examples/details-view/ Detail View Example}
 *
 */
export function registerDetailsViewHeaderActionsProcessor(
  processor: DetailsViewHeaderActionsProcessor | DetailsViewHeaderActionsProcessor['processor']
) {
  store.dispatch(addDetailsViewHeaderActionsProcessor(processor));
}

/**
 * Add a processor for the resource table columns. Allowing the modification of what tables show.
 *
 * @param processor - The processor ID and function. See #TableColumnsProcessor.
 *
 * @example
 *
 * ```tsx
 * import { registerResourceTableColumnsProcessor } from '@kinvolk/headlamp-plugin/lib';
 *
 * // Processor that adds a column to show how many init containers pods have (in the default pods' list table).
 * registerResourceTableColumnsProcessor(function ageRemover({ id, columns }) {
 *   if (id === 'headlamp-pods') {
 *     columns.push({
 *       label: 'Init Containers',
 *       getter: (pod: Pod) => {
 *         return pod.spec.initContainers.length;
 *       },
 *     });
 *   }
 *
 *   return columns;
 * });
 * ```
 */
export function registerResourceTableColumnsProcessor(
  processor: TableColumnsProcessor | TableColumnsProcessor['processor']
) {
  store.dispatch(addResourceTableColumnsProcessor(processor));
}

function isProcessor(
  headerAction: AppBarActionType | AppBarActionsProcessor | AppBarActionProcessorType
): boolean {
  return !!(
    headerAction &&
    (has(headerAction, 'processor') ||
      (typeof headerAction === 'function' && headerAction.length === 1))
  );
}

/**
 * Add a component into the app bar (at the top of the app).
 *
 * @param headerAction - The action (link) to put in the app bar.
 *
 * @example
 *
 * ```tsx
 * import { registerAppBarAction } from '@kinvolk/headlamp-plugin/lib';
 * import { Button } from '@mui/material';
 *
 * function ConsoleLogger() {
 *   return (
 *     <Button
 *       onClick={() => {
 *         console.log('Hello from ConsoleLogger!')
 *       }}
 *     >
 *       Print Log
 *     </Button>
 *   );
 * }
 *
 * registerAppBarAction(ConsoleLogger);
 * ```
 */
export function registerAppBarAction(
  headerAction: AppBarActionType | AppBarAction | AppBarActionsProcessor | AppBarActionProcessorType
) {
  if (isProcessor(headerAction)) {
    store.dispatch(setAppBarActionsProcessor(headerAction as AppBarActionsProcessor));
  }
  store.dispatch(setAppBarAction(headerAction as AppBarAction));
}

/**
 * Append a component to the details view for a given resource.
 *
 * @param viewSection - The section to add on different view screens.
 *
 * @example
 *
 * ```tsx
 * import {
 *   registerDetailsViewSection,
 *   DetailsViewSectionProps
 * } from '@kinvolk/headlamp-plugin/lib';
 *
 * registerDetailsViewSection(({ resource }: DetailsViewSectionProps) => {
 *   if (resource.kind === 'Pod') {
 *     return (
 *       <SectionBox title="A very fine section title">
 *         The body of our Section for {resource.kind}
 *       </SectionBox>
 *     );
 *   }
 *   return null;
 * });
 * ```
 */
export function registerDetailsViewSection(viewSection: DetailsViewSectionType) {
  store.dispatch(setDetailsViewSection(viewSection));
}

/**
 * Add a processor for the details view sections. Allowing the modification of what sections are shown.
 *
 * @param processor - The processor to add. Receives a resource (for which we are processing the sections) and the current sections and returns the new sections. Return an empty array to remove all sections.
 *
 * @example
 *
 * ```tsx
 * import { registerDetailsViewSectionsProcessor } from '@kinvolk/headlamp-plugin/lib';
 *
 * registerDetailsViewSectionsProcessor(function addTopSection( resource, sections ) {
 *   // Ignore if there is no resource.
 *   if (!resource) {
 *    return sections;
 *   }
 *
 *   // Check if we already have added our custom section (this function may be called multiple times).
 *   const customSectionId = 'my-custom-section';
 *   if (sections.findIndex(section => section.id === customSectionId) !== -1) {
 *     return sections;
 *   }
 *
 *   return [
 *     {
 *       id: 'my-custom-section',
 *       section: (
 *         <SectionBox title="I'm the top of the world!" />
         ),
 *     },
 *     ...sections,
 *   ];
 * });
 * ```
 */
export function registerDetailsViewSectionsProcessor(
  processor: DetailsViewSectionsProcessor | DetailsViewSectionsProcessor['processor']
) {
  store.dispatch(addDetailsViewSectionsProcessor(processor));
}

/**
 * Add a logo for Headlamp to use instead of the default one.
 *
 * @param logo is a React Component that takes two required props
 * `logoType` which is a constant string literal that accepts either
 * of the two values `small` or `large` depending on whether
 * the sidebar is in shrink or expanded state so that you can change your logo
 * from small to large and the other optional prop is the `themeName`
 * which is a string with two values 'light' and 'dark' base on which theme is selected.
 *
 * @example
 *
 * ```tsx
 * import { registerAppLogo } from '@kinvolk/headlamp-plugin/lib';
 *
 * registerAppLogo(<p>my logo</p>)
 * ```
 *
 * More complete logo example in plugins/examples/change-logo:
 * @see {@link http://github.com/kinvolk/headlamp/plugins/examples/change-logo/ Change Logo Example}
 *
 */
export function registerAppLogo(logo: AppLogoType) {
  store.dispatch(setBrandingAppLogoComponent(logo));
}

/**
 * Use a custom cluster chooser button
 *
 * @param chooser is a React Component that takes one required props ```clickHandler``` which is the
 * action handler that happens when the custom chooser button component click event occurs
 *
 * @example
 *
 * ```tsx
 * import { ClusterChooserProps, registerClusterChooser } from '@kinvolk/headlamp-plugin/lib';
 *
 * registerClusterChooser(({ clickHandler, cluster }: ClusterChooserProps) => {
 *   return <button onClick={clickHandler}>my chooser Current cluster: {cluster}</button>;
 * })
 * ```
 *
 * @see {@link http://github.com/kinvolk/headlamp/plugins/examples/cluster-chooser/ Cluster Chooser example}
 *
 */
export function registerClusterChooser(chooser: ClusterChooserType) {
  store.dispatch(setClusterChooserButtonComponent(chooser));
}

/**
 * Override headlamp setToken method
 * @param override - The setToken override method to use.
 *
 * @example
 *
 * ```ts
 * registerSetTokenFunction((cluster: string, token: string | null) => {
 * // set token logic here
 * });
 * ```
 */
export function registerSetTokenFunction(
  override: (cluster: string, token: string | null) => void
) {
  store.dispatch(setFunctionsToOverride({ setToken: override }));
}

/**
 * Override headlamp getToken method
 * @param override - The getToken override method to use.
 *
 * @example
 *
 * ```ts
 * registerGetTokenFunction(() => {
 * // set token logic here
 * });
 * ```
 */
export function registerGetTokenFunction(override: (cluster: string) => string | undefined) {
  store.dispatch(setFunctionsToOverride({ getToken: override }));
}

export { DefaultAppBarAction, DefaultDetailsViewSection, getHeadlampAPIHeaders };
