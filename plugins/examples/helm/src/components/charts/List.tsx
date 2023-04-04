import { Link as RouterLink,SectionHeader } from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Link,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { useEffect, useState } from 'react';
import { fetchChartsFromArtifact } from '../../api/charts';

export function ChartsList() {
  const [charts, setCharts] = useState([]);

  useEffect(() => {
    fetchChartsFromArtifact().then(response => {
      setCharts(response.packages);
    });
  }, []);

  return (
    <>
      <SectionHeader title="Helm Charts" />
      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="space-between"
        width="70vw"
        alignContent="start"
      >
        {charts.map(chart => {
          return (
            <Box width="30%" m={1}>
              <Card>
                <CardMedia
                  image={`https://artifacthub.io/image/${chart.logo_image_id}`}
                  style={{
                    width: 60,
                    height: 60,
                    margin: '1rem',
                  }}
                />
                <CardContent
                  style={{
                    margin: '1rem 0rem',
                    height: '25vh',
                    overflow: 'auto',
                  }}
                >
                  <Typography component="h5" variant="h5">
                    <RouterLink
                      state={{
                        repoName: chart.repository.name,
                      }}
                      routeName="/helm/charts/:chartName"
                      params={{
                        chartName: chart.name,
                      }}
                    >
                      {chart.name}
                    </RouterLink>
                  </Typography>
                  <Box display="flex" justifyContent="space-between" my={1}>
                    <Typography>v{chart.version}</Typography>
                    <Box>
                      <Typography>{chart.name}</Typography>
                    </Box>
                  </Box>
                  <Divider />
                  <Box mt={2} height="10vh">
                    <Typography>
                      {chart.description.slice(0, 150)}
                      <Tooltip title={chart.description}>
                        <span>...</span>
                      </Tooltip>
                    </Typography>
                  </Box>
                  <Box mt={2} ml={-1} display="flex" alignItems="center">
                    <Button
                      style={{
                        backgroundColor: '#000',
                        color: 'white',
                        textTransform: 'none',
                      }}
                    >
                      Install
                    </Button>
                    <Box ml={4}>
                      <Link href={chart.repository.url} target="_blank">
                        Learn More
                      </Link>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          );
        })}
      </Box>
    </>
  );
}
