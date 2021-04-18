import React, { useState, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useDispatch, connect } from 'react-redux';

import './App.scss';

import SideNavigation from './components/SideNavigation';

import Workplace from './containers/Workplace';
import Account from './containers/Account';
import Boards from './containers/Boards';
import Users from './containers/Users';
import ContactSupport from './containers/ContactSupport';
import Login from './containers/Login';
import ResetPassword from './containers/ResetPassword';
import Logout from './containers/Logout';
import PreLoader from './components/PreLoader';

import * as actions from './store/actions';

interface IAppProps {
    checkAuth: () => Promise<boolean>,
    getBoards: () => Promise<any>,
    getColumns: () => Promise<any>,
    getUsers: () => Promise<any>,
    getTasks: () => Promise<any>,
    getInvitations: () => Promise<any>,
    getComments: () => Promise<any>
}

const App: React.FC<IAppProps> = props => {
    const { checkAuth, getBoards, getColumns, getUsers, getTasks, getInvitations, getComments } = props;
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const dispatch = useDispatch();
    
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth()
        .then(b => {
            setIsLoggedIn(b);
            return b;
        })
        .then(b => {
            if (!b) {
                return;
            }

            const promises = [];

            promises.push(
                getBoards(),
                getColumns(),
                getUsers(),
                getTasks(),
                getInvitations(),
                getComments()
            );

            return Promise.all(promises);
        })
        .then(() => {
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        })
        .catch(error => {});
    }, [ checkAuth, dispatch, getBoards, getColumns, getUsers, getTasks, getInvitations, getComments ]);

    let routes = (
        <Switch>
            <Route path="/workplace/:boardCode?/:taskCode?" component={Workplace} />
            <Route path="/account" component={Account} exact={true} />
            <Route path="/boards" component={Boards} exact={true} />
            <Route path="/users" component={Users} exact={true} />
            <Route path="/contactSupport" component={ContactSupport} exact={true} />
            <Route path="/logout" component={Logout} exact={true} />
            <Redirect to="/workplace" />
        </Switch>
    );

    if(loading) return <PreLoader />;

    if (!isLoggedIn) {
        return (
            <Switch>
                <Route path="/login" component={Login} exact={true} />
                <Route path="/resetPassword" component={ResetPassword} exact={true} />
                <Redirect to="/login" />
            </Switch>
        );
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
        getBoards: () => dispatch(actions.getBoards()),
        getColumns: () => dispatch(actions.getColumns()),
        getUsers: () => dispatch(actions.getUsers()),
        getTasks: () => dispatch(actions.getTasks()),
        getInvitations: () => dispatch(actions.getInvitations()),
        getComments: () => dispatch(actions.getComments())
    }
};

export default connect(null, mapDispatchToProps)(App);