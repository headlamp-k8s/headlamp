import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  FormControlLabel,
  TextField,
} from '@material-ui/core';
import MonacoEditor from '@monaco-editor/react';
import { useState } from 'react';
import { jsonToYAML } from '../../helpers';

export function EditorDialog(props: {
  openEditor: boolean;
  handleEditor: (open: boolean) => void;
  releaseName: string;
  releaseNamespace: string;
  release: any;
}) {
  const { openEditor, handleEditor, releaseName, releaseNamespace, release } = props;
  const themeName = localStorage.getItem('headlampThemePreference');
  if (!release) return null;

  const [valuesToShow, setValuesToShow] = useState(
    Object.assign({}, release.chart.values, release.config)
  );
  const [isUserValues, setIsUserValues] = useState(false);

  function handleValueChange(event: any) {
    if (event.target.checked) {
      setValuesToShow(release.config);
    } else {
      setValuesToShow(Object.assign({}, release.chart.values, release.config));
    }
    setIsUserValues(event.target.checked);
  }

  return (
    <Dialog open={openEditor} maxWidth="lg" fullWidth>
      <Box display="flex" p={2}>
        <Box mr={2}>
          <TextField
            id="release-name"
            disabled
            style={{
              width: '20vw',
            }}
            variant="filled"
            label="Release Name"
            value={releaseName}
          />
        </Box>
        <Box>
          <TextField
            id="release-namespace"
            disabled
            style={{
              width: '20vw',
            }}
            variant="filled"
            label="Release Namespace"
            value={releaseNamespace}
          />
        </Box>
      </Box>
      <Box ml={2}>
        <FormControlLabel
          control={
            <Checkbox
              checked={isUserValues}
              onChange={handleValueChange}
              inputProps={{ 'aria-label': 'Switch between default and user defined values' }}
            />
          }
          label="user defined values only"
        />
      </Box>
      <Box pt={2} height="100%" my={1} p={1}>
        <MonacoEditor
          value={jsonToYAML(valuesToShow)}
          language="yaml"
          height="500px"
          options={{
            selectOnLineNumbers: true,
          }}
          theme={themeName === 'dark' ? 'vs-dark' : 'light'}
          onMount={editor => {
            editor.updateOptions({ readOnly: true });
          }}
        />
      </Box>
      <DialogActions
        style={{
          padding: 0,
          margin: '0 0.5rem',
        }}
      >
        <Button
          style={{
            backgroundColor: '#000',
            color: 'white',
            textTransform: 'none',
          }}
          onClick={() => handleEditor(false)}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
