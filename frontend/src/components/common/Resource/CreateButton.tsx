import { InlineIcon } from '@iconify/react';
import Button from '@mui/material/Button';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ActionButton from '../ActionButton';
import EditorDialog from './EditorDialog';

interface CreateButtonProps {
  isNarrow?: boolean;
}

export default function CreateButton(props: CreateButtonProps) {
  const { isNarrow } = props;
  const [openDialog, setOpenDialog] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const { t } = useTranslation(['translation']);

  return (
    <React.Fragment>
      {isNarrow ? (
        <ActionButton
          description={t('translation|Create / Apply')}
          onClick={() => setOpenDialog(true)}
          icon="mdi:plus-box"
          width="48"
          iconButtonProps={{
            color: 'primary',
          }}
        />
      ) : (
        <Button
          onClick={() => {
            setOpenDialog(true);
          }}
          startIcon={<InlineIcon icon="mdi:plus" />}
          color="primary"
          variant="contained"
        >
          {t('translation|Create')}
        </Button>
      )}
      <EditorDialog
        item={{}}
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={() => setOpenDialog(false)}
        saveLabel={t('translation|Apply')}
        errorMessage={errorMessage}
        onEditorChanged={() => setErrorMessage('')}
        title={t('translation|Create / Apply')}
      />
    </React.Fragment>
  );
}
