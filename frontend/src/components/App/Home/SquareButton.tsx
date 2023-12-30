import { Icon } from '@iconify/react';
import { useTheme } from '@mui/material';
import ButtonBase, { ButtonBaseProps } from '@mui/material/ButtonBase';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

export interface SquareButtonProps extends ButtonBaseProps {
  /** The icon to display for this button. */
  icon: string;
  /** The size of the icon. */
  iconSize?: number;
  /** The color of the icon. */
  iconColor?: string;
  /** The label to display for this button. */
  label: string;
  /** Whether this button has the primary color or not. */
  primary?: boolean;
}

const PREFIX = 'SquareButton';

const classes = {
  root: `${PREFIX}-root`,
  content: `${PREFIX}-content`,
  label: `${PREFIX}-label`,
};

const StyledButtonBase = styled(ButtonBase)(({ theme }) => ({
  [`& .${classes.root}`]: {
    width: 140,
    height: 140,
    paddingTop: '24px',
    backgroundColor: ({ primary }: { primary: boolean }) =>
      primary ? theme.palette.text.primary : theme.palette.squareButton.background,
  },

  [`& .${classes.content}`]: {
    textAlign: 'center',
    paddingTop: 0,
  },

  [`& .${classes.label}`]: {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    display: 'block',
    fontSize: '1rem',
    paddingTop: '8px',
    color: ({ primary }: { primary: boolean }) =>
      primary
        ? theme.palette.getContrastText(theme.palette.text.primary)
        : theme.palette.getContrastText(theme.palette.squareButton.background),
  },
}));

export default function SquareButton(props: SquareButtonProps) {
  const { icon, iconSize = 50, iconColor, label, primary = false, ...otherProps } = props;
  const theme = useTheme();

  return (
    <StyledButtonBase focusRipple {...otherProps}>
      <Card className={classes.root}>
        <CardContent className={classes.content}>
          <Icon
            icon={icon}
            width={iconSize}
            height={iconSize}
            color={
              iconColor ||
              (primary
                ? theme.palette.getContrastText(theme.palette.text.primary)
                : theme.palette.getContrastText(theme.palette.squareButton.background))
            }
          />
          <Typography color="textSecondary" gutterBottom className={classes.label} title={label}>
            {label}
          </Typography>
        </CardContent>
      </Card>
    </StyledButtonBase>
  );
}
