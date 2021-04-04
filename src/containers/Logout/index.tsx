import React from 'react';
import { Redirect } from 'react-router-dom';

const Logout: React.FC = props => {
    return (
        <Redirect to="/" />
    );
};

export default Logout;