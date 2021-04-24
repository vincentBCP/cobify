import React from 'react';

const AppContext = React.createContext({
    shrinkNavigation: false,
    toggleNavigation: () => {}
});

export default AppContext;