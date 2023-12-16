import { Box, DialogContent, Grid, InputBase, Paper } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import _ from 'lodash';
import React, { useEffect } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useTranslation } from 'react-i18next';
import { ITerminalOptions, Terminal as XTerminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { ISearchOptions, SearchAddon } from 'xterm-addon-search';
import ActionButton from './ActionButton';
import { Dialog, DialogProps } from './Dialog';

interface styleProps {
  isFullScreen: boolean;
}

const useStyle = makeStyles(theme => ({
  dialogContent: {
    height: '80%',
    minHeight: '80%',
    display: 'flex',
    flexDirection: 'column',
    '& .xterm ': {
      height: '100vh', // So the terminal doesn't stay shrunk when shrinking vertically and maximizing again.
      '& .xterm-viewport': {
        width: 'initial !important', // BugFix: https://github.com/xtermjs/xterm.js/issues/3564#issuecomment-1004417440
      },
    },
    '& #xterm-container': {
      overflow: 'hidden',
      width: '100%',
      height: '100%',
      '& .terminal.xterm': {
        padding: 10,
      },
    },
  },
  logBox: {
    paddingTop: theme.spacing(1),
    flex: 1,
    width: '100%',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column-reverse',
    position: 'relative',
  },
  terminalCode: {
    color: theme.palette.common.white,
  },
  terminal: {
    backgroundColor: theme.palette.common.black,
    height: ({ isFullScreen }: styleProps) => (isFullScreen ? '100vh' : '500px'),
    width: '100%',
    overflow: 'scroll',
    marginTop: theme.spacing(3),
  },
  containerFormControl: {
    minWidth: '11rem',
  },
}));

export interface LogViewerProps extends DialogProps {
  logs: string[];
  title?: string;
  downloadName?: string;
  onClose: () => void;
  topActions?: JSX.Element[];
  open: boolean;
  xtermRef?: React.MutableRefObject<XTerminal | null>;
}

export function LogViewer(props: LogViewerProps) {
  const {
    logs,
    title = '',
    downloadName = 'log',
    xtermRef: outXtermRef,
    onClose,
    topActions = [],
    ...other
  } = props;
  const [isFullScreen, setIsFullScreen] = React.useState(false);
  const classes = useStyle({ isFullScreen });
  const { t } = useTranslation();
  const xtermRef = React.useRef<XTerminal | null>(null);
  const fitAddonRef = React.useRef<any>(null);
  const searchAddonRef = React.useRef<any>(null);
  const [terminalContainerRef, setTerminalContainerRef] = React.useState<HTMLElement | null>(null);
  const [showSearch, setShowSearch] = React.useState(false);

  useHotkeys('ctrl+shift+f', () => {
    setShowSearch(true);
  });

  const XterminalReadonlyConfig: ITerminalOptions = {
    cursorStyle: 'bar',
    scrollback: 10000,
    rows: 30, // initial rows before fit
    lineHeight: 1.21,
  };

  function downloadLog() {
    // Cuts off the last 5 digits of the timestamp to remove the milliseconds
    const time = new Date().toISOString().replace(/:/g, '-').slice(0, -5);

    const element = document.createElement('a');
    const file = new Blob(logs, { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${downloadName}_${time}.txt`;
    // Required for FireFox
    document.body.appendChild(element);
    element.click();
  }

  React.useEffect(() => {
    if (!terminalContainerRef || !!xtermRef.current) {
      return;
    }

    fitAddonRef.current = new FitAddon();
    searchAddonRef.current = new SearchAddon();

    xtermRef.current = new XTerminal(XterminalReadonlyConfig);

    if (!!outXtermRef) {
      outXtermRef.current = xtermRef.current;
    }

    xtermRef.current.loadAddon(fitAddonRef.current);
    xtermRef.current.loadAddon(searchAddonRef.current);
    enableCopyPasteInXterm(xtermRef.current);

    xtermRef.current.open(terminalContainerRef!);

    fitAddonRef.current!.fit();

    xtermRef.current?.write(getJointLogs());

    const pageResizeHandler = () => {
      fitAddonRef.current!.fit();
      console.debug('resize');
    };
    window.addEventListener('resize', pageResizeHandler);

    return function cleanup() {
      window.removeEventListener('resize', pageResizeHandler);
      xtermRef.current?.dispose();
      searchAddonRef.current?.dispose();
      xtermRef.current = null;
    };
  }, [terminalContainerRef, xtermRef.current]);

  React.useEffect(() => {
    if (!xtermRef.current) {
      return;
    }

    // We're delegating to external xterm ref.
    if (!!outXtermRef) {
      return;
    }

    xtermRef.current?.clear();
    xtermRef.current?.write(getJointLogs());

    return function cleanup() {};
  }, [logs, xtermRef]);

  function getJointLogs() {
    return logs?.join('').replaceAll('\n', '\r\n');
  }

  return (
    <Dialog
      title={title}
      withFullScreen
      onFullScreenToggled={setIsFullScreen}
      onClose={onClose}
      {...other}
    >
      <DialogContent className={classes.dialogContent}>
        <Grid container justifyContent="space-between" alignItems="center" wrap="nowrap">
          <Grid item container spacing={1}>
            {topActions.map((component, i) => (
              <Grid item key={i}>
                {component}
              </Grid>
            ))}
          </Grid>
          <Grid item xs>
            <ActionButton
              description={t('translation|Find')}
              onClick={() => setShowSearch(show => !show)}
              icon="mdi:magnify"
            />
          </Grid>
          <Grid item xs>
            <ActionButton
              description={t('translation|Clear')}
              onClick={() => clearPodLogs(xtermRef)}
              icon="mdi:broom"
            />
          </Grid>
          <Grid item xs>
            <ActionButton
              description={t('Download')}
              onClick={downloadLog}
              icon="mdi:file-download-outline"
            />
          </Grid>
        </Grid>
        <Box className={classes.logBox}>
          <div
            id="xterm-container"
            ref={ref => setTerminalContainerRef(ref)}
            style={{ flex: 1, display: 'flex', flexDirection: 'column-reverse' }}
          />
          <SearchPopover
            open={showSearch}
            onClose={() => setShowSearch(false)}
            searchAddonRef={searchAddonRef}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
}

// clears logs for pod
function clearPodLogs(xtermRef: React.MutableRefObject<XTerminal | null>) {
  xtermRef.current?.clear();
  // keeping this comment if logs dont print after clear
  // xtermRef.current?.write(getJointLogs());
}

function enableCopyPasteInXterm(xterm: XTerminal) {
  xterm.attachCustomKeyEventHandler(arg => {
    if (arg.ctrlKey && arg.code === 'KeyC' && arg.type === 'keydown') {
      const selection = xterm.getSelection();
      if (selection) {
        return false;
      }
    }
    if (arg.ctrlKey && arg.code === 'KeyV' && arg.type === 'keydown') {
      return false;
    }
    return true;
  });
}

const useSearchBoxStyle = makeStyles(theme => {
  const baseGray = '#cccccc';
  const grayText = {
    color: baseGray,
  };
  const redText = {
    color: '#f48771',
  };

  //@todo: This style should match the theme being used.
  return {
    grayText,
    redText,
    root: {
      position: 'absolute',
      background: '#252526',
      top: 8,
      right: 15,
      padding: '4px 8px',
      zIndex: theme.zIndex.modal,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      borderLeft: `2px solid #555`,
      '& .SearchTextArea': {
        background: '#3c3c3c',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: '1px 4px 2px 0',
        width: 240,
        '& .MuiInputBase-root': {
          color: baseGray,
          fontSize: '0.85rem',
          border: '1px solid rgba(0,0,0,0)',
          '&.Mui-focused': {
            border: `1px solid #007fd4`,
          },
          '&>input': {
            padding: '2px 4px',
          },
        },
        '& .MuiIconButton-root': {
          margin: '0 1px',
          padding: theme.spacing(0.5),
          fontSize: '1.05rem',
          color: baseGray,
          borderRadius: 4,
          '&.checked': {
            background: '#245779',
          },
        },
      },
      '& .search-results': {
        width: 70,
        marginLeft: 8,
        fontSize: '0.8rem',
      },
      '& .search-actions': {
        '& .MuiIconButton-root': {
          padding: 2,
          fontSize: '1.05rem',
          color: baseGray,
          '&.Mui-disabled': {
            color: '#767677',
          },
        },
      },
    },
  };
});

interface SearchPopoverProps {
  searchAddonRef: { current: SearchAddon | null };
  open: boolean;
  onClose: () => void;
}

export function SearchPopover(props: SearchPopoverProps) {
  const { searchAddonRef, open, onClose } = props;
  const classes = useSearchBoxStyle();
  const [searchResult, setSearchResult] = React.useState<
    { resultIndex: number; resultCount: number } | undefined
  >(undefined);
  const [searchText, setSearchText] = React.useState<string>('');
  const [caseSensitiveChecked, setCaseSensitiveChecked] = React.useState<boolean>(false);
  const [wholeWordMatchChecked, setWholeWordMatchChecked] = React.useState<boolean>(false);
  const [regexChecked, setRegexChecked] = React.useState<boolean>(false);
  const { t } = useTranslation(['translation']);
  const focusedRef = React.useCallback(
    node => {
      if (open && !!node) {
        node.focus();
        node.select();
      }
    },
    [open]
  );

  const randomId = _.uniqueId('search-input-');

  const searchAddonTextDecorationOptions: ISearchOptions['decorations'] = {
    matchBackground: '#6d402a',
    activeMatchBackground: '#515c6a',
    matchOverviewRuler: '#f00',
    activeMatchColorOverviewRuler: '#515c6a',
  };

  useEffect(() => {
    if (!open) {
      searchAddonRef.current?.clearDecorations();
      searchAddonRef.current?.clearActiveDecoration();
      return;
    }

    try {
      searchAddonRef.current?.findNext(searchText, {
        regex: regexChecked,
        caseSensitive: caseSensitiveChecked,
        wholeWord: wholeWordMatchChecked,
        decorations: searchAddonTextDecorationOptions,
      });
    } catch (e) {
      // Catch invalid regular expression error
      console.log('Error searching logs: ', e);
      searchAddonRef.current?.findNext('');
    }

    searchAddonRef.current?.onDidChangeResults(args => {
      setSearchResult(args);
    });

    return function cleanup() {
      searchAddonRef.current?.findNext('');
    };
  }, [searchText, caseSensitiveChecked, wholeWordMatchChecked, regexChecked, open]);

  const handleFindNext = () => {
    searchAddonRef.current?.findNext(searchText, {
      regex: regexChecked,
      caseSensitive: caseSensitiveChecked,
      wholeWord: wholeWordMatchChecked,
      decorations: searchAddonTextDecorationOptions,
    });
  };

  const handleFindPrevious = () => {
    searchAddonRef.current?.findPrevious(searchText, {
      regex: regexChecked,
      caseSensitive: caseSensitiveChecked,
      wholeWord: wholeWordMatchChecked,
      decorations: searchAddonTextDecorationOptions,
    });
  };

  const handleClose = () => {
    onClose();
  };

  const onSearchTextChange = (event: any) => {
    setSearchText(event.target.value);
  };

  const handleInputKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      if (event.shiftKey) {
        handleFindPrevious();
      } else {
        handleFindNext();
      }
    }
  };

  const searchResults = () => {
    let className = classes.grayText;
    let msg = '';
    if (!searchText) {
      msg = t('translation|No results');
    } else if (!searchResult) {
      msg = t('translation|Too many matches');
      className = classes.redText;
    } else {
      if (searchResult.resultCount === 0) {
        msg = t('translation|No results');
        className = classes.redText;
      } else {
        msg = t('translation|{{ currentIndex }} of {{ totalResults }}', {
          currentIndex:
            searchResult?.resultIndex !== undefined ? searchResult?.resultIndex + 1 : '?',
          totalResults:
            searchResult?.resultCount === undefined ? '999+' : searchResult?.resultCount,
        });
      }
    }

    return <span className={className}>{msg}</span>;
  };

  return !open ? (
    <></>
  ) : (
    <Paper className={classes.root}>
      <Box className="SearchTextArea">
        <InputBase
          value={searchText}
          onChange={onSearchTextChange}
          placeholder={t('translation|Find')}
          inputProps={{ autoComplete: 'off', type: 'text', name: randomId, id: randomId }}
          onKeyDown={handleInputKeyDown}
          inputRef={focusedRef}
        />
        <ActionButton
          icon="mdi:format-letter-case"
          onClick={() => setCaseSensitiveChecked(!caseSensitiveChecked)}
          description={t('translation|Match case')}
          iconButtonProps={{
            className: caseSensitiveChecked ? 'checked' : '',
          }}
        />
        <ActionButton
          icon="mdi:format-letter-matches"
          onClick={() => setWholeWordMatchChecked(!wholeWordMatchChecked)}
          description={t('translation|Match whole word')}
          iconButtonProps={{
            className: wholeWordMatchChecked ? 'checked' : '',
          }}
        />
        <ActionButton
          icon="mdi:regex"
          onClick={() => setRegexChecked(!regexChecked)}
          description={t('translation|Use regular expression')}
          iconButtonProps={{
            className: regexChecked ? 'checked' : '',
          }}
        />
      </Box>
      <div className="search-results">{searchResults()}</div>
      <div className="search-actions">
        <ActionButton
          icon="mdi:arrow-up"
          onClick={handleFindPrevious}
          description={t('translation|Previous Match (Shift+Enter)')}
          iconButtonProps={{
            disabled: !searchResult?.resultCount && searchResult?.resultCount !== undefined,
          }}
        />
        <ActionButton
          icon="mdi:arrow-down"
          onClick={handleFindNext}
          description={t('translation|Next Match (Enter)')}
          iconButtonProps={{
            disabled: !searchResult?.resultCount && searchResult?.resultCount !== undefined,
          }}
        />
        <ActionButton icon="mdi:close" onClick={handleClose} description={t('translation|Close')} />
      </div>
    </Paper>
  );
}
