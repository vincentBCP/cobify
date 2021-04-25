import React from 'react';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import { PublicInfoDetails } from '../PublicInfo';

interface IDetailsFormProps {
    publicInfo: PublicInfoDetails,
    handleUserDetailsChange: (arg1: PublicInfoDetails) => void
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
                value={props.publicInfo.firstName || ''}
                onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
                    props.handleUserDetailsChange({
                        ...props.publicInfo,
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
                value={props.publicInfo.lastName || ''}
                onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
                    props.handleUserDetailsChange({
                        ...props.publicInfo,
                        lastName: ev.target.value
                    });
                }}
            />

            {
                props.publicInfo.organization
                ? <TextField
                    id="publicInfo-organization"
                    label="Organization"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={props.publicInfo.organization}
                    disabled={true}
                    style={{marginBottom: 20}}
                />
                : null
            }
        </Grid>
    );
};

export default DetailsForm;