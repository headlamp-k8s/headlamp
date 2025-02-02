declare module '@material-ui/core' {
  import { Theme } from '@material-ui/core/styles';
  import { ElementType, ReactNode } from 'react';

  export function useTheme(): Theme;

  export interface BoxProps {
    p?: number;
    children?: ReactNode;
  }

  export const Box: ElementType<BoxProps>;
  export const Paper: ElementType;
}

declare module '@material-ui/core/styles' {
  export interface Theme {
    palette: {
      error: {
        main: string;
      };
      [key: string]: any;
    };
  }
}
