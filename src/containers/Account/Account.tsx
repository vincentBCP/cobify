import React from 'react';

import './Account.scss';

import Auxi from '../../hoc/Auxi';
import Header from '../../components/Header';

const Account: React.FC = props => {
    return (
        <Auxi>
            <Header title="Account" />
        </Auxi>
    );
};

export default Account;