import React from 'react';

import './Workplace.scss';

import Auxi from '../../hoc/Auxi';
import ApplicationBar from '../../components/ApplicationBar';

const Workplace: React.FC = props => {
    return (
        <Auxi>
            <ApplicationBar title="Workplace" />
        </Auxi>
    );
};

export default Workplace;