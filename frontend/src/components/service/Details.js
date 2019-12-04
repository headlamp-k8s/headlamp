import chevronRight from '@iconify/icons-mdi/chevron-right';
import { InlineIcon } from '@iconify/react';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useParams } from 'react-router-dom';
import api, { useConnectApi } from '../../lib/api';
import { ValueLabel } from '../common/Label';
import Loader from '../common/Loader';
import { MainInfoSection, MetadataDictGrid, PageGrid } from '../common/Resource';
import { SectionBox } from '../common/SectionBox';
import SectionHeader from '../common/SectionHeader';
import SimpleTable from '../common/SimpleTable';

const useStyles = makeStyles(theme => ({
  root: {
    width: 'fit-content',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.secondary,
    paddingTop: theme.spacing(.5),
    paddingBottom: theme.spacing(.5),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

export default function ServiceDetails(props) {
  const classes = useStyles();
  const { namespace, name } = useParams();
  const [item, setItem] = React.useState(null);

  useConnectApi(
    api.service.get.bind(null, namespace, name, setItem),
  );

  return (
    !item ? <Loader /> :
    <PageGrid
      sections={[
        <MainInfoSection
          resource={item}
          mainInfo={item && [
            {
              name: 'Type',
              value: item.spec.type,
            },
            {
              name: 'Cluster IP',
              value: item.spec.clusterIP,
            },
            {
              name: 'Selector',
              value: <MetadataDictGrid dict={item.spec.selector} />,
            },
          ]}
        />,
        <Paper>
          <SectionHeader
            title="Ports"
          />
          <SectionBox>
            <SimpleTable
              data={item.spec.ports}
              columns={[
                {
                  label: 'Protocol',
                  datum: 'protocol',
                },
                {
                  label: 'Name',
                  datum: 'name',
                },
                {
                  label: 'Ports',
                  getter: ({port, targetPort}) =>
                    <React.Fragment>
                      <ValueLabel>{port}</ValueLabel>
                      <InlineIcon icon={chevronRight} />
                      <ValueLabel>{targetPort}</ValueLabel>
                    </React.Fragment>
                },
              ]}
            />
          </SectionBox>
        </Paper>
      ]}
    />
  );
}
