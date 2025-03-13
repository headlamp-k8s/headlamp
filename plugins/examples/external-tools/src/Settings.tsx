import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Divider,
  Paper,
  Alert,
  Chip,
} from '@mui/material';
import { Icon } from '@iconify/react';
import {
  getExternalTools,
  installExternalTools,
  uninstallExternalTool,
  ExternalTool,
  changeExternalToolConsent,
  runCommand,
} from '@kinvolk/headlamp-plugin/lib';
import { Link, Loader } from '@kinvolk/headlamp-plugin/lib/CommonComponents';

interface BinarySettingsProps {
  settings: any;
  updateSettings: (settings: any) => void;
  data?: any; // Add this to be compatible with PluginSettingsDetailsProps
  onDataChange?: (data: any) => void; // Add this to be compatible with PluginSettingsDetailsProps
}

interface MinikubeStatus {
  type: string;
  name: string;
  host: string;
  kubelet: string;
  apiserver: string;
  kubeconfig: string;
}

export function BinarySettings({ settings, updateSettings, data, onDataChange }: BinarySettingsProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [minikubeStatus, setMinikubeStatus] = useState<MinikubeStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [toolsInfo, setToolsInfo] = useState([]);

  const updateExternalTools = useCallback(() => {
    async function realUpdateExternalTools() {
      setIsLoading(true);
      let tools = [];
      try {
        tools = await getExternalTools();
      } catch (error) {
        console.error('Failed to fetch tools:', error);
      }

      setIsLoading(false);
      setToolsInfo(tools);
    }

    realUpdateExternalTools();
  }, []);

  useEffect(() => {
    updateExternalTools();
  }, []);

  const minikubeTool = useMemo(() => {
    return toolsInfo.find(tool => tool.name === 'minikube');
  }, [toolsInfo, updateExternalTools]);

  // Fetch minikube status if it's installed
  useEffect(() => {
    refreshStatus();
  }, [minikubeTool]);

  const runCommandAsync = async (command: string, args: string[]) => {
    const commandProc = runCommand(command, args);
      const output = [];
      const errorOutput = [];
      let exitCode = -1;

      commandProc.stdout.on('data', data => {
        output.push(data);
      });

      commandProc.stderr.on('data', data => {
        errorOutput.push(data);
      });

      let stillRunning = true;

      if (stillRunning) {
        // Wait for the command to finish
        await new Promise(resolve => {
          commandProc.on('exit', (code) => {
            exitCode = code;
            resolve(null);
          });
        });
      }

      return {
        code: exitCode,
        success: exitCode === 0,
        stdout: output.join(''),
        stderr: errorOutput.join(''),
      };
    }

  const refreshStatus = async () => {
    if (minikubeTool?.installed && minikubeTool?.consented) {
      setStatusLoading(true);
      setStatusError(null);

      // Check for command consentiment


      try {
        const result = await runCommandAsync('minikube', ['status', '--output=json']);
        if (result.stdout) {
          try {
            const status = JSON.parse(result.stdout);
            setMinikubeStatus(status);
          } catch (e) {
            setStatusError('Failed to parse minikube status output');
          }
        } else {
          setStatusError(result.stderr || 'Failed to get minikube status');
        }
      } catch (error) {
        console.log('Error executing minikube status command:', error);
        setStatusError('Error executing minikube status command');
      } finally {
        setStatusLoading(false);
      }
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" padding={4}>
        <Loader title="Loading" />
      </Box>
    );
  }

  if (!minikubeTool) {
    return (
      <Box padding={2}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Minikube is not available in the list of supported external tools. This plugin requires Headlamp to support minikube as an external tool.
        </Alert>
        <Typography variant="body2" color="textSecondary">
          This plugin allows you to manage Minikube installation through Headlamp's binary management system,
          but the required tool is not available in your Headlamp installation.
        </Typography>
      </Box>
    );
  }

  function askForExternalToolConsent() {
    if (!minikubeTool) {
      return;
    }

    async function askAndWait() {
      setIsLoading(true);
      await changeExternalToolConsent(minikubeTool.name, true)
      setIsLoading(false);
      updateExternalTools();
    }

    askAndWait();
  }

  return (
    <Box padding={2}>
      <Box display="flex" alignItems="center">
        <Box flexGrow={1}>
          <Typography variant="h5" gutterBottom>
        External Tool: minikube
          </Typography>
        </Box>
        <Box>
          <Link routeName="externalTools">Check external tools</Link>
        </Box>
      </Box>

      <Typography variant="body2" color="textSecondary">
        This plugin allows you to check the status of minikube's CLI and displays the result of running
        a command with it.
      </Typography>

      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Status
          </Typography>
          <Box mb={3}>
            <Box display="flex" alignItems="center" mb={2}>
              <Box flexGrow={1} display="flex" alignItems="center">
                <Typography variant="body1" sx={{ mr: 1 }}>
                  Installation:
                </Typography>
                {minikubeTool?.installed ? (
                  <Box display="flex" alignItems="center" color="success.main">
                    <Icon icon="mdi:check-circle" style={{ marginRight: '4px' }} />
                    <Typography variant="body1">Installed</Typography>
                    {minikubeTool.headlampInstalled ? (
                      <Chip size="small" label="Headlamp" color="primary" sx={{ ml: 1 }} />
                    ) : minikubeTool.systemInstalled ? (
                      <Chip size="small" label="System" color="secondary" sx={{ ml: 1 }} />
                    ) : null}
                  </Box>
                ) : (
                  <Box display="flex" alignItems="center" color="error.main">
                    <Icon icon="mdi:close-circle" style={{ marginRight: '4px' }} />
                    <Typography variant="body1">Not Installed</Typography>
                  </Box>
                )}
              </Box>
            </Box>

            {minikubeTool && (
              <Box mb={2}>
                <Typography variant="body2">
                  Version: {minikubeTool.headlampInstalled
                    ? minikubeTool.version
                    : minikubeTool.systemVersion || minikubeTool.version || 'Unknown'}
                </Typography>
                {minikubeTool.systemInstalled && minikubeTool.systemPath && (
                  <Typography variant="body2">
                    System Path: {minikubeTool.systemPath}
                  </Typography>
                )}
                {minikubeTool.installed && (
                  <Typography variant="body2">
                    User allowed: {minikubeTool?.consented ? "Yes" : "No"}
                  </Typography>
                )}
                {minikubeTool.installed && !minikubeTool.consented && (
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={() => askForExternalToolConsent()}
                  >
                    Allow
                  </Button>
                )}
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            <Box display="flex" justifyContent="flex-start" mb={2}>
              <Button
                variant="outlined"
                color="primary"
                onClick={refreshStatus}
                startIcon={<Icon icon="mdi:refresh" />}
                disabled={statusLoading || !minikubeTool?.installed || !minikubeTool?.consented}
              >
                Run again
              </Button>
            </Box>

            <Box>
              <Typography variant="body2">
                Command: minikube status --output=json
              </Typography>
              <Typography variant="body2">
                Output:
              </Typography>
            </Box>

            {statusLoading ? (
              <Box display="flex" justifyContent="center" padding={2}>
                <Loader title="Loading" />
              </Box>
            ) : statusError ? (
              <Box color="error.main" padding={2} mb={2}>
                <Typography variant="body2">{statusError}</Typography>
              </Box>
            ) : minikubeStatus ? (
              <Paper variant="outlined" sx={{ padding: 2, mb: 2 }}>
                <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                  {Object.entries(minikubeStatus).map(([key, value]) => (
                    <Box key={key} display="flex" alignItems="center">
                      <Typography variant="body2" sx={{ fontWeight: 'bold', mr: 1 }}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}:
                      </Typography>
                      <Typography variant="body2">{value.toString()}</Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            ) : minikubeTool?.installed ? (
              <Typography variant="body2" mb={2}>No status information available</Typography>
            ) : (
              <Typography variant="body2" color="textSecondary" mb={2}>
                Install Minikube to check cluster status
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
