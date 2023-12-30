import '../../../i18n/config';
import { Box, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { PercentageCircle, PercentageCircleProps } from '../Chart';
import { TooltipIcon } from '../Tooltip';

const PREFIX = 'TileChart';

const classes = {
  paper: `${PREFIX}-paper`,
  title: `${PREFIX}-title`,
  legend: `${PREFIX}-legend`,
  chartBox: `${PREFIX}-chartBox`,
  tileBox: `${PREFIX}-tileBox`,
};

const StyledPaper = styled(Paper)(({ theme }) => ({
  [`&.${classes.paper}`]: {
    background: theme.palette.squareButton.background,
    padding: theme.spacing(2),
    height: '100%',
    maxWidth: '300px',
  },

  [`& .${classes.title}`]: {
    fontSize: theme.typography.pxToRem(16),
    display: 'inline',
    fontWeight: 600,
  },

  [`& .${classes.legend}`]: {
    fontSize: theme.typography.pxToRem(16),
    display: 'inline',
    fontWeight: 400,
  },

  [`& .${classes.chartBox}`]: {
    maxWidth: '150px',
  },

  [`& .${classes.tileBox}`]: {
    [theme.breakpoints.down('sm')]: {
      flexWrap: 'wrap',
    },
  },
}));

export interface TileChartProps extends Omit<PercentageCircleProps, 'data'> {
  /** Tooltip to display when hovering over the info icon. This info icon is only shown if this property is passed. */
  infoTooltip?: string | null;
  /** Data to display for the chart. */
  data?: PercentageCircleProps['data'] | null;
}

export function TileChart(props: TileChartProps) {
  const { title, infoTooltip = '', legend, total, data, ...others } = props;

  return (
    <StyledPaper className={classes.paper}>
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
    </StyledPaper>
  );
}

export default TileChart;
