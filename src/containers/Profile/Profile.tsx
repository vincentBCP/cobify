import React from 'react';
import { useSelector } from 'react-redux';

import ApplicationBar from '../../components/ApplicationBar';
import Page from '../../components/Page';

import PublicInfo from './PublicInfo';
import Account from './Account';

const Profile: React.FC = props => {
    const account: any = useSelector((state: any) => state.app.account);

    return (
        <React.Fragment>
            <ApplicationBar title="Profile" />

            <Page title="Profile">
                <PublicInfo account={account} />
                <Account account={account} />
            </Page>
        </React.Fragment>
    );
};

export default Profile;