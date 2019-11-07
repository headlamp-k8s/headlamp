import Typography from '@material-ui/core/Typography';
import React from 'react';
import api from '../lib/api';

export default function ClusterOverview(props) {
  const [pods, setPods] = React.useState(null);
  const [events, setEvents] = React.useState(null);
  const [nodes, setNodes] = React.useState(null);

  React.useEffect(() => {
    api.pod.list(null, setPods);
    api.event.list(null, setEvents);
    api.node.list(setNodes);
  },
    []);

  return (
    <Typography paragraph>
      Hello
      {/* {JSON.stringify(pods)} */}
      {JSON.stringify(events)}
      {JSON.stringify(nodes)}
    </Typography>
  );
}
