import { Icon } from '@iconify/react';
import { TextField, useTheme } from '@mui/material';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import helpers, { ClusterSettings } from '../../../../helpers';
import { ConfigState } from '../../../../redux/configSlice';

export function isValidNamespaceFormat(namespace: string) {
  // We allow empty strings just because that's the default value in our case.
  if (!namespace) {
    return true;
  }

  // Validates that the namespace is a valid DNS-1123 label and returns a boolean.
  // https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#dns-label-names
  const regex = new RegExp('^[a-z0-9]([-a-z0-9]*[a-z0-9])?$');
  return regex.test(namespace);
}

interface DefaultNamespaceProps {
  currentCluster?: string;
  clusterSettings: ClusterSettings | null;
  clusterConf: ConfigState['allClusters'];
  setClusterSettings: Dispatch<SetStateAction<ClusterSettings | null>>;
}

export default function DefaultNamespace(props: DefaultNamespaceProps) {
  const { currentCluster = '', clusterSettings, clusterConf, setClusterSettings } = props;
  const { t } = useTranslation(['translation']);
  const [defaultNamespace, setDefaultNamespace] = useState('default');
  const [userDefaultNamespace, setUserDefaultNamespace] = useState('');
  const theme = useTheme();

  useEffect(() => {
    const clusterInfo = (clusterConf && clusterConf[currentCluster || '']) || null;
    const clusterConfNs = clusterInfo?.meta_data?.namespace;
    if (!!clusterConfNs && clusterConfNs !== defaultNamespace) {
      setDefaultNamespace(clusterConfNs);
    }
  }, [currentCluster, clusterConf]);

  useEffect(() => {
    if (clusterSettings?.defaultNamespace !== userDefaultNamespace) {
      setUserDefaultNamespace(clusterSettings?.defaultNamespace || '');
    }

    // Avoid re-initializing settings as {} just because the cluster is not yet set.
    if (clusterSettings !== null) {
      helpers.storeClusterSettings(currentCluster || '', clusterSettings);
    }
  }, [currentCluster, clusterSettings]);

  useEffect(() => {
    let timeoutHandle: NodeJS.Timeout | null = null;

    if (isEditingDefaultNamespace()) {
      // We store the namespace after a timeout.
      timeoutHandle = setTimeout(() => {
        if (isValidNamespaceFormat(userDefaultNamespace)) {
          storeNewDefaultNamespace(userDefaultNamespace);
        }
      }, 1000);
    }

    return () => {
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
        timeoutHandle = null;
      }
    };
  }, [userDefaultNamespace]);

  function isEditingDefaultNamespace() {
    return clusterSettings?.defaultNamespace !== userDefaultNamespace;
  }

  function storeNewDefaultNamespace(namespace: string) {
    let actualNamespace = namespace;
    if (namespace === defaultNamespace) {
      actualNamespace = '';
      setUserDefaultNamespace(actualNamespace);
    }

    setClusterSettings((settings: ClusterSettings | null) => {
      const newSettings = { ...(settings || {}) };
      if (isValidNamespaceFormat(namespace)) {
        newSettings.defaultNamespace = actualNamespace;
      }
      return newSettings;
    });
  }

  const isValidDefaultNamespace = isValidNamespaceFormat(userDefaultNamespace);
  const invalidNamespaceMessage = t(
    "translation|Namespaces must contain only lowercase alphanumeric characters or '-', and must start and end with an alphanumeric character."
  );
  return (
    <TextField
      onChange={event => {
        let value = event.target.value;
        value = value.replace(' ', '');
        setUserDefaultNamespace(value);
      }}
      value={userDefaultNamespace}
      placeholder={defaultNamespace}
      error={!isValidDefaultNamespace}
      helperText={
        isValidDefaultNamespace
          ? t(
              'translation|The default namespace for e.g. when applying resources (when not specified directly).'
            )
          : invalidNamespaceMessage
      }
      InputProps={{
        endAdornment: isEditingDefaultNamespace() ? (
          <Icon width={24} color={theme.palette.text.secondary} icon="mdi:progress-check" />
        ) : (
          <Icon width={24} icon="mdi:check-bold" />
        ),
        sx: { maxWidth: 250 },
      }}
    />
  );
}
