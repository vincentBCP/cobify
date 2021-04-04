import React from 'react';

import './ContactSupport.scss';

import Auxi from '../../hoc/Auxi';
import Header from '../../components/Header';

const ContactSupport: React.FC = props => {
    return (
        <Auxi>
            <Header title="Contact Support" />
        </Auxi>
    );
};

export default ContactSupport;