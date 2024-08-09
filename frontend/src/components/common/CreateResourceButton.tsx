import React from 'react';
import { useTranslation } from 'react-i18next';
import { ClassWithBaseObject, KubeObject } from '../../lib/k8s/cluster';
import { ActionButton, EditorDialog } from '../common';

export interface CreateResourceButtonProps {
  resourceClass: ClassWithBaseObject<KubeObject>;
}

export function CreateResourceButton(props: CreateResourceButtonProps) {
  const { resourceClass } = props;
  const { t } = useTranslation(['glossary', 'translation']);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const baseObject = resourceClass.getBaseObject ? resourceClass.getBaseObject() : {};
  const resourceName = resourceClass.kind;

  return (
    <React.Fragment>
      <ActionButton
        color="primary"
        description={t('translation|Create {{ resourceName }}', { resourceName })}
        icon={'mdi:plus-circle'}
        onClick={() => {
          setOpenDialog(true);
        }}
      />

      <EditorDialog
        item={baseObject}
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={() => setOpenDialog(false)}
        saveLabel={t('translation|Apply')}
        errorMessage={errorMessage}
        onEditorChanged={() => setErrorMessage('')}
        title={t('translation|Create {{ resourceName }}', { resourceName })}
      />
    </React.Fragment>
  );
}
