import { InlineIcon } from '@iconify/react';
import { Box, Chip, IconButton, TextField, useTheme } from '@mui/material';
import { Dispatch, SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ClusterSettings } from '../../../helpers';
import { isValidNamespaceFormat } from './DefaultNamespace';

interface AllowedNamespacesProps {
  clusterSettings: ClusterSettings | null;
  setClusterSettings: Dispatch<SetStateAction<ClusterSettings | null>>;
}

export default function AllowedNamespaces(props: AllowedNamespacesProps) {
  const { clusterSettings, setClusterSettings } = props;
  const { t } = useTranslation(['translation']);
  const [newAllowedNamespace, setNewAllowedNamespace] = useState('');
  const theme = useTheme();

  function storeNewAllowedNamespace(namespace: string) {
    setNewAllowedNamespace('');
    setClusterSettings((settings: ClusterSettings | null) => {
      const newSettings = { ...(settings || {}) };
      newSettings.allowedNamespaces = newSettings.allowedNamespaces || [];
      newSettings.allowedNamespaces.push(namespace);
      // Sort and avoid duplicates
      newSettings.allowedNamespaces = [...new Set(newSettings.allowedNamespaces)].sort();
      return newSettings;
    });
  }
  const isValidNewAllowedNamespace = isValidNamespaceFormat(newAllowedNamespace);
  const invalidNamespaceMessage = t(
    "translation|Namespaces must contain only lowercase alphanumeric characters or '-', and must start and end with an alphanumeric character."
  );
  return (
    <>
      <TextField
        onChange={event => {
          let value = event.target.value;
          value = value.replace(' ', '');
          setNewAllowedNamespace(value);
        }}
        placeholder="namespace"
        error={!isValidNewAllowedNamespace}
        value={newAllowedNamespace}
        helperText={
          isValidNewAllowedNamespace
            ? t('translation|The list of namespaces you are allowed to access in this cluster.')
            : invalidNamespaceMessage
        }
        autoComplete="off"
        inputProps={{
          form: {
            autocomplete: 'off',
          },
        }}
        InputProps={{
          endAdornment: (
            <IconButton
              onClick={() => {
                storeNewAllowedNamespace(newAllowedNamespace);
              }}
              disabled={!newAllowedNamespace}
              size="medium"
              aria-label={t('translation|Add namespace')}
            >
              <InlineIcon icon="mdi:plus-circle" />
            </IconButton>
          ),
          onKeyPress: event => {
            if (event.key === 'Enter') {
              storeNewAllowedNamespace(newAllowedNamespace);
            }
          },
          autoComplete: 'off',
          sx: { maxWidth: 250 },
        }}
      />
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          '& > *': {
            margin: theme.spacing(0.5),
          },
          marginTop: theme.spacing(1),
        }}
        aria-label={t('translation|Allowed namespaces')}
      >
        {((clusterSettings || {}).allowedNamespaces || []).map(namespace => (
          <Chip
            key={namespace}
            label={namespace}
            size="small"
            clickable={false}
            onDelete={() => {
              setClusterSettings(settings => {
                const newSettings = { ...settings };
                newSettings.allowedNamespaces = newSettings.allowedNamespaces?.filter(
                  ns => ns !== namespace
                );
                return newSettings;
              });
            }}
          />
        ))}
      </Box>
    </>
  );
}
