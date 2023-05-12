import { Icon } from '@iconify/react';
import { makeStyles, useTheme } from '@material-ui/core';
import ButtonBase, { ButtonBaseProps } from '@material-ui/core/ButtonBase';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

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

const useStyles = makeStyles(theme => ({
  root: {
    width: 140,
    height: 140,
    paddingTop: '24px',
    backgroundColor: ({ primary }: { primary: boolean }) =>
      primary ? theme.palette.text.primary : theme.palette.squareButton.background,
  },
  content: {
    textAlign: 'center',
    paddingTop: 0,
  },
  label: {
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
  const classes = useStyles({ primary });
  const theme = useTheme();

  return (
    <ButtonBase focusRipple {...otherProps}>
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
    </ButtonBase>
  );
}
