import { Chip, createStyles, makeStyles, Theme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import ResourceQuota from '../../lib/k8s/resourceQuota';
import { SectionBox, SectionFilterHeader } from '../common';
import ResourceTable from '../common/Resource/ResourceTable';

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
    <SectionBox title={<SectionFilterHeader title={t('glossary|Resource Quotas')} />}>
      <ResourceTable
        resourceClass={ResourceQuota}
        columns={[
          'name',
          'namespace',
          {
            label: t('frequent|Request'),
            getter: (item: ResourceQuota) => {
              const requests: JSX.Element[] = [];
              item.requests.forEach((request: string) => {
                requests.push(<Chip label={request} variant="outlined" />);
              });
              return <div className={classes.root}>{requests}</div>;
            },
          },
          {
            label: t('frequent|Limit'),
            getter: (item: ResourceQuota) => {
              const limits: JSX.Element[] = [];
              item.limits.forEach((limit: string) => {
                limits.push(<Chip label={limit} variant="outlined" />);
              });
              return <div className={classes.root}>{limits}</div>;
            },
          },
          'age',
        ]}
      />
    </SectionBox>
  );
}
