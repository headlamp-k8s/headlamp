import { Icon } from '@iconify/react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Switch,
  Tooltip,
  Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import helpers from '../../../helpers';
import {
  changeExternalToolConsent,
  ExternalTool,
  getExternalTools,
  installExternalTool,
  openToolsDirectory,
  uninstallExternalTool,
} from '../../../lib/externalTools';
import { ActionButton, SectionBox, SimpleTable } from '../../common';
import { ConfirmDialog } from '../../common';
import Loader from '../../common/Loader';

// Define a type for grouped tools
interface ToolGroup {
  name: string;
  displayName: string;
  versions: ExternalTool[];
  anyInstalled: boolean;
  anyConsented: boolean;
}

export default function ExternalTools() {
  const { t } = useTranslation(['translation']);
  const [tools, setTools] = useState<ExternalTool[]>([]);
  const [groupedTools, setGroupedTools] = useState<ToolGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [installing, setInstalling] = useState<{ [name: string]: boolean }>({});
  const [uninstalling, setUninstalling] = useState<{ [name: string]: boolean }>({});
  const [confirmUninstall, setConfirmUninstall] = useState<string | null>(null);
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>(false);
  const { enqueueSnackbar } = useSnackbar();
  const isElectron = helpers.isElectron();

  useEffect(() => {
    if (isElectron) {
      fetchTools();
    } else {
      setLoading(false);
    }
  }, [isElectron]);

  // Group tools by their base name
  useEffect(() => {
    const grouped: { [name: string]: ToolGroup } = {};

    tools.forEach(tool => {
      const baseName = tool.name;
      if (!grouped[baseName]) {
        grouped[baseName] = {
          name: baseName,
          displayName: tool.displayName.replace(' (System)', ''),
          versions: [],
          anyInstalled: false,
          anyConsented: false,
        };
      }

      grouped[baseName].versions.push(tool);

      if (tool.installed) {
        grouped[baseName].anyInstalled = true;
      }

      if (tool.consented) {
        grouped[baseName].anyConsented = true;
      }
    });

    setGroupedTools(Object.values(grouped));
  }, [tools]);

  const fetchTools = useCallback(async () => {
    if (!isElectron) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await getExternalTools();

      // Transform the data to create separate entries for system installed tools
      const transformedTools: ExternalTool[] = [];

      data.forEach(tool => {
        const isSystemTool = tool.systemInstalled;
        // Keep the original tool
        transformedTools.push({
          ...tool,
          systemInstalled: false,
        });

        // If the tool is also installed in the system, add it as a separate entry
        if (isSystemTool) {
          transformedTools.push({
            ...tool,
            displayName: `${tool.displayName} (System)`,
            version: tool.systemVersion || 'system',
            installed: true,
            enabled: tool.consented || false,
            systemInstalled: true,
            systemPath: tool.systemPath,
          });
        }
      });

      setTools(transformedTools);
    } catch (err) {
      console.error('Failed to fetch external tools:', err);
      enqueueSnackbar(t('Failed to fetch external tools'), { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [isElectron, enqueueSnackbar, t]);

  const handleInstall = async (name: string) => {
    if (!isElectron) return;

    setInstalling(prev => ({ ...prev, [name]: true }));

    try {
      const result = await installExternalTool(name);
      if (result.success) {
        fetchTools(); // Refresh tools list
        enqueueSnackbar(t('Successfully installed {{name}}', { name }), { variant: 'success' });
      } else {
        enqueueSnackbar(t('Failed to install {{name}}: {{error}}', { name, error: result.error }), {
          variant: 'error',
        });
      }
    } catch (error) {
      console.error(`Failed to install ${name}:`, error);
      enqueueSnackbar(t('Failed to install {{name}}', { name }), { variant: 'error' });
    } finally {
      setInstalling(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleUninstall = async (name: string) => {
    if (!isElectron) return;

    setConfirmUninstall(null);
    setUninstalling(prev => ({ ...prev, [name]: true }));

    try {
      const result = await uninstallExternalTool(name);
      if (result.success) {
        fetchTools(); // Refresh tools list
        enqueueSnackbar(t('Successfully uninstalled {{name}}', { name }), { variant: 'success' });
      } else {
        enqueueSnackbar(
          t('Failed to uninstall {{name}}: {{error}}', { name, error: result.error }),
          { variant: 'error' }
        );
      }
    } catch (error) {
      console.error(`Failed to uninstall ${name}:`, error);
      enqueueSnackbar(t('Failed to uninstall {{name}}', { name }), { variant: 'error' });
    } finally {
      setUninstalling(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleToggle = async (name: string, enabled: boolean) => {
    if (!isElectron) return;

    try {
      const result = await changeExternalToolConsent(name, enabled);

      // Only refresh the tools list if the operation was successful
      if (result) {
        fetchTools();
        const message = enabled
          ? t('Enabled {{name}}', { name })
          : t('Disabled {{name}}', { name });
        enqueueSnackbar(message, { variant: 'info' });
      } else if (enabled) {
        // If enabling failed, it means the user denied permission
        enqueueSnackbar(t('Permission denied for {{name}}', { name }), { variant: 'warning' });
        fetchTools(); // Refresh to show the current state
      }
    } catch (error) {
      console.error(`Failed to toggle ${name}:`, error);
      enqueueSnackbar(t('Failed to change state for {{name}}', { name }), { variant: 'error' });
    }
  };

  const handleOpenToolsDirectory = () => {
    if (!isElectron) return;

    openToolsDirectory()
      .then(() => {
        enqueueSnackbar(t('Tools directory opened'), { variant: 'info' });
      })
      .catch(error => {
        console.error('Failed to open tools directory:', error);
        enqueueSnackbar(t('Failed to open tools directory'), { variant: 'error' });
      });
  };

  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedAccordion(isExpanded ? panel : false);
    };

  if (loading) {
    return <Loader title="Loading" />;
  }

  if (!isElectron) {
    return (
      <SectionBox title={t('External Tools')}>
        <Box mt={2} mb={2}>
          <Typography variant="body1">
            {t('This feature is only available in the desktop application.')}
          </Typography>
        </Box>
      </SectionBox>
    );
  }

  return (
    <SectionBox
      title={t('External Tools')}
      headerProps={{
        actions: [
          <ActionButton
            key="refresh"
            icon="mdi:refresh"
            description={t('Refresh')}
            onClick={fetchTools}
          />,
          <ActionButton
            key="openDirectory"
            icon="mdi:folder-open"
            description={t('Open tools folder')}
            onClick={handleOpenToolsDirectory}
          />,
        ],
      }}
    >
      <Box mb={2}>
        <Typography variant="body2" color="textSecondary">
          {t(
            'External tools are binaries that Headlamp and its plugins can use to provide additional functionality. Enabling a tool will prompt for permission when plugins request to run it.'
          )}
        </Typography>
      </Box>

      {groupedTools.length === 0 ? (
        <Typography variant="body2">{t('No external tools available.')}</Typography>
      ) : (
        <Box>
          {groupedTools.map(toolGroup => (
            <Accordion
              key={toolGroup.name}
              expanded={expandedAccordion === toolGroup.name}
              onChange={handleAccordionChange(toolGroup.name)}
              sx={{ mb: 1 }}
            >
              <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  width="100%"
                  mr={2}
                >
                  <Typography variant="subtitle1">{toolGroup.displayName}</Typography>
                  <Box display="flex" alignItems="center" gap={2}>
                    {toolGroup.anyInstalled ? (
                      <Box display="flex" alignItems="center">
                        <Chip
                          label={t('Installed')}
                          color="success"
                          size="small"
                          variant="outlined"
                          sx={{ mr: 1 }}
                        />
                        <Tooltip title={t('Consent for plugins to run this command')}>
                          <Switch
                            size="small"
                            checked={toolGroup.anyConsented}
                            onChange={(_, checked) => handleToggle(toolGroup.name, checked)}
                          />
                        </Tooltip>
                      </Box>
                    ) : (
                      <Chip
                        label={t('Not Installed')}
                        color="default"
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <SimpleTable
                  columns={[
                    {
                      label: t('Version'),
                      getter: (tool: ExternalTool) => tool.version,
                    },
                    {
                      label: t('Status'),
                      getter: (tool: ExternalTool) =>
                        tool.systemInstalled ? (
                          <Tooltip
                            title={t('Found in system at: {{path}}', { path: tool.systemPath })}
                          >
                            <Chip
                              label={t('System Installed')}
                              color="success"
                              size="small"
                              variant="outlined"
                            />
                          </Tooltip>
                        ) : tool.headlampInstalled ? (
                          <Chip
                            label={t('Installed')}
                            color="success"
                            size="small"
                            variant="outlined"
                          />
                        ) : (
                          <Chip
                            label={t('Not Installed')}
                            color="default"
                            size="small"
                            variant="outlined"
                          />
                        ),
                    },
                    {
                      label: t('Actions'),
                      getter: (tool: ExternalTool) =>
                        tool.systemInstalled ? (
                          <Tooltip title={tool.systemPath || ''}>
                            <Typography
                              variant="body2"
                              sx={{
                                fontStyle: 'italic',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: '200px',
                              }}
                            >
                              {tool.systemPath}
                            </Typography>
                          </Tooltip>
                        ) : tool.headlampInstalled ? (
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="body2" color="textSecondary">
                              {t('Managed by Headlamp')}
                            </Typography>
                            <Tooltip title={t('Uninstall')}>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => setConfirmUninstall(tool.name)}
                                disabled={!!uninstalling[tool.name]}
                              >
                                {uninstalling[tool.name] ? (
                                  <CircularProgress size={16} />
                                ) : (
                                  <Icon icon="mdi:trash-can-outline" width={16} />
                                )}
                              </IconButton>
                            </Tooltip>
                          </Box>
                        ) : (
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleInstall(tool.name)}
                            startIcon={
                              installing[tool.name] ? (
                                <CircularProgress size={16} />
                              ) : (
                                <Icon icon="mdi:download" />
                              )
                            }
                            disabled={installing[tool.name]}
                          >
                            {t('Install')}
                          </Button>
                        ),
                    },
                  ]}
                  data={toolGroup.versions}
                  reflectInURL={false}
                  defaultSortingColumn={1}
                  noTableHeader={false}
                />
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}

      <ConfirmDialog
        open={!!confirmUninstall}
        title={t('Uninstall Tool')}
        description={t(
          'Are you sure you want to uninstall {{name}}? This action cannot be undone.',
          {
            name:
              tools.find(tool => tool.name === confirmUninstall)?.displayName ||
              confirmUninstall ||
              '',
          }
        )}
        handleClose={() => setConfirmUninstall(null)}
        onConfirm={() => confirmUninstall && handleUninstall(confirmUninstall)}
      />
    </SectionBox>
  );
}
