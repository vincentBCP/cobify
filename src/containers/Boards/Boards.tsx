import React from 'react';

import './Boards.scss';

import Auxi from '../../hoc/Auxi';
import Header from '../../components/Header';

const Boards: React.FC = props => {
    return (
        <Auxi>
            <Header title="Boards" />
        </Auxi>
    );
};

export default Boards;