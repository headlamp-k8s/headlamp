import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import _ from 'lodash';
import React from 'react';
import { useParams } from "react-router-dom";
import api, { useConnectApi } from '../../lib/api';
import { InfoLabel, ValueLabel } from '../common/Label';
import Loader from '../common/Loader';
import SectionHeader from '../common/SectionHeader';
import SimpleTable from '../common/SimpleTable';

export default function IngressDetails(props) {
  let { namespace, name } = useParams();
  const [item, setItem] = React.useState(null);

  useConnectApi(
    api.ingress.get.bind(null, namespace, name, setItem),
  );

  function getHostsData() {
    let data =[];
    item.spec.rules.forEach(({host, http}) => {
      http.paths.forEach(pathData => {
        data.push({...pathData, host: host});
      })
    });

    return data;
  }

  return (
    <Paper>
      <SectionHeader
        title="Ingress"
      />
      <Box padding={2}>
        {item === null ?
          <Loader />
        :
          <React.Fragment>
            <Grid
              item
              container
              spacing={1}
              justify="flex-start"
              alignItems="flex-start"
              xs={12}
              lg
            >
              <InfoLabel name="Name" value={item.metadata.name} />
              <InfoLabel name="Namespace" value={item.metadata.namespace} />
              <InfoLabel name="Version" value={item.metadata.resourceVersion} />
              <InfoLabel name="Creation">
                <ValueLabel>{new Date(item.metadata.creationTimestamp).toLocaleString()}</ValueLabel>
              </InfoLabel>
              {/* @todo Restyle this */}
              <InfoLabel name="Annotations">
                {_.map(item.metadata.annotations, (value, key) => {
                  return (
                    <p key={key}><ValueLabel>{key}{': '}{value}</ValueLabel></p>
                  );
                })}
              </InfoLabel>
            </Grid>
            <SimpleTable
              rowsPerPage={[15, 25, 50]}
              emptyMessage="No host data to be shown."
              columns={[
                {
                  label: 'Host',
                  getter: (data) => data.host
                },
                {
                  label: 'Path',
                  getter: (data) => data.path || ""
                },
                {
                  label: 'Service',
                  getter: (data) => data.backend.serviceName
                },
                {
                  label: 'Port',
                  getter: (data) => data.backend.servicePort
                },
              ]}
              data={getHostsData()}
            />
          </React.Fragment>
        }
      </Box>
    </Paper>
  );
}