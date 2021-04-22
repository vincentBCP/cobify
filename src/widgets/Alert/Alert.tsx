import React from 'react';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps, Color } from '@material-ui/lab/Alert';

const Alert: React.FC<AlertProps> = props => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
};

interface ICompProps {
    open?: boolean,
    type: Color,
    message: string
    handleClose: () => void
}

// https://material-ui.com/components/snackbars/

const Comp: React.FC<ICompProps> = props => {
    return (
        <Snackbar
            open={props.open}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            autoHideDuration={6000}
            onClose={props.handleClose}
        >
            <Alert onClose={props.handleClose} severity={props.type}>
                {props.message}
            </Alert>
        </Snackbar>
    )
};

export default Comp;