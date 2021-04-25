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

import * as actions from './store/actions';

import User from './models/types/User';
import UserRole from './models/enums/UserRole';

import ErrorContext from './context/errorContext';

import firebase from './firebase';

interface IAppProps {
    checkAuth: () => Promise<User>,
    getBoards: (arg1: User) => Promise<any>,
    getColumns: (arg1: User) => Promise<any>,
    getUsers: (arg1: User) => Promise<any>,
    getTasks: (arg1: User) => Promise<any>,
    getInvitations: (arg1: User) => Promise<any>,
    getComments: (arg1: User) => Promise<any>
}

const App: React.FC<IAppProps> = props => {
    const { checkAuth, getBoards, getColumns, getUsers, getTasks, getInvitations, getComments } = props;
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [account, setAccount] = useState<User | null>();

    const errorContext = React.useContext(ErrorContext);

    /*useEffect(() => {
        if (!account) return;

        var tasksRef = firebase.database().ref('tasks');

        tasksRef.on('child_added', (data) => {
            console.log("added");
            console.log(data);
        });

        tasksRef.on('child_changed', (data) => {
            console.log("changed");
            console.log(data);
        });

        tasksRef.on('child_removed', (data) => {
            console.log("removed");
            console.log(data);
        });
    }, [account]);*/

    useEffect(() => {
        checkAuth()
        .then(acct => {
            if (Boolean(acct)) {
                setAccount(acct);
            }

            setIsLoggedIn(Boolean(acct));
            setLoading(Boolean(acct));
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
            getComments(account)
        );

        setLoading(true);

        Promise.all(promises)
        .then(() => { })
        .catch(error => {
            errorContext.setError(error);
        })
        .finally(() => setLoading(false));
    }, [ account, getBoards, getColumns, getUsers, getTasks, getInvitations, getComments, errorContext ]);

    let routes = account?.role === UserRole.SYSADMIN
        ? <Switch>
            <Route path="/accounts" component={Accounts} />
            <Route path="/contactSupport" component={ContactSupport} exact={true} />
            <Route path="/logout" component={Logout} exact={true} />
            <Redirect to="/accounts" />
        </Switch>
        : <Switch>
            <Route path="/workplace/:boardCode?/:taskCode?" component={Workplace} />
            <Route path="/profile" component={Profile} exact={true} />
            {account?.role === UserRole.ADMIN ? <Route path="/boards" component={Boards} exact={true} /> : null}
            {account?.role === UserRole.ADMIN ? <Route path="/users" component={Users} exact={true} /> : null}
            <Route path="/contactSupport" component={ContactSupport} exact={true} />
            <Route path="/logout" component={Logout} exact={true} />
            <Redirect to="/workplace" />
        </Switch>;

    if(loading) return <PreLoader />;

    if (!isLoggedIn) {
        return (
            <Switch>
                <Route path="/login" component={Login} exact={true} />
                <Route path="/resetPassword" component={Login} exact={true} />
                <Redirect to="/login" />
            </Switch>
        );
    }

    if (!account) {
        return <PreLoader />;
    }

    return (
        <div id="App">
            <SideNavigation />
            <main id="AppContent">
                { routes }
            </main>
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
        getComments: (account: User) => dispatch(actions.getComments(account))
    }
};

export default connect(null, mapDispatchToProps)(App);