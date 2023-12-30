import { Icon } from '@iconify/react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { TreeView } from '@mui/x-tree-view/TreeView';
import * as buffer from 'buffer';
import React from 'react';
import { useTranslation } from 'react-i18next';
import getDocDefinitions from '../../../lib/docs';
import Empty from '../EmptyContent';
import Loader from '../Loader';

const PREFIX = 'DocsViewer';

const classes = {
  root: `${PREFIX}-root`,
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')(() => ({
  [`& .${classes.root}`]: {
    flexGrow: 1,
    maxWidth: 400,
  },
}));

// Buffer class is not polyffiled with CRA(v5) so we manually do it here
window.Buffer = buffer.Buffer;

// @todo: Declare strict types.
function DocsViewer(props: { docSpecs: any }) {
  const { docSpecs } = props;

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
  const { t } = useTranslation();

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
    <Root>
      {docsLoading ? (
        <Loader title={t('Loading documentation')} />
      ) : (
        docs.map((docSpec: any, idx: number) => {
          if (!docSpec.error && !docSpec.data) {
            return (
              <Empty key={`empty_msg_${idx}`}>
                {t('No documentation for type {{ docsType }}.', {
                  docsType: docSpec?.kind?.trim() || '""',
                })}
              </Empty>
            );
          }
          if (docSpec.error) {
            return (
              <Empty color="error" key={`empty_msg_${idx}`}>
                {docSpec.error.message}
              </Empty>
            );
          }
          if (docSpec.data) {
            return (
              <Box p={2} key={`docs_${idx}`}>
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
    </Root>
  );
}

export default DocsViewer;
