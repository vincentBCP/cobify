import React from 'react';

import Typography from '@material-ui/core/Typography';

interface ILogoProps {
    invert?: boolean
}

const Logo: React.FC<ILogoProps> = props => {
    return (
        <Typography style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: props.invert ? '#233044' : '#c5c8cc',
            fontStyle: 'italic'
        }}>Cobify</Typography>
    );
};

export default Logo;