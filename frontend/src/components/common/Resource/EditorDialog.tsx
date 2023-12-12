import '../../../i18n/config';
import Editor, { loader } from '@monaco-editor/react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import * as yaml from 'js-yaml';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { KubeObjectInterface } from '../../../lib/k8s/cluster';
import { getThemeName } from '../../../lib/themes';
import { useId } from '../../../lib/util';
import ConfirmButton from '../ConfirmButton';
import { Dialog, DialogProps } from '../Dialog';
import Loader from '../Loader';
import Tabs from '../Tabs';
import DocsViewer from './DocsViewer';
import SimpleEditor from './SimpleEditor';

// Jest does not work with esm modules and 'monaco-editor' properly
// It says it can't find the module when running the tests.
let monaco: any;
if (process.env.NODE_ENV === 'test') {
  monaco = require('monaco-editor/esm/vs/editor/editor.api.js');
} else {
  // const monaco = monacoEditor;
  monaco = require('monaco-editor');
}

const useStyle = makeStyles(theme => ({
  dialogContent: {
    height: '80%',
    // minHeight: '600px',
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

type KubeObjectIsh = Partial<KubeObjectInterface>;

export interface EditorDialogProps extends DialogProps {
  /** The object to edit, or null to make the dialog be in "loading mode". Pass it an empty object if no contents are to be shown when the dialog is first open. */
  item: KubeObjectIsh | null;
  /** Called when the dialog is closed. */
  onClose: () => void;
  /** Called when the user clicks the save button. */
  onSave: ((...args: any[]) => void) | null;
  /** Called when the editor's contents change. */
  onEditorChanged?: ((newValue: string) => void) | null;
  /** The label to use for the save button. */
  saveLabel?: string;
  /** The error message to display. */
  errorMessage?: string;
  /** The dialog title. */
  title?: string;
}

export default function EditorDialog(props: EditorDialogProps) {
  const { item, onClose, onSave, onEditorChanged, saveLabel, errorMessage, title, ...other } =
    props;
  const editorOptions = {
    selectOnLineNumbers: true,
    readOnly: isReadOnly(),
  };
  const { i18n } = useTranslation();
  const [lang, setLang] = React.useState(i18n.language);
  const classes = useStyle();
  const themeName = getThemeName();

  const originalCodeRef = React.useRef({ code: '', format: item ? 'yaml' : '' });
  const [code, setCode] = React.useState(originalCodeRef.current);
  const codeRef = React.useRef(code);
  const lastCodeCheckHandler = React.useRef(0);
  const previousVersionRef = React.useRef(item?.metadata?.resourceVersion || '');
  const [error, setError] = React.useState('');
  const [docSpecs, setDocSpecs] = React.useState<
    KubeObjectInterface | KubeObjectInterface[] | null
  >([]);
  const { t } = useTranslation();

  const [useSimpleEditor, setUseSimpleEditorState] = React.useState(() => {
    const localData = localStorage.getItem('useSimpleEditor');
    return localData ? JSON.parse(localData) : false;
  });

  function setUseSimpleEditor(data: boolean) {
    localStorage.setItem('useSimpleEditor', JSON.stringify(data));
    setUseSimpleEditorState(data);
  }

  // Update the code when the item changes, but only if the code hasn't been touched.
  React.useEffect(() => {
    if (!item || Object.keys(item || {}).length === 0) {
      return;
    }

    const originalCode = originalCodeRef.current.code;
    const itemCode =
      originalCodeRef.current.format === 'json' ? JSON.stringify(item) : yaml.dump(item);
    if (itemCode !== originalCodeRef.current.code) {
      originalCodeRef.current = { code: itemCode, format: originalCodeRef.current.format };
    }

    if (!item.metadata) {
      return;
    }

    const resourceVersionsDiffer =
      (previousVersionRef.current || '') !== (item.metadata!.resourceVersion || '');
    // Only change if the code hasn't been touched.
    // We use the codeRef in this effect instead of the code, because we need to access the current
    // state of the code but we don't want to trigger a re-render when we set the code here.
    if (resourceVersionsDiffer || codeRef.current.code === originalCode) {
      // Prevent updating to the same code, which would lead to an infinite loop.
      if (codeRef.current.code !== itemCode) {
        setCode({ code: itemCode, format: originalCodeRef.current.format });
      }

      if (resourceVersionsDiffer && !!item.metadata!.resourceVersion) {
        previousVersionRef.current = item.metadata!.resourceVersion;
      }
    }
  }, [item]);

  React.useEffect(() => {
    codeRef.current = code;
  }, [code]);

  React.useEffect(() => {
    i18n.on('languageChanged', setLang);
    return () => {
      // Stop the timeout from trying to use the component after it's been unmounted.
      clearTimeout(lastCodeCheckHandler.current);

      i18n.off('languageChanged', setLang);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function isReadOnly() {
    return onSave === null;
  }

  function looksLikeJson(code: string) {
    const trimmedCode = code.trimLeft();
    const firstChar = !!trimmedCode ? trimmedCode[0] : '';
    if (['{', '['].includes(firstChar)) {
      return true;
    }
    return false;
  }

  function onChange(value: string | undefined): void {
    // Clear any ongoing attempts to check the code.
    window.clearTimeout(lastCodeCheckHandler.current);

    // Only check the code for errors after the user has stopped typing for a moment.
    lastCodeCheckHandler.current = window.setTimeout(() => {
      const { error: err, format } = getObjectsFromCode({
        code: value || '',
        format: originalCodeRef.current.format,
      });
      if (code.format !== format) {
        setCode(currentCode => ({ code: currentCode.code || '', format }));
      }

      if (error !== (err?.message || '')) {
        setError(err?.message || '');
      }
    }, 500); // ms

    setCode(currentCode => ({ code: value as string, format: currentCode.format }));

    if (onEditorChanged) {
      onEditorChanged(value as string);
    }
  }

  function getObjectsFromCode(codeInfo: typeof originalCodeRef.current): {
    obj: KubeObjectInterface[] | null;
    format: string;
    error: Error | null;
  } {
    const { code, format } = codeInfo;
    const res: { obj: KubeObjectInterface[] | null; format: string; error: Error | null } = {
      obj: null,
      format,
      error: null,
    };

    if (!format || (!res.obj && looksLikeJson(code))) {
      res.format = 'json';
      try {
        let helperArr = [];
        const parsedCode = JSON.parse(code);
        if (!Array.isArray(parsedCode)) {
          helperArr.push(parsedCode);
        } else {
          helperArr = parsedCode;
        }
        res.obj = helperArr;
        return res;
      } catch (e) {
        res.error = new Error((e as Error).message || t('Invalid JSON'));
      }
    }

    if (!res.obj) {
      res.format = 'yaml';
      try {
        res.obj = yaml.loadAll(code) as KubeObjectInterface[];
        return res;
      } catch (e) {
        res.error = new Error((e as Error).message || t('Invalid YAML'));
      }
    }

    if (!!res.obj) {
      res.error = null;
    }

    return res;
  }

  function handleTabChange(tabIndex: number) {
    // Check if the docs tab has been selected.
    if (tabIndex !== 1) {
      return;
    }

    const { obj: codeObjs } = getObjectsFromCode(code);
    setDocSpecs(codeObjs);
  }

  function onUndo() {
    setCode(originalCodeRef.current);
  }

  function handleSave() {
    // Verify the YAML even means anything before trying to use it.
    const { obj, format, error } = getObjectsFromCode(code);
    if (!!error) {
      setError(t('Error parsing the code: {{error}}', { error: error.message }));
      return;
    }

    if (format !== code.format) {
      setCode(currentCode => ({ code: currentCode.code, format }));
    }

    if (!getObjectsFromCode(code)) {
      setError(t("Error parsing the code. Please verify it's valid YAML or JSON!"));
      return;
    }
    onSave!(obj);
  }

  function makeEditor() {
    // @todo: monaco editor does not support pt, ta, hi amongst various other langs.
    if (['de', 'es', 'fr', 'it', 'ja', 'ko', 'ru', 'zh-cn', 'zh-tw'].includes(lang)) {
      loader.config({ 'vs/nls': { availableLanguages: { '*': lang } }, monaco });
    } else {
      loader.config({ monaco });
    }

    return useSimpleEditor ? (
      <Box paddingTop={2} height="100%">
        <SimpleEditor
          language={originalCodeRef.current.format || 'yaml'}
          value={code.code}
          onChange={onChange}
        />
      </Box>
    ) : (
      <Box paddingTop={2} height="100%">
        <Editor
          language={originalCodeRef.current.format || 'yaml'}
          theme={themeName === 'dark' ? 'vs-dark' : 'light'}
          value={code.code}
          options={editorOptions}
          onChange={onChange}
          height="600px"
        />
      </Box>
    );
  }

  const errorLabel = error || errorMessage;
  let dialogTitle = title;
  if (!dialogTitle && item) {
    const itemName = item.metadata?.name || t('New Object');
    dialogTitle = isReadOnly()
      ? t('translation|View: {{ itemName }}', { itemName })
      : t('translation|Edit: {{ itemName }}', { itemName });
  }

  const dialogTitleId = useId('editor-dialog-title-');

  return (
    <Dialog
      title={dialogTitle}
      aria-busy={!item}
      maxWidth="lg"
      scroll="paper"
      fullWidth
      withFullScreen
      onClose={onClose}
      {...other}
      aria-labelledby={dialogTitleId}
      titleProps={{
        id: dialogTitleId,
      }}
    >
      {!item ? (
        <Loader title={t('Loading editor')} />
      ) : (
        <React.Fragment>
          <DialogContent className={classes.dialogContent}>
            <Box display="flex" flexDirection="row-reverse">
              <Box p={1}>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={useSimpleEditor}
                        onChange={() => setUseSimpleEditor(!useSimpleEditor)}
                        name="useSimpleEditor"
                      />
                    }
                    label={t('Use minimal editor')}
                  />
                </FormGroup>
              </Box>
            </Box>
            {isReadOnly() ? (
              makeEditor()
            ) : (
              <Tabs
                onTabChanged={handleTabChange}
                ariaLabel={t('translation|Editor')}
                tabs={[
                  {
                    label: t('translation|Editor'),
                    component: makeEditor(),
                  },
                  {
                    label: t('translation|Documentation'),
                    component: (
                      <Box p={2} className={classes.scrollable} maxHeight={600} height={600}>
                        <DocsViewer docSpecs={docSpecs} />
                      </Box>
                    ),
                  },
                ]}
              />
            )}
          </DialogContent>
          <DialogActions>
            {!isReadOnly() && (
              <ConfirmButton
                disabled={originalCodeRef.current.code === code.code}
                color="secondary"
                aria-label={t('translation|Undo')}
                onConfirm={onUndo}
                confirmTitle={t('translation|Are you sure?')}
                confirmDescription={t(
                  'This will discard your changes in the editor. Do you want to proceed?'
                )}
                // @todo: aria-controls should point to the textarea id
              >
                {t('translation|Undo Changes')}
              </ConfirmButton>
            )}
            <div style={{ flex: '1 0 0' }} />
            {errorLabel && <Typography color="error">{errorLabel}</Typography>}
            <div style={{ flex: '1 0 0' }} />
            <Button onClick={onClose} color="primary">
              {t('translation|Close')}
            </Button>
            {!isReadOnly() && (
              <Button
                onClick={handleSave}
                color="primary"
                disabled={originalCodeRef.current.code === code.code || !!error}
                // @todo: aria-controls should point to the textarea id
              >
                {saveLabel || t('translation|Save & Apply')}
              </Button>
            )}
          </DialogActions>
        </React.Fragment>
      )}
    </Dialog>
  );
}

export function ViewDialog(props: Omit<EditorDialogProps, 'onSave'>) {
  return <EditorDialog {...props} onSave={null} />;
}
