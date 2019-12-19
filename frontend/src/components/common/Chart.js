import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { Bar, BarChart, Label, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Loader from './Loader';

const useStyle = makeStyles(theme => ({
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
  }
}));

export function PercentageCircle(props) {
  const theme = useTheme();
  const classes = useStyle();
  let {
    data,
    size=200,
    dataKey='percentage',
    label='',
    title='',
    legend=null,
    total=100,
    totalProps={}
  } = props;

  const chartSize = size * .8;
  const isLoading = total < 0;

  function formatData() {
    let filledValue = 0;
    const formattedData = data.map(item => {
      filledValue += item.value;

      return {
        percentage: item.value / total * 100,
        ...item
      };
    });

    const totalValue = total === 0 ?
      {
        name: 'total',
        percentage: 100,
        value: total,
        fill: theme.palette.grey['300'],
      }
    :
      {
        name: 'total',
        percentage: (total - filledValue) / total * 100,
        value: total,
        fill: theme.palette.grey['300'],
        ...totalProps
      };

    return formattedData.concat(totalValue);
  }

  return (
    <Box
      justifyContent="center"
      alignItems="center"
      alignContent="center"
      mx="auto"
    >
      {title &&
        <Typography className={classes.title}>{title}</Typography>
      }
      {isLoading ?
        <Loader />
      :
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
            innerRadius={chartSize * .35}
            outerRadius={chartSize * .4}
            dataKey={dataKey}
            // Start at the top
            startAngle={90}
            endAngle={-270}
            fill={theme.palette.primary.main}
          >
            <Label
              cx={chartSize / 2}
              cy={chartSize / 2}
              value={label}
              position="center"
              style={{
                fontSize: `${chartSize * .15}px`,
              }}
            />
          </Pie>
        </PieChart>
      }
      {!isLoading && legend !== null &&
        <Typography className={classes.legend}>{legend}</Typography>
      }
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

export function PercentageBar(props) {
  const classes = useBarStyle();
  const theme = useTheme();

  let {
    data,
    total=100,
    tooltipFunc=null,
  } = props;

  function formatData() {
    let dataItems = {};

    data.forEach(item => {
      dataItems[item.name] = item.value / total * 100;
    });

    return dataItems;
  }

  return (
    <ResponsiveContainer width="95%" height={20} className={classes.container}>
      <BarChart
        layout="vertical"
        maxBarSize={5}
        data={[formatData()]}
        className={classes.chart}
      >
        {tooltipFunc &&
          <Tooltip content={
            <PaperTooltip >
              {tooltipFunc(data)}
            </PaperTooltip>
          }
          />
        }
        <XAxis hide domain={[0, 100]} type="number" />
        <YAxis hide type="category" />
        {data.map((item, index) => {
          return (
            <Bar
              key={index}
              dataKey={item.name}
              stackId="1"
              fill={item.fill ||theme.palette.primary.main}
              layout="vertical"
              background={{fill: theme.palette.grey['300']}}
            />
          );
        })}
      </BarChart>
    </ResponsiveContainer>
  );
}

function PaperTooltip(props) {
  return (
    <Paper className="custom-tooltip">
      <Box m={1}>
        {props.children}
      </Box>
    </Paper>
  );
}
