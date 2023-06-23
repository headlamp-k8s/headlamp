import { Box, Chip, createStyles, makeStyles, Theme } from '@material-ui/core';
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
  })
);

export default function ResourceQuotaList() {
  const classes = useStyles();
  const { t } = useTranslation(['frequent', 'glossary']);
  return (
    <ResourceListView
      title={t('glossary|Resource Quotas')}
      resourceClass={ResourceQuota}
      columns={[
        'name',
        'namespace',
        {
          id: 'requests',
          label: t('frequent|Request'),
          getter: (item: ResourceQuota) => {
            const requests: JSX.Element[] = [];
            item.requests.forEach((request: string) => {
              requests.push(<Chip label={request} variant="outlined" />);
            });
            return <Box className={classes.root}>{requests}</Box>;
          },
        },
        {
          id: 'limits',
          label: t('frequent|Limit'),
          getter: (item: ResourceQuota) => {
            const limits: JSX.Element[] = [];
            item.limits.forEach((limit: string) => {
              limits.push(<Chip label={limit} variant="outlined" />);
            });
            return <Box className={classes.root}>{limits}</Box>;
          },
        },
        'age',
      ]}
    />
  );
}
