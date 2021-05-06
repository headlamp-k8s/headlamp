import chevronDown from '@iconify/icons-mdi/chevron-down';
import chevronRight from '@iconify/icons-mdi/chevron-right';
import { Icon } from '@iconify/react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TreeItem from '@material-ui/lab/TreeItem';
import TreeView from '@material-ui/lab/TreeView';
import * as yaml from 'js-yaml';
import _ from 'lodash';
import React from 'react';
import getDocDefinitions from '../../../lib/docs';
import Empty from '../EmptyContent';
import Loader from '../Loader';

const useStyles = makeStyles(theme => ({
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

  React.useEffect(() => {
    setDocsError(null);

    if (docSpecs.error) {
      setDocsError(`Cannot load documentation: ${docSpecs.error}`);
      return;
    }
    if (!docSpecs.apiVersion || !docSpecs.kind) {
      setDocsError(
        'Cannot load documentation: Please make sure the YAML is valid and has the kind and apiVersion set.'
      );
      return;
    }

    getDocDefinitions(docSpecs.apiVersion, docSpecs.kind)
      .then(result => {
        setDocs(result?.properties || {});
      })
      .catch(err => {
        setDocsError(`Cannot load documentation: ${err}`);
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
    <Loader />
  ) : !_.isEmpty(docsError) ? (
    <Empty color="error">{docsError}</Empty>
  ) : _.isEmpty(docs) ? (
    <Empty>No documentation for type {docSpecs.kind.trim()}.</Empty>
  ) : (
    <Box p={4}>
      <Typography>Showing documentation for: {docSpecs.kind.trim()}</Typography>
      <TreeView
        className={classes.root}
        defaultCollapseIcon={<Icon icon={chevronDown} />}
        defaultExpandIcon={<Icon icon={chevronRight} />}
      >
        {Object.entries(docs || {}).map(([name, value], i) => makeItems(name, value, i.toString()))}
      </TreeView>
    </Box>
  );
}

export default DocsViewer;
