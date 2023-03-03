import 'github-markdown-css';
import { Icon } from '@iconify/react';
import { Backdrop, Box, Button, Modal, Paper, Typography } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';

export interface ReleaseNotesModalProps {
  releaseNotes: string;
  appVersion: string | null;
}

export default function ReleaseNotesModal(props: ReleaseNotesModalProps) {
  const { releaseNotes, appVersion } = props;
  const [showReleaseNotes, setShowReleaseNotes] = React.useState(Boolean(releaseNotes));
  const theme = useTheme();
  const { t } = useTranslation('frequent');
  const modalStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
  };
  const releaseNotesStyle = {
    padding: '1rem',
    maxHeight: '80%',
    minWidth: '50%',
    minHeight: '50%',
    overflow: 'auto',
    maxWidth: '80%',
  };

  return (
    <Modal open={showReleaseNotes} BackdropComponent={Backdrop} style={modalStyle}>
      <Paper style={releaseNotesStyle}>
        <Box display="flex" justifyContent="center">
          <Box flexGrow={2}>
            <Typography variant="h4">
              {t('release|Release Notes ({{ appVersion }})', {
                appVersion: appVersion,
              })}
            </Typography>
          </Box>
          <Button onClick={() => setShowReleaseNotes(false)}>
            <Icon icon="mdi:close" width="30" height="30" />
          </Button>
        </Box>
        <Box
          mt={2}
          className="markdown-body"
          style={{ color: theme.palette.text.primary, fontFamily: 'inherit' }}
        >
          <ReactMarkdown>{releaseNotes}</ReactMarkdown>
        </Box>
      </Paper>
    </Modal>
  );
}
