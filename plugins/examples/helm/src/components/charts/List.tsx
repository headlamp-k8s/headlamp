import { Box, Card, CardContent, CardMedia, Divider,Grid, Typography } from '@material-ui/core';
import { useEffect,useState } from 'react';
import { fetchChartsFromArtifact } from '../../api/charts';

export function ChartsList() {
  const [charts, setCharts] = useState([]);

  useEffect(() => {
    fetchChartsFromArtifact().then(response => {
      console.log('response from artifact hub is', response);
      setCharts(response.packages);
    });
  }, []);

  return (
    <Grid container spacing={1} justifyContent="space-between" alignItems="stretch">
      {charts.map(chart => {
        return (
          <Grid item xs={4}>
            <Card>
              <CardMedia
                image={`https://artifacthub.io/image/${chart.logo_image_id}`}
                style={{
                  width: 60,
                  height: 60,
                  margin: '1rem',
                }}
              />
              <CardContent>
                <Typography component="h5" variant="h5">
                  {chart.name}
                </Typography>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography>v{chart.version}</Typography>
                  <Box>
                    <Typography>{chart.name}</Typography>
                  </Box>
                </Box>
                <Divider />
                <Typography noWrap>{chart.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}
