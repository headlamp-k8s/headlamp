import { SvgIcon } from '@material-ui/core';
import { ReactElement } from 'react';
import { ReactComponent as LogoLight } from '../../resources/icon-light.svg';
import { ReactComponent as LogoWithTextLight } from '../../resources/logo-light.svg';

export interface AppLogoProps {
  /** The size of the logo. 'small' for in mobile view, and 'large' for tablet and desktop sizes. */
  logoType: 'small' | 'large';
  /** User selected theme. */
  themeName?: 'dark' | 'light';
  /** A class to use on your SVG. */
  className: string;
  [key: string]: any;
}

export type AppLogoType = React.ComponentType<AppLogoProps> | ReactElement | null;

export default function AppLogo(props: AppLogoProps) {
  const { className, logoType } = props;

  return (
    <SvgIcon
      className={className}
      component={logoType === 'large' ? LogoWithTextLight : LogoLight}
      viewBox="0 0 auto 32"
    />
  );
}
