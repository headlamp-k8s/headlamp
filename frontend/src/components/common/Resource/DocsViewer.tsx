import { Icon } from '@iconify/react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TreeItem from '@material-ui/lab/TreeItem';
import TreeView from '@material-ui/lab/TreeView';
import _ from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
import getDocDefinitions from '../../../lib/docs';
import Empty from '../EmptyContent';
import Loader from '../Loader';

const useStyles = makeStyles(() => ({
  root: {
    height: 216,
    flexGrow: 1,
    maxWidth: 400,
  },
}));

// @todo: Declare strict types.
function DocsViewer(props: { docSpecs: any }) {
  const { docSpecs } = props;
  const classes = useStyles();
  const [docs, setDocs] = React.useState<object | null>(null);
  const [docsError, setDocsError] = React.useState<string | null>(null);
  const { t } = useTranslation('resource');

  React.useEffect(() => {
    setDocsError(null);

    if (docSpecs.error) {
      t('Cannot load documentation: {{ docsError }}', { docsError: docSpecs.error });
      return;
    }
    if (!docSpecs.apiVersion || !docSpecs.kind) {
      setDocsError(
        t(
          'Cannot load documentation: Please make sure the YAML is valid and has the kind and apiVersion set.'
        )
      );
      return;
    }

    getDocDefinitions(docSpecs.apiVersion, docSpecs.kind)
      .then(result => {
        setDocs(result?.properties || {});
      })
      .catch(err => {
        setDocsError(t('Cannot load documentation: {{err}}', { err }));
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

  return docs === null && docsError === null ? (
    <Loader title={t('Loading documentation')} />
  ) : !_.isEmpty(docsError) ? (
    <Empty color="error">{docsError}</Empty>
  ) : _.isEmpty(docs) ? (
    <Empty>
      {t('No documentation for type {{ docsType }}.', { docsType: docSpecs.kind.trim() })}
    </Empty>
  ) : (
    <Box p={4}>
      <Typography>
        {t('Showing documentation for: {{ docsType }}', {
          docsType: docSpecs.kind.trim(),
        })}
      </Typography>
      <TreeView
        className={classes.root}
        defaultCollapseIcon={<Icon icon="mdi:chevron-down" />}
        defaultExpandIcon={<Icon icon="mdi:chevron-right" />}
      >
        {Object.entries(docs || {}).map(([name, value], i) => makeItems(name, value, i.toString()))}
      </TreeView>
    </Box>
  );
}

export default DocsViewer;
