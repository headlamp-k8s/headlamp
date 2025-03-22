import { Icon } from '@iconify/react';
import { useTheme } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import helpers, {
  ClusterSettings,
  DEFAULT_NODE_SHELL_LINUX_IMAGE,
  DEFAULT_NODE_SHELL_NAMESPACE,
} from '../../../helpers';
import { NameValueTable, SectionBox } from '../../common';
import { isValidNamespaceFormat } from './util';

/**
 * Props for the Settings component.
 * @interface SettingsProps
 * @property {Object.<string, {isEnabled?: boolean, namespace?: string, image?: string}>} data - Configuration data for each cluster
 * @property {Function} onDataChange - Callback function when data changes
 */
interface SettingsProps {
  cluster: string;
}

export default function NodeShellSettings(props: SettingsProps) {
  const { cluster } = props;
  const { t } = useTranslation(['translation']);
  const theme = useTheme();
  const [clusterSettings, setClusterSettings] = useState<ClusterSettings | null>(null);
  const [userNamespace, setUserNamespace] = useState('');
  const [userImage, setUserImage] = useState('');
  const [userIsEnabled, setUserIsEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    setClusterSettings(!!cluster ? helpers.loadClusterSettings(cluster || '') : null);
  }, [cluster]);

  useEffect(() => {
    if (clusterSettings?.nodeShellTerminal?.namespace !== userNamespace) {
      setUserNamespace(clusterSettings?.nodeShellTerminal?.namespace || '');
    }

    if (clusterSettings?.nodeShellTerminal?.linuxImage !== userImage) {
      setUserImage(clusterSettings?.nodeShellTerminal?.linuxImage || '');
    }

    setUserIsEnabled(clusterSettings?.nodeShellTerminal?.isEnabled || null);

    // Avoid re-initializing settings as {} just because the cluster is not yet set.
    if (clusterSettings !== null) {
      helpers.storeClusterSettings(cluster || '', clusterSettings);
    }
  }, [cluster, clusterSettings]);

  //const selectedClusterData = data?.[selectedCluster] || {};
  //const isEnabled = selectedClusterData.isEnabled ?? true;
  const isValidNamespace = isValidNamespaceFormat(userNamespace);
  const invalidNamespaceMessage = t(
    "translation|Namespaces must contain only lowercase alphanumeric characters or '-', and must start and end with an alphanumeric character."
  );

  function isEditingNamespace() {
    return clusterSettings?.nodeShellTerminal?.namespace !== userNamespace;
  }

  function isEditingImage() {
    return clusterSettings?.nodeShellTerminal?.linuxImage !== userImage;
  }

  function storeNewNamespace(namespace: string) {
    let actualNamespace = namespace;
    if (namespace === DEFAULT_NODE_SHELL_NAMESPACE) {
      actualNamespace = '';
      setUserNamespace(actualNamespace);
    }

    setClusterSettings((settings: ClusterSettings | null) => {
      const newSettings = { ...(settings || {}) };
      if (isValidNamespaceFormat(namespace)) {
        if (newSettings.nodeShellTerminal === null || newSettings.nodeShellTerminal === undefined) {
          newSettings.nodeShellTerminal = {};
        }
        newSettings.nodeShellTerminal.namespace = actualNamespace;
      }
      return newSettings;
    });
  }

  function storeNewImage(image: string) {
    let actualImage = image;
    if (image === DEFAULT_NODE_SHELL_LINUX_IMAGE) {
      actualImage = '';
      setUserImage(actualImage);
    }

    setClusterSettings((settings: ClusterSettings | null) => {
      const newSettings = { ...(settings || {}) };
      if (newSettings.nodeShellTerminal === null || newSettings.nodeShellTerminal === undefined) {
        newSettings.nodeShellTerminal = {};
      }
      newSettings.nodeShellTerminal.linuxImage = actualImage;

      return newSettings;
    });
  }

  function storeNewEnabled(enabled: boolean) {
    setUserIsEnabled(enabled);

    setClusterSettings((settings: ClusterSettings | null) => {
      const newSettings = { ...(settings || {}) };
      if (newSettings.nodeShellTerminal === null || newSettings.nodeShellTerminal === undefined) {
        newSettings.nodeShellTerminal = {};
      }
      newSettings.nodeShellTerminal.isEnabled = enabled;

      return newSettings;
    });
  }

  useEffect(() => {
    let timeoutHandle: NodeJS.Timeout | null = null;

    if (isEditingNamespace()) {
      // We store the namespace after a timeout.
      timeoutHandle = setTimeout(() => {
        if (isValidNamespaceFormat(userNamespace)) {
          storeNewNamespace(userNamespace);
        }
      }, 1000);
    }

    return () => {
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
      }
    };
  }, [userNamespace]);

  useEffect(() => {
    let timeoutHandle: NodeJS.Timeout | null = null;

    if (isEditingImage()) {
      // We store the namespace after a timeout.
      timeoutHandle = setTimeout(() => {
        storeNewImage(userImage);
      }, 1000);
    }

    return () => {
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
      }
    };
  }, [userImage]);

  return (
    <SectionBox title={t('translation|Node Shell Settings')} headerProps={{ headerStyle: 'label' }}>
      <NameValueTable
        rows={[
          {
            name: 'Enable Node Shell',
            value: (
              <Switch
                checked={userIsEnabled ?? true}
                onChange={e => {
                  const newEnabled = e.target.checked;
                  storeNewEnabled(newEnabled);
                }}
              />
            ),
          },
          {
            name: 'Linux Image',
            value: (
              <TextField
                onChange={event => {
                  let value = event.target.value;
                  value = value.replace(' ', '');
                  setUserImage(value);
                }}
                value={userImage}
                placeholder={DEFAULT_NODE_SHELL_LINUX_IMAGE}
                helperText={t(
                  'translation|The default image is used for dropping a shell into a node (when not specified directly).'
                )}
                InputProps={{
                  endAdornment: isEditingImage() ? (
                    <Icon
                      width={24}
                      color={theme.palette.text.secondary}
                      icon="mdi:progress-check"
                    />
                  ) : (
                    <Icon width={24} icon="mdi:check-bold" />
                  ),
                  sx: { maxWidth: 250 },
                }}
              />
            ),
          },
          {
            name: 'Namespace',
            value: (
              <TextField
                onChange={event => {
                  let value = event.target.value;
                  value = value.replace(' ', '');
                  setUserNamespace(value);
                }}
                value={userNamespace}
                placeholder={DEFAULT_NODE_SHELL_NAMESPACE}
                error={!isValidNamespace}
                helperText={
                  isValidNamespace
                    ? t('translation|The default namespace is kube-system.')
                    : invalidNamespaceMessage
                }
                InputProps={{
                  endAdornment: isEditingNamespace() ? (
                    <Icon
                      width={24}
                      color={theme.palette.text.secondary}
                      icon="mdi:progress-check"
                    />
                  ) : (
                    <Icon width={24} icon="mdi:check-bold" />
                  ),
                  sx: { maxWidth: 250 },
                }}
              />
            ),
          },
        ]}
      />
    </SectionBox>
  );
}
