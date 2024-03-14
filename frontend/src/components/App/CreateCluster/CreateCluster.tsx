import { InlineIcon } from '@iconify/react';
import Button from '@mui/material/Button';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { clusterAction } from '../../../redux/clusterActionSlice';
import ActionButton from '../../common/ActionButton/ActionButton';
import { runCommand } from '../runCommand';
import CreateClusterDialog from './CreateClusterDialog';

interface CreateClusterProps {
  isNarrow?: boolean;
}

export default function CreateCluster(props: CreateClusterProps) {
  const { isNarrow } = props;
  const [openDialog, setOpenDialog] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [saving, setSaving] = React.useState(false);
  const [creatingDone, setCreatingDone] = React.useState(false);
  const [savingLines, setSavingLines] = React.useState<string[]>([]);

  const { t } = useTranslation(['translation']);
  const dispatch = useDispatch();
  const allDataRef = React.useRef<string[]>([]);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setSavingLines([...allDataRef.current]);
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  console.log(openDialog, errorMessage, setErrorMessage, setSavingLines, savingLines);

  function handleSave({ clusterName }: { clusterName: string; clusterType: string }) {
    console.log('runFunc handleSave', clusterName);
    setSaving(true);

    function runFunc(clusterName: string) {
      const minikube = runCommand('minikube', ['start', '-p', clusterName], {});
      const stdoutData: string[] = [];
      const errorData: string[] = [];

      minikube.stdout.on('data', data => {
        console.log('runFunc stdout:', data);
        stdoutData.push(data);
        allDataRef.current.push(data);

        if (data.includes('Done! kubectl')) {
          setCreatingDone(true);
        }
      });
      minikube.stderr.on('data', (data: string) => {
        console.log('runFunc stderr:', data);
        errorData.push(data);
        allDataRef.current.push(data);
      });
      minikube.on('runFunc exit', code => {
        console.log('runFunc exit code:', code);
        setCreatingDone(true);
        // if (code === 0) {
        //   resolve({ stdoutData, errorData });
        // } else {
        //   reject({ stdoutData, errorData });
        // }
      });

      console.log('runFunc finished');
    }
    console.log('runFunc dispatching', clusterName);

    dispatch(
      clusterAction(async () => runFunc(clusterName), {
        startMessage: t('About to create cluster "{{ clusterName }}"…', { clusterName }),
        cancelledMessage: t('Cancelled creating cluster {{ clusterName }}.', { clusterName }),
        successMessage: t('Cluster creation of "{{ clusterName }}" started.', { clusterName }),
        errorMessage: t('Failed to create {{ clusterName }}.', { clusterName }),
        // cancelUrl,
        // errorUrl: cancelUrl,
      })
    );
  }

  return (
    <React.Fragment>
      {isNarrow ? (
        <ActionButton
          description={t('translation|New Cluster')}
          onClick={() => setOpenDialog(true)}
          icon="mdi:plus-box-outline"
          color="#adadad"
          width={38}
          iconButtonProps={{
            color: 'primary',
          }}
        />
      ) : (
        <Button
          onClick={() => {
            setOpenDialog(true);
          }}
          startIcon={<InlineIcon icon="mdi:plus-box-outline" />}
        >
          {t('translation|New Cluster')}
        </Button>
      )}
      <CreateClusterDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSave}
        saveLabel={t('translation|Create')}
        errorMessage={errorMessage}
        onEditorChanged={() => setErrorMessage('')}
        title={saving ? t('translation|Creating Cluster') : t('translation|New Cluster')}
        saving={saving}
        savingLines={allDataRef.current}
        creatingDone={creatingDone}
      />
    </React.Fragment>
  );
}
