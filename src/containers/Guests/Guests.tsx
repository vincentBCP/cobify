import React from 'react';

import './Guests.scss';

import Auxi from '../../hoc/Auxi';
import Header from '../../components/Header';

const Guests: React.FC = props => {
    return (
        <Auxi>
            <Header title="Guests" />
        </Auxi>
    );
};

export default Guests;