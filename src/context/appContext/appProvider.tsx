import React from 'react';

import AppContext from './appContext';

const AppProvider: React.FC = props => {
    const [shrinkNavigation, setShrinkNavigation] = React.useState(false);

    return (
        <AppContext.Provider
            value={{
                shrinkNavigation: shrinkNavigation,
                toggleNavigation: () => {
                    setShrinkNavigation(!shrinkNavigation)
                }
            }}
        >
            {props.children}
        </AppContext.Provider>
    );
};

export default AppProvider;