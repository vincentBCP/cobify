import React from 'react';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

import Aux from '../hoc/Auxi';

import useHttpErrorHandler from '../hooks/http-error-handler';
import axios from '../axios';

// https://material-ui.com/components/snackbars/

const Alert: React.FC<AlertProps> = props => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const withErrorHandler = (WrappedComponent: React.FC) => {
    return (props: any) => {
        // using custom hook implementation
        const [error, clearError] = useHttpErrorHandler(axios);

        if (error && error?.response?.status === 401) {
            window.location.reload();
        }

        return (
            <Aux>
                {
                    error
                    ? <Snackbar
                        open={true}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        autoHideDuration={6000}
                        onClose={() => clearError()}
                    >
                        <Alert onClose={() => clearError()} severity="error">
                            Request failed!
                        </Alert>
                    </Snackbar>
                    : null
                }
                <WrappedComponent {...props} />
            </Aux>
        );
    }
}

export default withErrorHandler;