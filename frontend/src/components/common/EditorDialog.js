import chevronDown from '@iconify/icons-mdi/chevron-down';
import chevronRight from '@iconify/icons-mdi/chevron-right';
import { Icon } from '@iconify/react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TreeItem from '@material-ui/lab/TreeItem';
import TreeView from '@material-ui/lab/TreeView';
import _ from 'lodash';
import React from 'react';
import MonacoEditor from 'react-monaco-editor';
import yaml from 'yaml';
import getDocDefinitions from '../../lib/docs';
import ConfirmButton from './ConfirmButton';
import Empty from './EmptyContent';
import Loader from './Loader';
import Tabs from './Tab';

const useStyle = makeStyles(theme => ({
  dialogContent: {
    height: '80%',
    minHeight: '600px',
    overflowY: 'hidden',
  },
  terminalCode: {
    color: theme.palette.common.white,
  },
  terminal: {
    backgroundColor: theme.palette.common.black,
    height: '500px',
    width: '100%',
    overflow: 'scroll',
    marginTop: theme.spacing(3),
  },
  containerFormControl: {
    minWidth: '11rem',
  },
  scrollable: {
    overflowY: 'auto',
    overflowX: 'hidden',
  },
}));

export default function EditorDialog(props) {
  const { item, onClose, onSave, ...other } = props;
  const editorOptions = {
    selectOnLineNumbers: true
  };
  const classes = useStyle();
  const originalCode = yaml.stringify(item);
  const [code, setCode] = React.useState(originalCode);
  const [error, setError] = React.useState('');
  const [docSpecs, setDocSpecs] = React.useState({});

  function onChange(newValue, e) {
    setCode(newValue);

    if (error && getObjectFromCode(newValue)) {
      setError('');
    }
  }

  function getObjectFromCode(code) {
    let codeObj = {};
    try {
      codeObj = yaml.parse(code);
    } catch (e) {
      codeObj = null;
    }

    return codeObj;
  }

  function handleTabChange(tabIndex) {
    // Check if the docs tab has been selected.
    if (tabIndex !== 1) {
      return;
    }

    const codeObj = getObjectFromCode(code);

    const {kind, apiVersion} = codeObj || {};
    if (codeObj === null || (!!kind && !!apiVersion)) {
      setDocSpecs({
        error: codeObj === null,
        kind,
        apiVersion
      });
    }
  }

  function onUndo() {
    setCode(originalCode);
  }

  function handleSave() {
    // Verify the YAML even means anything before trying to use it.
    if (!getObjectFromCode(code)) {
      setError("Error parsing the code. Please verify it's valid YAML!");
      return;
    }

    onSave(getObjectFromCode(code));
  }

  return (
    <Dialog
      maxWidth="lg"
      scroll="paper"
      fullWidth
      onBackdropClick={onClose}
      className={classes.dialog}
      {...other}
    >
      <DialogTitle>Edit: {item.metadata.name}</DialogTitle>
      <DialogContent
        className={classes.dialogContent}
      >
        <Tabs
          onTabChanged={handleTabChange}
          tabProps={{
            centered: true,
          }}
          tabs={[
            {
              label: 'Editor',
              component:
  <Box paddingTop={2} height="100%">
    <MonacoEditor
      language="yaml"
      theme="vs-dark"
      value={code}
      options={editorOptions}
      onChange={onChange}
      height="600"
      // editorDidMount={this.editorDidMount}
    />
  </Box>
            },
            {
              label: 'Documentation',
              component:
  <Box p={2} className={classes.scrollable} height="600px">
    <DocsViewer
      docSpecs={docSpecs}
    />
  </Box>
            },
          ]}
        />
      </DialogContent>
      <DialogActions>
        <ConfirmButton
          disabled={originalCode == code}
          color="secondary"
          aria-label="undo"
          onConfirm={onUndo}
          confirmTitle="Are you sure?"
          confirmDescription="This will discard your changes in the editor. Do you want to proceed?"
        >
          Undo Changes
        </ConfirmButton>
        <div style={{flex: '1 0 0'}} />
        { error &&
          <Typography color="error">{error}</Typography>
        }
        <div style={{flex: '1 0 0'}} />
        <Button
          onClick={onClose}
          color="primary"
          autoFocus
        >
          Close
        </Button>
        <Button
          onClick={handleSave}
          color="primary"
          disabled={originalCode == code || !!error}
        >
          Save &amp; Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    height: 216,
    flexGrow: 1,
    maxWidth: 400,
  },
}));

function DocsViewer(props) {
  const { docSpecs } = props;
  const classes = useStyles();
  const [docs, setDocs] = React.useState(null);

  React.useEffect(() => {
    if (!docSpecs.apiVersion || !docSpecs.kind) {
      return;
    }

    getDocDefinitions(docSpecs.apiVersion, docSpecs.kind)
      .then(result => {
        setDocs(result ? result.properties : {});
      });
  },
  [docSpecs]);

  function makeItems(name, value, key) {
    return (
      <TreeItem
        key={key}
        nodeId={`${key}`}
        label={
          <div>
            <Typography display="inline">{name}</Typography>&nbsp;
            <Typography
              display="inline"
              color="textSecondary"
              variant="caption"
            >
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
    docSpecs.error ?
      <Empty>Error getting documentation! Please make sure the YAML is valid and has the kind and apiVersion set.</Empty>
      : docs === null ?
        <Loader />
        : _.isEmpty(docs) ?
          <Empty>No documentation for type {docSpecs.kind.trim()}.</Empty>
          :
          <Box p={4}>
            <Typography>Showing documentation for: {docSpecs.kind.trim()}</Typography>
            <TreeView
              className={classes.root}
              defaultCollapseIcon={<Icon icon={chevronDown} />}
              defaultExpandIcon={<Icon icon={chevronRight} />}
            >
              {Object.entries(docs).map(([name, value], i) => makeItems(name, value, i))}
            </TreeView>
          </Box>
  );
}
