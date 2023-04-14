import { Router } from '@kinvolk/headlamp-plugin/lib';
import {
  Loader,
  NameValueTable,
  SectionBox,
  SectionHeader,
} from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { Box, Button, Link } from '@material-ui/core';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useParams } from 'react-router';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { fetchChartDetailFromArtifact } from '../../api/charts';
import { EditorDialog } from './EditorDialog';

const { createRouteURL } = Router;
export default function ChartDetails() {
  const { chartName, repoName } = useParams<{ chartName: string; repoName: string }>();
  const [chart, setChart] = useState<{
    name: string;
    description: string;
    logo_image_id: string;
    readme: string;
    app_version: string;
    maintainers: Array<{ name: string; email: string }>;
    home_url: string;
    package_id: string;
    version: string;
  } | null>(null);
  const [openEditor, setOpenEditor] = useState(false);

  useEffect(() => {
    fetchChartDetailFromArtifact(chartName, repoName).then(response => {
      setChart(response);
    });
  }, [chartName, repoName]);

  return (
    <>
      <EditorDialog
        openEditor={openEditor}
        chart={chart}
        handleEditor={open => {
          setOpenEditor(open);
        }}
      />
      <SectionBox
        title={
          <SectionHeader
            title={chartName}
            actions={[
              <Button
                style={{
                  backgroundColor: '#000',
                  color: 'white',
                  textTransform: 'none',
                }}
                onClick={() => {
                  setOpenEditor(true);
                }}
              >
                Install
              </Button>,
            ]}
          />
        }
        backLink={createRouteURL('Charts')}
      >
        {!chart ? (
          <Loader title="" />
        ) : (
          <NameValueTable
            rows={[
              {
                name: 'Name',
                value: (
                  <Box display="flex" alignItems="center">
                    <Box mr={1}>
                      <img
                        src={`https://artifacthub.io/image/${chart.logo_image_id}`}
                        width="25"
                        height="25"
                        alt={chart.name}
                      />
                    </Box>
                    <Box>{chart.name}</Box>
                  </Box>
                ),
              },
              {
                name: 'Description',
                value: (
                  <Box overflow="auto" width="80%">
                    {chart.description}
                  </Box>
                ),
              },
              {
                name: 'App Version',
                value: chart.app_version,
              },
              {
                name: 'Maintainers',
                value: chart?.maintainers?.map(maintainer => (
                  <Box display="flex" alignItems="center" mt={1}>
                    <Box mr={1}>{maintainer.name}</Box>
                    <Box>{maintainer.email}</Box>
                  </Box>
                )),
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
        )}
      </SectionBox>
      <SectionBox title="Readme">
        {!chart ? (
          <Loader title="" />
        ) : (
          <ReactMarkdown
            style={{
              padding: '1rem',
            }}
            children={chart.readme}
            components={{
              // @ts-ignore
              a: Link,
              // @ts-ignore
              pre: ({ node, inline, className, children, ...props }) => {
                console.log(node);
                return (
                  !inline && (
                    <pre {...props} className={className}>
                      <Box display="block" width="64vw" my={0.5}>
                        {children}
                      </Box>
                    </pre>
                  )
                );
              },
              code({ node, inline, className, children, ...props }) {
                console.log(node);
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    children={String(children).replace(/\n$/, '')}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  />
                ) : (
                  <code
                    className={className}
                    {...props}
                    style={{
                      overflow: 'auto',
                      width: '10vw',
                      display: 'block',
                    }}
                  >
                    {children}
                  </code>
                );
              },
            }}
          />
        )}
      </SectionBox>
    </>
  );
}
