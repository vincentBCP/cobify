import React from 'react';

import './Workplace.scss';

import Auxi from '../../hoc/Auxi';
import Header from '../../components/Header';

const Workplace: React.FC = props => {
    return (
        <Auxi>
            <Header title="Workplace" />
        </Auxi>
    );
};

export default Workplace;