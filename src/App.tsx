import React, { useState, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useDispatch, connect } from 'react-redux';

import './App.scss';

import SideNavigation from './components/SideNavigation';

import Workplace from './containers/Workplace';
import Account from './containers/Account';
import Boards from './containers/Boards';
import Guests from './containers/Guests';
import ContactSupport from './containers/ContactSupport';
import Logout from './containers/Logout';
import PreLoader from './components/PreLoader';

import * as actions from './store/actions';

interface IAppProps {
    getBoards: () => Promise<any>,
    getColumns: () => Promise<any>,
    getGuests: () => Promise<any>,
    getTasks: () => Promise<any>,
    getInvitations: () => Promise<any>
}

const App: React.FC<IAppProps> = props => {
    const { getBoards, getColumns, getGuests, getTasks, getInvitations } = props;

    const dispatch = useDispatch();
    
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const promises = [];

        promises.push(
            getBoards(),
            getColumns(),
            getGuests(),
            getTasks(),
            getInvitations()
        );

        Promise.all(promises)
        .then(responses => {
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        })
        .catch(error => { });
    }, [ dispatch, getBoards, getColumns, getGuests, getTasks, getInvitations ]);

    let routes = (
        <Switch>
            <Route path="/workplace/:boardCode?/:taskCode?" component={Workplace} />
            <Route path="/account" component={Account} exact={true} />
            <Route path="/boards" component={Boards} exact={true} />
            <Route path="/guests" component={Guests} exact={true} />
            <Route path="/contactSupport" component={ContactSupport} exact={true} />
            <Route path="/logout" component={Logout} exact={true} />
            <Redirect to="/workplace" />
        </Switch>
    );

    if(loading) return <PreLoader />;

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
        getBoards: () => dispatch(actions.getBoards()),
        getColumns: () => dispatch(actions.getColumns()),
        getGuests: () => dispatch(actions.getGuests()),
        getTasks: () => dispatch(actions.getTasks()),
        getInvitations: () => dispatch(actions.getInvitations())
    }
};

export default connect(null, mapDispatchToProps)(App);