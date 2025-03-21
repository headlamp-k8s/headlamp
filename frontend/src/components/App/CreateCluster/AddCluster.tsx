import { InlineIcon } from '@iconify/react';
import { Button, Card, CardContent, Grid, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { createRouteURL } from '../../../lib/router';
import { useTypedSelector } from '../../../redux/reducers/reducers';
import { DialogProps, PageGrid, SectionBox } from '../../common';

export default function AddCluster(props: DialogProps & { onChoice: () => void }) {
  const { open } = props;
  const { t } = useTranslation(['translation']);
  const history = useHistory();

  // get addClusterProviders from clusterProviderSlice
  const addClusterProviders = useTypedSelector(state => state.clusterProvider.addClusterProviders);

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
          {addClusterProviders.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h4">{t('translation|Providers')}</Typography>
            </Grid>
          )}
          {addClusterProviders.length > 0 && (
            <Grid item xs={12}>
              {addClusterProviders.map((AddClusterProvider, index) => (
                <AddClusterProvider key={index} />
              ))}
            </Grid>
          )}
        </Grid>
      </SectionBox>
    </PageGrid>
  );
}
