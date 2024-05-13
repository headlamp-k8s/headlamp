import 'github-markdown-css';
import { Icon } from '@iconify/react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
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
  const { t } = useTranslation();
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
    <Modal open={showReleaseNotes} style={modalStyle}>
      <Paper style={releaseNotesStyle} variant="outlined">
        <Box display="flex" justifyContent="center">
          <Box flexGrow={2}>
            <Typography variant="h4">
              {t('translation|Release Notes ({{ appVersion }})', {
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
          <ReactMarkdown
            components={{
              a: ({ children, href }) => {
                return (
                  <Link href={href} target="_blank">
                    {children}
                  </Link>
                );
              },
            }}
          >
            {releaseNotes}
          </ReactMarkdown>
        </Box>
      </Paper>
    </Modal>
  );
}
