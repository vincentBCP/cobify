import React from 'react';
import { useSelector } from 'react-redux';

import './Account.scss';

import Auxi from '../../hoc/Auxi';
import ApplicationBar from '../../components/ApplicationBar';
import Page from '../../components/Page';

import PublicInfo from './PublicInfo';
import ContactDetails from './ContactDetails';

const Account: React.FC = props => {
    const account: any = useSelector((state: any) => state.app.account);

    return (
        <Auxi>
            <ApplicationBar title="Account" />

            <Page title="Account">
                <PublicInfo account={account} />
                <ContactDetails email={account.email} />
            </Page>
        </Auxi>
    );
};

export default Account;