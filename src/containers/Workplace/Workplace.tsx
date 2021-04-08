import React from 'react';

import './Workplace.scss';

import Auxi from '../../hoc/Auxi';
import ApplicationBar from '../../components/ApplicationBar';

import BoardSelector from './BoardSelector';

const Workplace: React.FC = props => {
    return (
        <Auxi>
            <ApplicationBar
                title="Workplace"
                component={<BoardSelector />}
            />
        </Auxi>
    );
};

export default Workplace;