import React, { useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import './App.scss';

import SideNavigation from './components/SideNavigation';

import Workplace from './containers/Workplace';
import Account from './containers/Account';
import Boards from './containers/Boards';
import Guests from './containers/Guests';
import ContactSupport from './containers/ContactSupport';
import Logout from './containers/Logout';

import BoardAPI from './api/BoardAPI';
import ColumnAPI from './api/ColumnAPI';
import GuestAPI from './api/GuestAPI';
import TaskAPI from './api/TaskAPI';
import InvitationAPI from './api/InvitationAPI';

import * as actionTypes from './store/actions/actionTypes';

const App: React.FC = props => {
    const dispatch = useDispatch();

    useEffect(() => {
        BoardAPI.getBoards()
        .then(boards => {
            dispatch({
                type: actionTypes.SET_BOARDS,
                payload: boards
            })
        });

        ColumnAPI.getColumns()
        .then(columns => {
            dispatch({
                type: actionTypes.SET_COLUMNS,
                payload: columns
            })
        });

        GuestAPI.getGuests()
        .then(guests => {
            dispatch({
                type: actionTypes.SET_GUESTS,
                payload: guests
            })
        });

        TaskAPI.getTasks()
        .then(tasks => {
            dispatch({
                type: actionTypes.SET_TASKS,
                payload: tasks
            })
        });

        InvitationAPI.getInvitations()
        .then(invitations => {
            dispatch({
                type: actionTypes.SET_INVITATIONS,
                payload: invitations
            })
        });
    }, [ dispatch ]);

    let routes = (
        <Switch>
            <Route path="/workplace" component={Workplace} exact={true} />
            <Route path="/account" component={Account} exact={true} />
            <Route path="/boards" component={Boards} exact={true} />
            <Route path="/guests" component={Guests} exact={true} />
            <Route path="/contactSupport" component={ContactSupport} exact={true} />
            <Route path="/logout" component={Logout} exact={true} />
            <Redirect to="/workplace" />
        </Switch>
    );

    return (
        <div id="App">
            <SideNavigation />
            <main id="AppContent">
                { routes }
            </main>
        </div>
    );
};

export default App;