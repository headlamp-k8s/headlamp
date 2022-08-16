import '../../../i18n/config';
import { Box, Paper, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { PercentageCircle, PercentageCircleProps } from '../Chart';
import { TooltipIcon } from '../Tooltip';

export interface TileChartProps extends Omit<PercentageCircleProps, 'data'> {
  /** Tooltip to display when hovering over the info icon. This info icon is only shown if this property is passed. */
  infoTooltip?: string | null;
  /** Data to display for the chart. */
  data?: PercentageCircleProps['data'] | null;
}

const useStyles = makeStyles(theme => ({
  paper: {
    background: theme.palette.squareButton.background,
    padding: theme.spacing(2),
    height: '100%',
    maxWidth: '300px',
  },
  title: {
    fontSize: theme.typography.pxToRem(16),
    display: 'inline',
    fontWeight: 600,
  },
  legend: {
    fontSize: theme.typography.pxToRem(16),
    display: 'inline',
    fontWeight: 400,
  },
  chartBox: {
    maxWidth: '150px',
  },
  tileBox: {
    [theme.breakpoints.down('sm')]: {
      flexWrap: 'wrap',
    },
  },
}));

export function TileChart(props: TileChartProps) {
  const { title, infoTooltip = '', legend, total, data, ...others } = props;
  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <Box display="flex" className={classes.tileBox}>
        <Box flexGrow={1} width="100%">
          <Box>
            <Typography className={classes.title} gutterBottom>
              {title || ''}
            </Typography>
            {infoTooltip && <TooltipIcon>{infoTooltip}</TooltipIcon>}
          </Box>
          <Typography className={classes.legend} gutterBottom>
            {legend || ''}
          </Typography>
        </Box>
        <Box>
          {!!data && (
            <PercentageCircle data={data} total={total} size={140} thickness={11} {...others} />
          )}
        </Box>
      </Box>
    </Paper>
  );
}

export default TileChart;
