import closeIcon from '@iconify/icons-mdi/close';
import Icon from '@iconify/react';
import { Backdrop, Box, Button, Modal, Paper } from '@material-ui/core';
import React from 'react';
import ReactMarkdown from 'react-markdown';

interface ReleaseNotesModalProps {
  releaseNotes: string;
}

export default function ReleaseNotesModal(props: ReleaseNotesModalProps) {
  const { releaseNotes } = props;
  const [showReleaseNotes, setShowReleaseNotes] = React.useState(Boolean(releaseNotes));
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
        <ReactMarkdown>{releaseNotes}</ReactMarkdown>
        <Box display="flex" justifyContent="flex-end">
          <Button onClick={() => setShowReleaseNotes(false)}>
            <Icon icon={closeIcon} width="30" height="30" />
          </Button>
        </Box>
      </Paper>
    </Modal>
  );
}
