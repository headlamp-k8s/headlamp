import { Icon } from '@iconify/react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TreeItem from '@material-ui/lab/TreeItem';
import TreeView from '@material-ui/lab/TreeView';
import React from 'react';
import { useTranslation } from 'react-i18next';
import getDocDefinitions from '../../../lib/docs';
import Empty from '../EmptyContent';
import Loader from '../Loader';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    maxWidth: 400,
  },
}));

// @todo: Declare strict types.
function DocsViewer(props: { docSpecs: any }) {
  const { docSpecs } = props;
  const classes = useStyles();
  const [docs, setDocs] = React.useState<
    (
      | {
          data: null;
          error: any;
          kind: string;
        }
      | {
          data: any;
          error: null;
          kind: string;
        }
      | undefined
    )[]
  >([]);
  const [docsLoading, setDocsLoading] = React.useState(false);
  const { t } = useTranslation('resource');

  React.useEffect(() => {
    setDocsLoading(true);
    // fetch docSpecs for all the resources specified
    Promise.allSettled(
      docSpecs.map((docSpec: { apiVersion: string; kind: string }) => {
        return getDocDefinitions(docSpec.apiVersion, docSpec.kind);
      }) as PromiseSettledResult<any>[]
    )
      .then(values => {
        const docSpecsFromApi = values.map((value, index) => {
          if (value.status === 'fulfilled') {
            return {
              data: value.value,
              error: null,
              kind: docSpecs[index].kind,
            };
          } else if (value.status === 'rejected') {
            return {
              data: null,
              error: value.reason,
              kind: docSpecs[index].kind,
            };
          }
        });
        setDocsLoading(false);
        setDocs(docSpecsFromApi);
      })
      .catch(() => {
        setDocsLoading(false);
      });
  }, [docSpecs]);

  function makeItems(name: string, value: any, key: string) {
    return (
      <TreeItem
        key={key}
        nodeId={`${key}`}
        label={
          <div>
            <Typography display="inline">{name}</Typography>&nbsp;
            <Typography display="inline" color="textSecondary" variant="caption">
              ({value.type})
            </Typography>
          </div>
        }
      >
        <Typography color="textSecondary">{value.description}</Typography>
        {Object.entries(value.properties || {}).map(([name, value], i) =>
          makeItems(name, value, `${key}_${i}`)
        )}
      </TreeItem>
    );
  }

  return (
    <>
      {docsLoading ? (
        <Loader title={t('Loading documentation')} />
      ) : (
        docs.map((docSpec: any) => {
          if (!docSpec.error && !docSpec.data) {
            return (
              <Empty>
                {t('No documentation for type {{ docsType }}.', { docsType: docSpec.kind.trim() })}
              </Empty>
            );
          }
          if (docSpec.error) {
            return <Empty color="error">{docSpec.error.message}</Empty>;
          }
          if (docSpec.data) {
            return (
              <Box p={2}>
                <Typography>
                  {t('Showing documentation for: {{ docsType }}', {
                    docsType: docSpec.kind.trim(),
                  })}
                </Typography>
                <TreeView
                  className={classes.root}
                  defaultCollapseIcon={<Icon icon="mdi:chevron-down" />}
                  defaultExpandIcon={<Icon icon="mdi:chevron-right" />}
                >
                  {Object.entries(docSpec.data.properties || {}).map(([name, value], i) =>
                    makeItems(name, value, i.toString())
                  )}
                </TreeView>
              </Box>
            );
          }
        })
      )}
    </>
  );
}

export default DocsViewer;
