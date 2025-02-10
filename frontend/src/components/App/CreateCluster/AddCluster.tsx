import { InlineIcon } from '@iconify/react';
import { Button, Card, CardContent, CardHeader, Grid, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { createRouteURL } from '../../../lib/router';
import { DialogProps, PageGrid, SectionBox } from '../../common';
import MinikubeIcon from './minikube.svg?react';

export default function AddCluster(props: DialogProps & { onChoice: () => void }) {
  const { open } = props;
  const { t } = useTranslation(['translation']);
  const history = useHistory();

  if (!open) {
    return null;
  }

  return (
    <PageGrid>
      <SectionBox backLink title={t('translation|Add Cluster')} py={2} mt={[4, 0, 0]}>
        <Grid container justifyContent="flex-start" alignItems="stretch" spacing={4}>
          <Grid item xs={12}>
            <Typography>
              {t('Proceed to select your preferred method for cluster creation and addition')}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Button
                  onClick={() => history.push(createRouteURL('loadKubeConfig'))}
                  startIcon={<InlineIcon icon="mdi:plus-box-outline" />}
                >
                  {t('translation|Load from KubeConfig')}
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h4">{t('translation|Providers')}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardHeader title="Minikube" avatar={<MinikubeIcon width={24} height={24} />} />
              <CardContent>
                <Typography>
                  {t(
                    'translation|Minikube is a lightweight tool that simplifies the process of setting up a Kubernetes environment on your local PC. It provides a localStorage, single-node Kubernetes cluster that you can use for learning, development, and testing purposes.'
                  )}
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => history.push(createRouteURL('createClusterMinikube'))}
                  sx={{ mt: 2 }}
                >
                  {t('translation|Add')}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </SectionBox>
    </PageGrid>
  );
}
