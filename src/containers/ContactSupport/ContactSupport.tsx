import React from 'react';

import './ContactSupport.scss';

import Auxi from '../../hoc/Auxi';
import ApplicationBar from '../../components/ApplicationBar';
import Page from '../../components/Page';

const ContactSupport: React.FC = props => {
    return (
        <Auxi>
            <ApplicationBar title="Contact Support" />

            <Page title="Contact support"></Page>
        </Auxi>
    );
};

export default ContactSupport;