import { makeStyles, SvgIcon } from '@material-ui/core';
import React, { isValidElement, ReactElement } from 'react';
import { getThemeName } from '../../lib/themes';
import { useTypedSelector } from '../../redux/reducers/reducers';
import { ReactComponent as LogoLight } from '../../resources/icon-light.svg';
import { ReactComponent as LogoWithTextLight } from '../../resources/logo-light.svg';
import { EmptyContent } from '../common';
import ErrorBoundary from '../common/ErrorBoundary';

export interface AppLogoProps {
  /** The size of the logo. 'small' for in mobile view, and 'large' for tablet and desktop sizes. By default the 'large' is used. */
  logoType?: 'small' | 'large';
  /** User selected theme. By default it checks which is is active. */
  themeName?: 'dark' | 'light';
  /** A class to use on your SVG. */
  className?: string;
  [key: string]: any;
}

export type AppLogoType =
  | React.ComponentType<AppLogoProps>
  | ReactElement
  | typeof React.Component
  | null;

export default function OriginalAppLogo(props: AppLogoProps) {
  const { className, logoType } = props;

  return (
    <SvgIcon
      className={className}
      component={logoType === 'large' ? LogoWithTextLight : LogoLight}
      viewBox="0 0 auto 32"
    />
  );
}

const useStyle = makeStyles({
  logo: {
    height: '32px',
    width: 'auto',
  },
});

export function AppLogo(props: AppLogoProps) {
  const classes = useStyle();
  const { className = classes.logo, logoType = 'large', themeName = getThemeName() } = props;
  const arePluginsLoaded = useTypedSelector(state => state.plugins.loaded);
  const PluginAppLogoComponent = useTypedSelector(state => state.ui.branding.logo);
  const PluginAppLogoComp = PluginAppLogoComponent as typeof React.Component;

  // Till all plugins are not loaded show empty content for logo as we might have logo coming from a plugin
  if (!arePluginsLoaded) {
    return <EmptyContent />;
  }

  return PluginAppLogoComponent ? (
    <ErrorBoundary>
      {isValidElement(PluginAppLogoComponent) ? (
        // If it's an element, just use it.
        PluginAppLogoComponent
      ) : (
        // It is a component, so we make it here.
        <PluginAppLogoComp logoType={logoType} themeName={themeName} className={className} />
      )}
    </ErrorBoundary>
  ) : (
    <OriginalAppLogo logoType={logoType} className={className} />
  );
}
