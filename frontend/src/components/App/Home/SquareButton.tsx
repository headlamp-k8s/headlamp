import { Icon } from '@iconify/react';
import { useTheme } from '@mui/material';
import ButtonBase, { ButtonBaseProps } from '@mui/material/ButtonBase';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
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

export default function SquareButton(props: SquareButtonProps) {
  const { icon, iconSize = 50, iconColor, label, primary = false, ...otherProps } = props;
  const theme = useTheme();

  return (
    <ButtonBase focusRipple {...otherProps}>
      <Card
        variant="outlined"
        sx={{
          width: 140,
          height: 140,
          paddingTop: '24px',
          backgroundColor: primary ? 'text.primary' : theme.palette.background.muted,
        }}
      >
        <CardContent sx={{ textAlign: 'center', paddingTop: 0 }}>
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
          <Typography
            color="textSecondary"
            gutterBottom
            title={label}
            sx={{
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              display: 'block',
              fontSize: '1rem',
              paddingTop: '8px',
              color: primary
                ? theme.palette.getContrastText(theme.palette.text.primary)
                : theme.palette.getContrastText(theme.palette.squareButton.background),
            }}
          >
            {label}
          </Typography>
        </CardContent>
      </Card>
    </ButtonBase>
  );
}
