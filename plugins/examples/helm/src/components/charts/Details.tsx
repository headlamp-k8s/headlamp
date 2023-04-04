import { NameValueTable, SectionBox } from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { Link } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useLocation,useParams } from 'react-router-dom';
import { fetchChartDetailFromArtifact } from '../../api/charts';

export default function ChartDetails() {
  const { chartName } = useParams<{ chartName: string }>();
  const location = useLocation();
  const { repoName } = location.state;
  const [chart, setChart] = useState({});
  console.log(chartName, repoName);

  useEffect(() => {
    fetchChartDetailFromArtifact(chartName, repoName).then(response => {
      console.log('response is', response);
      setChart(response);
    });
  }, []);
  console.log('chart is', chart);
  return (
    <SectionBox title={chartName}>
      <NameValueTable
        rows={[
          {
            name: 'Name',
            value: chart.name,
          },
          {
            name: 'Description',
            value: chart.description,
          },
          {
            name: 'URL',
            value: (
              <Link href={chart.home_url} target="_blank">
                {chart.home_url}
              </Link>
            ),
          },
        ]}
      />
    </SectionBox>
  );
}
