import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import _ from 'lodash';
import React from 'react';
import { useParams } from 'react-router-dom';
import api, { useConnectApi } from '../../lib/api';
import { InfoLabel, ValueLabel } from '../common/Label';
import Loader from '../common/Loader';
import { MetadataDisplay } from '../common/Resource';
import SectionHeader from '../common/SectionHeader';

export default function SecretDetails(props) {
  const { namespace, name } = useParams();
  const [item, setItem] = React.useState(null);

  useConnectApi(
    api.secret.get.bind(null, namespace, name, setItem),
  );

  return (
    <Paper>
      <SectionHeader
        title="Secret"
      />
      <Box padding={2}>
        {item === null ?
          <Loader />
          :
          <Grid
            item
            container
            spacing={1}
            justify="flex-start"
            alignItems="flex-start"
            xs={12}
            lg
          >
            {/* @todo Restyle this */}
            <MetadataDisplay resource={item} />
            <InfoLabel name="Secret Type" value={item.type} />
            {/* @todo Don't display this directly (add another step for confirming to show it) */}
            <InfoLabel name="Secret Data">
              {_.map(item.data, (value, key) => {
                return (
                  <p key={key}><ValueLabel>{key}{': '}{value}</ValueLabel></p>
                );
              })}
            </InfoLabel>
          </Grid>
        }
      </Box>
    </Paper>
  );
}
