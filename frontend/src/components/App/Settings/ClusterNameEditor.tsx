import { Box, TextField } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ConfirmButton, NameValueTable } from '../../common';

interface ClusterNameEditorProps {
  cluster: string;
  newClusterName: string;
  isValidCurrentName: boolean;
  source: string;
  onClusterNameChange: (name: string) => void;
  onUpdateClusterName: (source: string) => void;
}

export function ClusterNameEditor({
  cluster,
  newClusterName,
  isValidCurrentName,
  source,
  onClusterNameChange,
  onUpdateClusterName,
}: ClusterNameEditorProps) {
  const { t } = useTranslation(['translation']);

  const invalidClusterNameMessage = t(
    "translation|Cluster name must contain only lowercase alphanumeric characters or '-', and must start and end with an alphanumeric character."
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(' ', '');
    onClusterNameChange(value);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && isValidCurrentName) {
      onUpdateClusterName(source);
    }
  };

  return (
    <NameValueTable
      rows={[
        {
          name: t('translation|Name'),
          value: (
            <TextField
              onChange={handleChange}
              value={newClusterName}
              placeholder={cluster}
              error={!isValidCurrentName}
              helperText={
                isValidCurrentName
                  ? t(
                      'translation|The current name of cluster. You can define custom modified name.'
                    )
                  : invalidClusterNameMessage
              }
              InputProps={{
                endAdornment: (
                  <Box pt={2} textAlign="right">
                    <ConfirmButton
                      onConfirm={() => {
                        if (isValidCurrentName) {
                          onUpdateClusterName(source);
                        }
                      }}
                      confirmTitle={t('translation|Change name')}
                      confirmDescription={t(
                        'translation|Are you sure you want to change the name for "{{ clusterName }}"?',
                        { clusterName: cluster }
                      )}
                      disabled={!newClusterName || !isValidCurrentName}
                    >
                      {t('translation|Apply')}
                    </ConfirmButton>
                  </Box>
                ),
                onKeyPress: handleKeyPress,
                autoComplete: 'off',
                sx: { maxWidth: 250 },
              }}
            />
          ),
        },
      ]}
    />
  );
}
