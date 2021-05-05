import React from 'react';

const AppContext = React.createContext({
    shrinkNavigation: false,
    screenSize: "",
    toggleNavigation: () => {},
    sendNotification: (arg: any) => {}
});

export default AppContext;