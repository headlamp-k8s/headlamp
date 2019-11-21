import Box from '@material-ui/core/Box';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { Label, Pie, PieChart } from 'recharts';
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
  const {
    data,
    size=200,
    dataKey='percentage',
    label='',
    title='',
    legend=null,
    total=100,
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

    const totalValue = {
      name: 'total',
      percentage: (total - filledValue) / total * 100,
      fill: theme.palette.grey['300'],
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
