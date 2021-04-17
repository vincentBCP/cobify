import React from 'react';

import Typography from '@material-ui/core/Typography';

const Logo: React.FC = props => {
    return (
        <Typography style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: '#c5c8cc',
            fontStyle: 'italic'
        }}>Cobify</Typography>
    );
};

export default Logo;