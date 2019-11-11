import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import React from 'react';

export default function Empty(props) {
  return (
    <Box padding={2}>
      {React.Children.map(props.children, child => {
        if (typeof child === 'string') {
          return <Typography color="textSecondary" align="center">{child}</Typography>;
        }
        return child;
      })
      }
    </Box>
  );
}
