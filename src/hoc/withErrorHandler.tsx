import React from 'react';

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
            <React.Fragment>
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
            </React.Fragment>
        );
    }
}

export default withErrorHandler;