import { Icon } from '@iconify/react';
import { Box } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import DialogContentText from '@material-ui/core/DialogContentText';
import MobileStepper from '@material-ui/core/MobileStepper';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath } from 'react-router';
import { useHistory } from 'react-router-dom';
import helpers from '../../helpers';
import { refreshConfig } from '../../lib/k8s';
import { getClusterPrefixedPath } from '../../lib/util';
import { ClusterDialog } from '../cluster/Chooser';
import { DialogTitle } from '../common/Dialog';

const useStyle = makeStyles({
  card: {
    padding: '1rem 2rem',
  },
  image: {
    width: '90%',
  },
});

interface clickCallbackType {
  (event: React.MouseEvent<HTMLElement>): void;
}

export interface PureDockerDesktopSetupProps {
  onDone: clickCallbackType;
}

export function PureDockerDesktopSetup({ onDone }: PureDockerDesktopSetupProps) {
  const classes = useStyle();
  const { t } = useTranslation(['dockerDesktopSetup', 'frequent']);

  const steps = [
    {
      label: t('dockerDesktopSetup|Go to Docker Desktop Settings'),
      description: t('dockerDesktopSetup|From the Docker Dashboard, select the Setting icon.'),
      image: '/ddSetup1.png',
    },
    {
      label: t('dockerDesktopSetup|Select Kubernetes'),
      description: t('dockerDesktopSetup|Select Kubernetes from the left menu.'),
      image: '/ddSetup2.png',
    },
    {
      label: t('dockerDesktopSetup|Enable Kubernetes'),
      description: t('dockerDesktopSetup|Next to Enable Kubernetes, select the checkbox.'),
      image: '/ddSetup3.png',
    },
    {
      label: t('dockerDesktopSetup|Apply Changes'),
      description: t('dockerDesktopSetup|Click Apply & Restart to apply the changes.'),
      image: '/ddSetup4.png',
    },
    {
      label: t('dockerDesktopSetup|Click Install'),
      description: t('dockerDesktopSetup|In the popup dialog click Install.'),
      image: '/ddSetup5.png',
    },
  ];

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  return (
    <ClusterDialog open useCover>
      <DialogTitle>
        {t('dockerDesktopSetup|Enable Kubernetes in Docker Desktop to continue')}
      </DialogTitle>
      <DialogContentText>
        <Paper square elevation={3}>
          <Card className={classes.card}>
            <Typography variant="h1">{`${activeStep + 1}.${steps[activeStep].label}`}</Typography>
            <Typography>{steps[activeStep].description}</Typography>
            <CardMedia
              component="img"
              className={classes.image}
              image={
                helpers.isDockerDesktop() ? `.${steps[activeStep].image}` : steps[activeStep].image
              }
              title={steps[activeStep].label}
            />
          </Card>
          <MobileStepper
            variant="dots"
            steps={steps.length}
            position="static"
            activeStep={activeStep}
            nextButton={
              <Button size="small" onClick={handleNext} disabled={activeStep === steps.length - 1}>
                <Icon icon="material-symbols:arrow-forward-ios-rounded" />
              </Button>
            }
            backButton={
              <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                <Icon icon="material-symbols:arrow-back-ios-new-rounded" />
              </Button>
            }
          />
        </Paper>
      </DialogContentText>
      <Box m={1} display="flex" justifyContent="flex-end" alignItems="flex-end">
        <Button size="large" onClick={onDone} color="primary">
          {t('frequent|Done')}
        </Button>
      </Box>
    </ClusterDialog>
  );
}

export default function DockerDesktopSetup() {
  const history = useHistory();

  async function refreshAndCheckConfig() {
    const config = await refreshConfig();
    if (config && config['clusters'].length > 0) {
      helpers.setRecentCluster(config['clusters'][0]);
      history.push({
        pathname: generatePath(getClusterPrefixedPath(), {
          cluster: config['clusters'][0].name,
        }),
      });
    }
  }

  useEffect(() => {
    const interval = setInterval(refreshAndCheckConfig, 30000);
    refreshAndCheckConfig();
    return () => clearInterval(interval);
  }, []);

  return <PureDockerDesktopSetup onDone={refreshAndCheckConfig} />;
}
