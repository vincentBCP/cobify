import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import './App.scss';

import SideNavigation from './components/SideNavigation';

import Workplace from './containers/Workplace';
import Account from './containers/Account';
import Boards from './containers/Boards';
import Guests from './containers/Guests';
import ContactSupport from './containers/ContactSupport';
import Logout from './containers/Logout';

const App: React.FC = props => {
    let routes = (
        <Switch>
            <Route path="/" component={Workplace} exact={true} />
            <Route path="/account" component={Account} exact={true} />
            <Route path="/boards" component={Boards} exact={true} />
            <Route path="/guests" component={Guests} exact={true} />
            <Route path="/contactSupport" component={ContactSupport} exact={true} />
            <Route path="/logout" component={Logout} exact={true} />
            <Redirect to="/" />
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