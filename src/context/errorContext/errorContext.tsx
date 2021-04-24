import React from 'react';

const ErrorContext = React.createContext({
    error: null,
    setError: (arg: any | null) => {}
});

export default ErrorContext;