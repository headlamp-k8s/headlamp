//import { Link as RouterLink,Loader,SectionHeader } from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import {
  Link as RouterLink,
  Loader,
  SectionHeader,
} from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Link,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Autocomplete,Pagination } from '@material-ui/lab';
import { useEffect, useState } from 'react';
//import { jsonToYAML, yamlToJSON } from '../../helpers';
import { fetchChartsFromArtifact } from '../../api/charts';
//import { createRelease } from '../../api/releases';
import { EditorDialog } from './EditorDialog';

export const PAGE_OFFSET_COUNT_FOR_CHARTS = 10;

export function ChartsList() {
  const helmChartCategoryList = [
    { title: 'All', value: 0 },
    { title: 'AI / Machine learning', value: 1 },
    { title: 'Database', value: 2 },
    { title: 'Integration and delivery', value: 3 },
    { title: 'Monitoring and logging', value: 4 },
    { title: 'Networking', value: 5 },
    { title: 'Security', value: 6 },
    { title: 'Storage', value: 7 },
    { title: 'Streaming and messaging', value: 8 },
  ];
  const [charts, setCharts] = useState<any[] | null>(null);
  const [openEditor, setEditorOpen] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [chartsTotalCount, setChartsTotalCount] = useState(0);
  const [chartCategory, setChartCategory] = useState(helmChartCategoryList[0]);
  const [search, setSearch] = useState('');
  const [selectedChartForInstall, setSelectedChartForInstall] = useState<any | null>(null);

  useEffect(() => {
    setCharts(null);
    fetchChartsFromArtifact(search, chartCategory, page).then(response => {
      setCharts(response.packages);
      const facets = response.facets;
      const categoryOptions = facets.find(
        (facet: {
          title: string;
          options: {
            name: string;
            total: number;
          }[];
        }) => facet.title === 'Category'
      ).options;
      if (chartCategory.title === 'All') {
        const totalCount = categoryOptions.reduce(
          (
            acc: number,
            option: {
              name: string;
              total: number;
            }
          ) => acc + option.total,
          0
        );
        setChartsTotalCount(totalCount);
        return;
      }
      const totalCount = categoryOptions.find(
        (option: { name: string; total: number }) => option.name === chartCategory?.title
      ).total;
      setChartsTotalCount(totalCount);
    });
  }, [page, chartCategory, search]);

  useEffect(() => {
    setPage(1);
  }, [chartCategory, search]);

  function Search() {
    return (
      <TextField
        style={{
          width: '20vw',
          margin: '0 1rem',
        }}
        id="outlined-basic"
        label="Search"
        variant="outlined"
        value={search}
        // @todo: Find a better way to handle search autofocus
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        onChange={event => {
          setSearch(event.target.value);
        }}
      />
    );
  }

  function CategoryForCharts() {
    return (
      <Autocomplete
        style={{
          width: '20vw',
        }}
        options={helmChartCategoryList}
        getOptionLabel={option => option.title}
        defaultValue={helmChartCategoryList[0]}
        value={chartCategory}
        onChange={(event, newValue) => {
          // @ts-ignore
          setChartCategory(newValue);
        }}
        renderInput={params => (
          <TextField {...params} variant="outlined" label="Categories" placeholder="Favorites" />
        )}
      />
    );
  }

  return (
    <>
      <EditorDialog
        openEditor={openEditor}
        chart={selectedChartForInstall}
        handleEditor={(open: boolean) => setEditorOpen(open)}
      />
      <SectionHeader title="Helm Charts" actions={[<Search />, <CategoryForCharts />]} />
      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="space-between"
        width="70vw"
        alignContent="start"
      >
        {!charts ? (
          <Loader title="" />
        ) : charts.length === 0 ? (
          <Box mt={2} mx={2}>
            <Typography variant="h5" component="h2">
              {`No charts found for ${
                search ? `search term: ${search}` : `category: ${chartCategory.title}`
              }`}
            </Typography>
          </Box>
        ) : (
          charts.map(chart => {
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
                      height: '32vh',
                      overflow: 'hidden',
                    }}
                  >
                    <Typography component="h5" variant="h5">
                      <RouterLink
                        routeName="/helm/:repoName/charts/:chartName"
                        params={{
                          chartName: chart.name,
                          repoName: chart.repository.name,
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
                    <Box my={2}>
                      <Typography>
                        {chart?.description?.slice(0, 110)}
                        <Tooltip title={chart?.description}>
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
                        onClick={() => {
                          setSelectedChartForInstall(chart);
                          setEditorOpen(true);
                        }}
                      >
                        Install
                      </Button>
                      <Box ml={4}>
                        <Link href={chart?.repository?.url} target="_blank">
                          Learn More
                        </Link>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            );
          })
        )}
      </Box>
      {charts && charts.length !== 0 && (
        <Box
          style={{
            margin: '0 auto',
            width: '50%',
          }}
        >
          <Pagination
            size="large"
            variant="outlined"
            shape="rounded"
            page={page}
            count={Math.floor(chartsTotalCount / PAGE_OFFSET_COUNT_FOR_CHARTS)}
            color="primary"
            onChange={(e, page: number) => {
              setPage(page);
            }}
          />
        </Box>
      )}
    </>
  );
}
