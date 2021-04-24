import React from 'react';

import ErrorContext from './errorContext';

import Alert from '../../widgets/Alert';

const ErrorProvider: React.FC = props => {
    const [error, setError] = React.useState<any | null>();

    return (
        <ErrorContext.Provider
            value={{
                error: error,
                setError: setError
            }}
        >
            {
                Boolean(error)
                ? <Alert
                    open={true}
                    type="error"
                    handleClose={() => setError(null)}
                    message="Error occured!"
                />
                : null
            }
            
            {props.children}
        </ErrorContext.Provider>
    );
};

export default ErrorProvider;