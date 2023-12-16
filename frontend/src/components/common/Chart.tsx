import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import {
  Bar,
  BarChart,
  Label,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import Loader from './Loader';

const useStyle = makeStyles(() => ({
  title: {
    textAlign: 'center',
    fontSize: '1.2em',
    flexGrow: 1,
    fontWeight: 'bold',
  },
  legend: {
    textAlign: 'center',
    fontSize: '1.1em',
    flexGrow: 1,
  },
  chart: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}));

export interface ChartDataPoint {
  name: string;
  value: number;
  fill?: string;
}

export interface PercentageCircleProps {
  data: ChartDataPoint[];
  size?: number;
  dataKey?: string;
  label?: string | null;
  title?: string | null;
  legend?: string | null;
  total?: number;
  totalProps?: {
    [propName: string]: any;
  };
  thickness?: number;
}

export function PercentageCircle(props: PercentageCircleProps) {
  const theme = useTheme();
  const classes = useStyle();
  const {
    data,
    size = 200,
    dataKey = 'percentage',
    label = '',
    title = '',
    legend = null,
    total = 100,
    totalProps = {},
    thickness = 16,
  } = props;

  const chartSize = size * 0.8;
  const isLoading = total < 0;

  function formatData() {
    let filledValue = 0;
    const formattedData = data.map(item => {
      filledValue += item.value;

      return {
        percentage: (item.value / total) * 100,
        ...item,
      };
    });

    const totalValue =
      total === 0
        ? {
            name: 'total',
            percentage: 100,
            value: total,
            fill: theme.palette.chartStyles.defaultFillColor,
          }
        : {
            name: 'total',
            percentage: ((total - filledValue) / total) * 100,
            value: total,
            fill: theme.palette.chartStyles.defaultFillColor,
            ...totalProps,
          };

    return formattedData.concat(totalValue);
  }

  return (
    <Box
      aria-busy={isLoading}
      aria-live="polite"
      justifyContent="center"
      alignItems="center"
      alignContent="center"
      mx="auto"
    >
      {title && <Typography className={classes.title}>{title}</Typography>}
      {isLoading ? (
        <Loader title={`Loading data for ${title}`} />
      ) : (
        <PieChart
          cx={size / 2}
          cy={size / 2}
          width={chartSize}
          height={chartSize}
          className={classes.chart}
        >
          <Pie
            data={formatData()}
            // Center the chart
            cx={chartSize / 2}
            cy={chartSize / 2}
            innerRadius={chartSize * 0.4 - thickness}
            outerRadius={chartSize * 0.4}
            dataKey={dataKey}
            // Start at the top
            startAngle={90}
            endAngle={-270}
            stroke={theme.palette.chartStyles.defaultFillColor}
            fill={theme.palette.chartStyles.fillColor || theme.palette.common.black}
          >
            <Label
              value={label || ''}
              position="center"
              style={{
                fontSize: `${chartSize * 0.15}px`,
                fill: theme.palette.chartStyles.labelColor,
              }}
            />
          </Pie>
        </PieChart>
      )}
      {!isLoading && legend !== null && (
        <Typography className={classes.legend}>{legend}</Typography>
      )}
    </Box>
  );
}

const useBarStyle = makeStyles(theme => ({
  chart: {
    zIndex: theme.zIndex.drawer,
  },
  container: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}));

export interface PercentageBarProps {
  data: ChartDataPoint[];
  total?: number;
  tooltipFunc?: ((data: any) => JSX.Element | string) | null;
}

export function PercentageBar(props: PercentageBarProps) {
  const classes = useBarStyle();
  const theme = useTheme();

  const { data, total = 100, tooltipFunc = null } = props;

  function formatData() {
    const dataItems: { [name: string]: number } = {};

    data.forEach(item => {
      dataItems[item.name] = (item.value / total) * 100;
    });

    return dataItems;
  }

  return (
    <ResponsiveContainer width="95%" height={20} className={classes.container}>
      <BarChart layout="vertical" maxBarSize={5} data={[formatData()]} className={classes.chart}>
        {tooltipFunc && <Tooltip content={<PaperTooltip>{tooltipFunc(data)}</PaperTooltip>} />}
        <XAxis hide domain={[0, 100]} type="number" />
        <YAxis hide type="category" />
        {data.map((item, index) => {
          return (
            <Bar
              key={index}
              dataKey={item.name}
              stackId="1"
              fill={item.fill || theme.palette.primary.main}
              layout="vertical"
              background={{ fill: theme.palette.grey['300'] }}
            />
          );
        })}
      </BarChart>
    </ResponsiveContainer>
  );
}

function PaperTooltip(props: React.PropsWithChildren<{}>) {
  return (
    <Paper className="custom-tooltip">
      <Box m={1}>{props.children}</Box>
    </Paper>
  );
}
