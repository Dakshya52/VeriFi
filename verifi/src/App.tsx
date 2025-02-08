import React from 'react';
import { Box, Typography } from '@mui/material';

const App: React.FC = () => {
  return (
    <Box sx={{ 
      width: 300,
      padding: 2,
      backgroundColor: 'background.paper',
      textAlign: 'center'
    }}>
      <Typography variant="h6" gutterBottom>
        Twitter Verifier Extension
      </Typography>
      <Typography variant="body2">
        Click the verify button on any tweet to check its authenticity!
      </Typography>
    </Box>
  );
};

export default App;