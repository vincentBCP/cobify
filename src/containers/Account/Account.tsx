import React from 'react';
import { useSelector } from 'react-redux';

import './Account.scss';

import Auxi from '../../hoc/Auxi';
import ApplicationBar from '../../components/ApplicationBar';
import Page from '../../components/Page';

import PublicInfo from './PublicInfo';
import ContactDetails from './ContactDetails';

const Account: React.FC = props => {
    const user: any = useSelector((state: any) => state.app.user);

    return (
        <Auxi>
            <ApplicationBar title="Account" />

            <Page title="Account">
                <PublicInfo user={user} />
                <ContactDetails email={user.email} />
            </Page>
        </Auxi>
    );
};

export default Account;