import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import { useParams } from "react-router-dom";
import api, { useConnectApi } from '../../lib/api';
import Loader from '../common/Loader';
import { MetadataDisplay } from '../common/Resource';
import SectionHeader from '../common/SectionHeader';

export default function NamespaceDetails(props) {
  let { name } = useParams();
  const [item, setItem] = React.useState(null);

  useConnectApi(
    api.namespace.get.bind(null, name, setItem),
  );

  return (
    <Paper>
      <SectionHeader
        title="Namespace"
      />
      <Box padding={2}>
        {item === null ?
          <Loader />
        :
          <MetadataDisplay resource={item} />
        }
      </Box>
    </Paper>
  );
}