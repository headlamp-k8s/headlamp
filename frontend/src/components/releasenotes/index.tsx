import 'github-markdown-css';
import closeIcon from '@iconify/icons-mdi/close';
import Icon from '@iconify/react';
import { Backdrop, Box, Button, Modal, Paper, Typography } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';

interface ReleaseNotesModalProps {
  releaseNotes: string;
  appVersion: string;
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
  };

  return (
    <Modal open={showReleaseNotes} BackdropComponent={Backdrop} style={modalStyle}>
      <Paper style={releaseNotesStyle}>
        <Box display="flex" justifyContent="center">
          <Box flexGrow={2}>
            <Typography variant="h4">
              {t('Release Notes')}({appVersion}){' '}
            </Typography>
          </Box>
          <Button onClick={() => setShowReleaseNotes(false)}>
            <Icon icon={closeIcon} width="30" height="30" />
          </Button>
        </Box>
        <div
          className="markdown-body"
          style={{ color: theme.palette.text.primary, fontFamily: 'inherit' }}
        >
          <ReactMarkdown>{releaseNotes}</ReactMarkdown>
        </div>
      </Paper>
    </Modal>
  );
}
