import React from 'react';

const AppContext = React.createContext({
    shrinkNavigation: false,
    toggleNavigation: () => {},
    sendNotification: (arg: any) => {}
});

export default AppContext;