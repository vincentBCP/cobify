import React from 'react';

import './Guests.scss';

import Auxi from '../../hoc/Auxi';
import ApplicationBar from '../../components/ApplicationBar';
import Page from '../../components/Page';

const Guests: React.FC = props => {
    return (
        <Auxi>
            <ApplicationBar title="Guests" />

            <Page title="Guests"></Page>
        </Auxi>
    );
};

export default Guests;