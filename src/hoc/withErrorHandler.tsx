import React from 'react';

import Aux from '../hoc/Auxi';

import Alert from '../widgets/Alert';

import useHttpErrorHandler from '../hooks/http-error-handler';
import axios from '../axios';

const withErrorHandler = (WrappedComponent: React.FC) => {
    return (props: any) => {
        // using custom hook implementation
        const [error, clearError] = useHttpErrorHandler(axios);

        if (error && error?.response?.status === 401) {
            // window.location.reload();
        }

        return (
            <Aux>
                {
                    error
                    ? <Alert
                        open={true}
                        type="error"
                        handleClose={() => clearError()}
                        message="Request failed!"
                    />
                    : null
                }
                <WrappedComponent {...props} />
            </Aux>
        );
    }
}

export default withErrorHandler;