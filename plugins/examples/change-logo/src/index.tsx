// If you just want a text logo, these two lines are all you need.
//
// import { registerAppLogo } from '@kinvolk/headlamp-plugin/lib';
// registerAppLogo(() => <p>My Logo</p>);

import { AppLogoProps, registerAppLogo } from '@kinvolk/headlamp-plugin/lib';
import { SvgIcon } from '@mui/material';
import LogoWithTextLight from './icon-large-light.svg';
import LogoLight from './icon-small-light.svg';

/**
 * A simple logo using two different SVG files.
 * One for the small logo (used in mobile view), and a larger one used in desktop view.
 *
 * The main benefit of a SVG logo is that
 * it's easier to make it look good with light and dark themes.
 */
function SimpleLogo(props: AppLogoProps) {
  const { logoType, className } = props;

  return (
    <SvgIcon
      className={className}
      component={logoType === 'large' ? LogoWithTextLight : LogoLight}
      viewBox="0 0 auto 32"
    />
  );
}

/**
 * This logo example shows how you can customize the logo more for different conditions.
 */
export function ReactiveLogo(props: AppLogoProps) {
  const { logoType, themeName } = props;

  if (logoType === 'small' && themeName === 'dark') {
    // Dark mode theme, has a dark background.
    // Small logo is shown on mobile view.
    return <p>small dark theme logo</p>;
  } else if (logoType === 'small' && themeName === 'light') {
    // Light mode theme, has a light background.
    return <p>small light theme logo</p>;
  } else if (logoType === 'large' && themeName === 'dark') {
    // The large logo is shown on tablet and desktop views.
    return <p>large dark theme logo</p>;
  } else if (logoType === 'large' && themeName === 'light') {
    return <p>large light theme logo</p>;
  }
}

const show = 'simple';
if (show === 'simple') {
  registerAppLogo(SimpleLogo);
} else if (show === 'text') {
  registerAppLogo(<p>My Logo</p>);
} else {
  registerAppLogo(ReactiveLogo);
}
