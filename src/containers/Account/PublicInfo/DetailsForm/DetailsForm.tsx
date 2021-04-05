import React from 'react';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import UserDetails from '../../../../models/types/UserDetails';

interface IDetailsFormProps {
    userDetails: UserDetails,
    handleUserDetailsChange: (arg1: UserDetails) => void
};

const DetailsForm: React.FC<IDetailsFormProps> = props => {
    return (
        <Grid item xs={8}>
            <TextField
                id="publicInfo-firstName"
                label="First name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={props.userDetails.firstName || ''}
                onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
                    props.handleUserDetailsChange({
                        ...props.userDetails,
                        firstName: ev.target.value
                    });
                }}
            />
        
            <TextField
                id="publicInfo-lastName"
                label="Last name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={props.userDetails.lastName || ''}
                onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
                    props.handleUserDetailsChange({
                        ...props.userDetails,
                        lastName: ev.target.value
                    });
                }}
            />
        </Grid>
    );
};

export default DetailsForm;