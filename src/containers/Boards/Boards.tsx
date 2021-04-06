import React from 'react';

import './Boards.scss';

import Auxi from '../../hoc/Auxi';
import ApplicationBar from '../../components/ApplicationBar';
import Page from '../../components/Page';

const Boards: React.FC = props => {
    return (
        <Auxi>
            <ApplicationBar title="Boards" />

            <Page title="Boards"></Page>
        </Auxi>
    );
};

export default Boards;