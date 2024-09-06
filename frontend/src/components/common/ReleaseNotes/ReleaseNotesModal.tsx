import 'github-markdown-css';
import { Icon } from '@iconify/react';
import { Box, Dialog, DialogContent, IconButton, Link } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { DialogTitle } from '../Dialog';

export interface ReleaseNotesModalProps {
  releaseNotes: string;
  appVersion: string | null;
}

export default function ReleaseNotesModal(props: ReleaseNotesModalProps) {
  const { releaseNotes, appVersion } = props;
  const [showReleaseNotes, setShowReleaseNotes] = React.useState(Boolean(releaseNotes));
  const { t } = useTranslation();

  return (
    <Dialog open={showReleaseNotes} maxWidth="xl">
      <DialogTitle
        buttons={[
          <IconButton aria-label={t('Close')} onClick={() => setShowReleaseNotes(false)}>
            <Icon icon="mdi:close" width="30" height="30" />
          </IconButton>,
        ]}
      >
        {t('translation|Release Notes ({{ appVersion }})', {
          appVersion: appVersion,
        })}
      </DialogTitle>
      <DialogContent dividers>
        <Box
          sx={{
            img: {
              display: 'block',
              maxWidth: '100%',
            },
          }}
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
      </DialogContent>
    </Dialog>
  );
}
