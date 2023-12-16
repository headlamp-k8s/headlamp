import { Box, Chip, Theme } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { useTranslation } from 'react-i18next';
import ResourceQuota from '../../lib/k8s/resourceQuota';
import ResourceListView from '../common/Resource/ResourceListView';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'left',
      flexWrap: 'wrap',
      '& > *': {
        margin: theme.spacing(0.5),
      },
    },
    chip: {
      paddingTop: '2px',
      paddingBottom: '2px',
    },
  })
);

export default function ResourceQuotaList() {
  const classes = useStyles();
  const { t } = useTranslation(['translation', 'glossary']);
  return (
    <ResourceListView
      title={t('glossary|Resource Quotas')}
      resourceClass={ResourceQuota}
      columns={[
        'name',
        'namespace',
        {
          id: 'requests',
          label: t('translation|Request'),
          getter: (item: ResourceQuota) => {
            const requests: JSX.Element[] = [];
            item.requests.forEach((request: string) => {
              requests.push(
                <Chip className={classes.chip} label={request} variant="outlined" size="small" />
              );
            });
            return <Box className={classes.root}>{requests}</Box>;
          },
          cellProps: {
            style: {
              width: 'fit-content',
              minWidth: '100%',
            },
          },
        },
        {
          id: 'limits',
          label: t('translation|Limit'),
          getter: (item: ResourceQuota) => {
            const limits: JSX.Element[] = [];
            item.limits.forEach((limit: string) => {
              limits.push(
                <Chip className={classes.chip} label={limit} variant="outlined" size="small" />
              );
            });
            return <Box className={classes.root}>{limits}</Box>;
          },
        },
        'age',
      ]}
    />
  );
}
