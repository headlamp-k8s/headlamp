import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { clusterAction } from '../../../redux/clusterActionSlice';
import { AppDispatch } from '../../../redux/stores/store';
import { runCommand } from '../runCommand';
import CommandDialog from './CommandDialog';

const DEBUG = false;

interface CommandClusterProps {
  /**
   * Function to call when the command is about to be started (but not quite started yet)
   * The user can cancel the command still.
   */
  onCommandStarted?: () => void;
  /** should it use a dialog or use a grid? */
  useGrid?: boolean;
  /** Is the dialog open? */
  open?: boolean;
  /** The name of the cluster to act on */
  initialClusterName?: string;
  /** The function to call when the dialog is closed */
  handleClose: () => void;
  /** The function to call when the user confirms the action */
  onConfirm: () => void;
  /** Command to run (stop, start, delete, etc) */
  command: string;
  /** Text to look for in the output to determine if the command is finished */
  finishedText: string;
  /** Ask for the cluster name. Otherwise the initialClusterName is used. */
  askClusterName?: boolean;
}

/**
 * Runs a command on a cluster, and shows the output in a dialog.
 */
export default function CommandCluster(props: CommandClusterProps) {
  const {
    onCommandStarted,
    open: startOpen,
    initialClusterName,
    handleClose,
    onConfirm,
    command,
    finishedText,
    askClusterName,
  } = props;
  const [openDialog, setOpenDialog] = React.useState(false);
  const [acting, setActing] = React.useState(false);
  const [running, setRunning] = React.useState(false);
  const [runningLines, setRunningLines] = React.useState<string[]>([]);
  const [commandDone, setCommandDone] = React.useState(false);
  const { t } = useTranslation(['translation']);
  const dispatch: AppDispatch = useDispatch();

  const allDataRef = React.useRef<string[]>([]);

  React.useEffect(function updateRunningLines() {
    // Make sure react gets notified of the changes to the array
    const intervalId = setInterval(() => {
      setRunningLines([...allDataRef.current]);
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  React.useEffect(() => {
    if (startOpen) {
      setOpenDialog(true);
    }
  }, [startOpen]);

  function handleRunCommand({ clusterName }: { clusterName: string }) {
    if (DEBUG) {
      console.log('runFunc handleSave', clusterName);
    }
    setActing(true);
    onCommandStarted && onCommandStarted();

    function runFunc(clusterName: string) {
      const minikube = runCommand('minikube', [command, '-p', clusterName], {});
      const stdoutData: string[] = [];
      const errorData: string[] = [];
      setRunning(true);

      minikube.stdout.on('data', data => {
        if (DEBUG) {
          console.log('runFunc stdout:', data);
        }
        stdoutData.push(data);
        allDataRef.current.push(data);

        if (data.includes(finishedText)) {
          setCommandDone(true);
        }
      });
      minikube.stderr.on('data', (data: string) => {
        if (DEBUG) {
          console.log('runFunc stderr:', data);
        }
        errorData.push(data);
        allDataRef.current.push(data);
      });
      minikube.on('runFunc exit', code => {
        if (DEBUG) {
          console.log('runFunc exit code:', code);
        }
        setCommandDone(true);
        setActing(false);
        setRunning(false);
        // if (code === 0) {
        //   resolve({ stdoutData, errorData });
        // } else {
        //   reject({ stdoutData, errorData });
        // }
      });

      onConfirm();
      if (DEBUG) {
        console.log('runFunc finished');
      }
    }
    if (DEBUG) {
      console.log('runFunc dispatching', clusterName);
    }

    dispatch(
      clusterAction(() => runFunc(clusterName), {
        startMessage: t('About to "{{ command }}" cluster "{{ clusterName }}"…', {
          command,
          clusterName,
        }),
        cancelledMessage: t('Cancelled "{{ command }}" cluster {{ clusterName }}.', {
          command,
          clusterName,
        }),
        successMessage: t('Cluster "{{ command }}" of "{{ clusterName }}" begun.', {
          command,
          clusterName,
        }),
        errorMessage: t('Failed to "{{ command }}" {{ clusterName }}.', { command, clusterName }),
        cancelCallback: () => {
          setActing(false);
          setRunning(false);
          handleClose();
          setOpenDialog(false);
        },
      })
    );
  }

  return (
    <CommandDialog
      open={openDialog}
      onClose={() => {
        setOpenDialog(false);
        handleClose();
        allDataRef.current = [];
        setActing(false);
        setCommandDone(false);
      }}
      onConfirm={({ clusterName }) => handleRunCommand({ clusterName })}
      command={command}
      title={
        askClusterName
          ? acting
            ? t('translation|Creating Minikube Cluster')
            : t('translation|New Minikube Cluster')
          : acting
          ? t('translation|Running "{{ command }}" on Minikube Cluster', { command })
          : t('translation|Running "{{ command }}" on Minikube Cluster', { command })
      }
      acting={acting}
      running={running}
      actingLines={runningLines}
      commandDone={commandDone}
      useGrid={props.useGrid}
      initialClusterName={initialClusterName}
      askClusterName={askClusterName}
    />
  );
}
