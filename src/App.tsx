import React, { useState, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import './App.scss';

import SideNavigation from './components/SideNavigation';

import Workplace from './containers/Workplace';
import Profile from './containers/Profile';
import Boards from './containers/Boards';
import Users from './containers/Users';
import Accounts from './containers/Accounts';
import ContactSupport from './containers/ContactSupport';
import Login from './containers/Login';
import Logout from './containers/Logout';
import PreLoader from './components/PreLoader';
import SignUp from './containers/SignUp';

import * as actions from './store/actions';

import User from './models/types/User';
import UserRole from './models/enums/UserRole';

import ErrorContext from './context/errorContext';
import ErrorProvider from './context/errorContext/errorProvider';
import AppProvider from './context/appContext/appProvider';

// import firebase from './firebase';

interface IAppProps {
    checkAuth: () => Promise<User>,
    getBoards: (arg1: User) => Promise<any>,
    getColumns: (arg1: User) => Promise<any>,
    getUsers: (arg1: User) => Promise<any>,
    getTasks: (arg1: User) => Promise<any>,
    getInvitations: (arg1: User) => Promise<any>,
    getComments: (arg1: User) => Promise<any>,
    getNotifications: (arg1: User) => Promise<any>,
    getLabels: (arg1: User) => Promise<any>
}

const App: React.FC<IAppProps> = props => {
    const { checkAuth, getBoards, getColumns, getUsers, getTasks, 
        getInvitations, getComments, getNotifications, getLabels } = props;
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [account, setAccount] = useState<User | null>();

    const errorContext = React.useContext(ErrorContext);

    useEffect(() => {
        checkAuth()
        .then(acct => {
            setAccount(acct);
            setIsLoggedIn(true);
        })
        .catch(error => {
            setAccount(null);
            setLoading(false);
            setIsLoggedIn(false);
        });
    }, [ checkAuth ]);

    useEffect(() => {
        if (!account) return;

        const promises = [];

        promises.push(
            getBoards(account),
            getColumns(account),
            getUsers(account),
            getTasks(account),
            getInvitations(account),
            getComments(account),
            getNotifications(account),
            getLabels(account)
        );

        setLoading(true);

        Promise.all(promises)
        .then(() => { })
        .catch(error => {
            errorContext.setError(error);
        })
        .finally(() => setLoading(false));
    }, [ account, getBoards, getColumns, getUsers, getTasks, getInvitations, 
        getComments, getLabels, getNotifications, errorContext ]);

    let routes = account?.role === UserRole.SYSADMIN
        ? <Switch>
            <Route path="/accounts" component={Accounts} exact={true} />
            <Route path="/contactSupport" component={ContactSupport} exact={true} />
            <Route path="/logout" component={Logout} exact={true} />
            <Route path="/login" exact={true} render={() => <Redirect to="/accounts" />} />
            <Route path="/" exact={true} render={() => <Redirect to="/accounts" />} />
            <Redirect to="/404" />
        </Switch>
        : <Switch>
            <Route path="/workplace/:boardCode?/:taskCode?" component={Workplace} />
            <Route path="/profile" component={Profile} exact={true} />
            {account?.role === UserRole.ADMIN ? <Route path="/boards" component={Boards} exact={true} /> : null}
            {account?.role === UserRole.ADMIN ? <Route path="/users" component={Users} exact={true} /> : null}
            <Route path="/contactSupport" component={ContactSupport} exact={true} />
            <Route path="/logout" component={Logout} exact={true} />
            <Route path="/login" exact={true} render={() => <Redirect to="/workplace" />} />
            <Route path="/" exact={true} render={() => <Redirect to="/workplace" />} />
            <Redirect to="/404" />
        </Switch>;

    if(loading) return <PreLoader />;

    if (!isLoggedIn) {
        return (
            <AppProvider>
                <Switch>
                    <Route path="/login" component={Login} exact={true} />
                    <Route path="/resetPassword" component={Login} exact={true} />
                    <Route path="/signUp" component={SignUp} exact={true} />
                    <Route path="/logout" exact={true} render={() => <Redirect to="/login" />} />
                    <Route path="/" exact={true} render={() => <Redirect to="/login" />} />
                    <Redirect to="/" />
                </Switch>
            </AppProvider>
        );
    }

    return (
        <div id="App">
            <AppProvider>
                <ErrorProvider>
                    <SideNavigation />
                    <main id="AppContent">
                        { routes }
                    </main>
                </ErrorProvider>
            </AppProvider>
        </div>
    );
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        checkAuth: () => dispatch(actions.checkAuth()),
        getBoards: (account: User) => dispatch(actions.getBoards(account)),
        getColumns: (account: User) => dispatch(actions.getColumns(account)),
        getUsers: (account: User) => dispatch(actions.getUsers(account)),
        getTasks: (account: User) => dispatch(actions.getTasks(account)),
        getInvitations: (account: User) => dispatch(actions.getInvitations(account)),
        getComments: (account: User) => dispatch(actions.getComments(account)),
        getNotifications: (account: User) => dispatch(actions.getNotifications(account)),
        getLabels: (account: User) => dispatch(actions.getLabels(account))
    }
};

export default connect(null, mapDispatchToProps)(App);