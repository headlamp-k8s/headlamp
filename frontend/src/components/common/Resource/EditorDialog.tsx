import '../../../i18n/config';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import { makeStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import Editor, { loader } from '@monaco-editor/react';
import * as yaml from 'js-yaml';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { KubeObjectInterface } from '../../../lib/k8s/cluster';
import { getThemeName } from '../../../lib/themes';
import ConfirmButton from '../ConfirmButton';
import { Dialog, DialogProps } from '../Dialog';
import Loader from '../Loader';
import Tabs from '../Tabs';
import DocsViewer from './DocsViewer';
import SimpleEditor from './SimpleEditor';

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
  item: KubeObjectIsh | null;
  onClose: () => void;
  onSave: ((...args: any[]) => void) | null;
  onEditorChanged?: ((newValue: string) => void) | null;
  saveLabel?: string;
  errorMessage?: string;
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

  const [originalCode, setOriginalCode] = React.useState({ code: '', format: item ? 'yaml' : '' });
  const [code, setCode] = React.useState(originalCode);
  const [lastCodeCheckHandler, setLastCodeCheckHandler] = React.useState(0);
  const [previousVersion, setPreviousVersion] = React.useState('');
  const [error, setError] = React.useState('');
  const [docSpecs, setDocSpecs] = React.useState<
    KubeObjectInterface | KubeObjectInterface[] | null
  >([]);
  const { t } = useTranslation('resource');

  const [useSimpleEditor, setUseSimpleEditorState] = React.useState(() => {
    const localData = localStorage.getItem('useSimpleEditor');
    return localData ? JSON.parse(localData) : false;
  });

  function setUseSimpleEditor(data: boolean) {
    localStorage.setItem('useSimpleEditor', JSON.stringify(data));
    setUseSimpleEditorState(data);
  }

  React.useEffect(() => {
    if (!item) {
      return;
    }

    const itemCode = originalCode.format === 'json' ? JSON.stringify(item) : yaml.dump(item);
    if (itemCode !== originalCode.code) {
      setOriginalCode({ code: itemCode, format: originalCode.format });
    }

    if (!item.metadata) {
      return;
    }

    // Only change if the code hasn't been touched.
    if (previousVersion !== item.metadata!.resourceVersion || code.code === originalCode.code) {
      // Prevent updating to the same code, which would lead to an infinite loop.
      if (code.code !== itemCode) {
        setCode({ code: itemCode, format: originalCode.format });
      }

      if (previousVersion !== item.metadata!.resourceVersion) {
        setPreviousVersion(item!.metadata!.resourceVersion);
      }
    }
  }, [item, previousVersion, originalCode, code]);

  React.useEffect(() => {
    i18n.on('languageChanged', setLang);
    return () => {
      // Stop the timeout from trying to use the component after it's been unmounted.
      clearTimeout(lastCodeCheckHandler);

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
    window.clearTimeout(lastCodeCheckHandler);

    // Only check the code for errors after the user has stopped typing for a moment.
    setLastCodeCheckHandler(
      window.setTimeout(() => {
        const { error: err, format } = getObjectsFromCode({
          code: value || '',
          format: originalCode.format,
        });
        if (code.format !== format) {
          setCode({ code: value || '', format });
        }

        if (error !== (err?.message || '')) {
          setError(err?.message || '');
        }
      }, 500) // ms
    );

    setCode({ code: value as string, format: code.format });
    if (error && getObjectsFromCode({ code: value as string, format: originalCode.format })) {
      setError('');
    }

    if (onEditorChanged) {
      onEditorChanged(value as string);
    }
  }

  function getObjectsFromCode(codeInfo: typeof originalCode): {
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
    setCode(originalCode);
  }

  function handleSave() {
    // Verify the YAML even means anything before trying to use it.
    const { obj, format, error } = getObjectsFromCode(code);
    if (!!error) {
      setError(t('Error parsing the code: {{error}}', { error: error.message }));
      return;
    }

    if (format !== code.format) {
      setCode({ code: code.code, format });
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
      loader.config({ 'vs/nls': { availableLanguages: { '*': lang } } });
    }

    return useSimpleEditor ? (
      <Box paddingTop={2} height="100%">
        <SimpleEditor
          language={originalCode.format || 'yaml'}
          value={code.code}
          onChange={onChange}
        />
      </Box>
    ) : (
      <Box paddingTop={2} height="100%">
        <Editor
          language={originalCode.format || 'yaml'}
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
      ? t('resource|View: {{ itemName }}', { itemName })
      : t('resource|Edit: {{ itemName }}', { itemName });
  }

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
      aria-labelledby="editor-dialog-title"
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
                tabs={[
                  {
                    label: t('frequent|Editor'),
                    component: makeEditor(),
                  },
                  {
                    label: t('frequent|Documentation'),
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
                disabled={originalCode.code === code.code}
                color="secondary"
                aria-label={t('frequent|Undo')}
                onConfirm={onUndo}
                confirmTitle={t('frequent|Are you sure?')}
                confirmDescription={t(
                  'This will discard your changes in the editor. Do you want to proceed?'
                )}
                // @todo: aria-controls should point to the textarea id
              >
                {t('frequent|Undo Changes')}
              </ConfirmButton>
            )}
            <div style={{ flex: '1 0 0' }} />
            {errorLabel && <Typography color="error">{errorLabel}</Typography>}
            <div style={{ flex: '1 0 0' }} />
            <Button onClick={onClose} color="primary">
              {t('frequent|Close')}
            </Button>
            {!isReadOnly() && (
              <Button
                onClick={handleSave}
                color="primary"
                disabled={originalCode.code === code.code || !!error}
                // @todo: aria-controls should point to the textarea id
              >
                {saveLabel || t('frequent|Save & Apply')}
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
