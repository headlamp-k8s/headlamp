import { Icon } from '@iconify/react';
import { Box, IconButton } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

export interface ShowHideLabelProps {
  children: string;
  show?: boolean;
  labelId?: string;
  maxChars?: number;
}

export default function ShowHideLabel(props: ShowHideLabelProps) {
  const { show = false, labelId = '', maxChars = 256, children } = props;
  const { t } = useTranslation();
  const [expanded, setExpanded] = React.useState(show);

  const labelIdOrRandom = React.useMemo(() => {
    if (!!labelId || !!process.env.UNDER_TEST) {
      return labelId;
    }

    return `${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`;
  }, [labelId]);

  const [actualText, needsButton] = React.useMemo(() => {
    if (typeof children !== 'string') {
      return ['', false];
    }

    if (expanded) {
      return [children, true];
    }

    return [children.substr(0, maxChars), children.length > maxChars];
  }, [children, expanded]);

  if (!children) {
    return null;
  }

  return (
    <Box display={expanded ? 'block' : 'flex'}>
      <label
        id={labelIdOrRandom}
        style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}
        aria-expanded={!needsButton ? undefined : expanded}
      >
        {actualText}
        {needsButton && (
          <>
            {!expanded && '…'}
            <IconButton
              aria-controls={labelIdOrRandom}
              sx={{ display: 'inline' }}
              onClick={() => setExpanded(expandedVal => !expandedVal)}
              size="small"
              arial-label={expanded ? t('translation|Collapse') : t('translation|Expand')}
            >
              <Icon icon={expanded ? 'mdi:menu-up' : 'mdi:menu-down'} />
            </IconButton>
          </>
        )}
      </label>
    </Box>
  );
}
