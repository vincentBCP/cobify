import React, { useEffect, useState } from 'react';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

interface IDetailsFormProps {
    firstName: string,
    lastName: string
};

const DetailsForm: React.FC<IDetailsFormProps> = props => {
    const [firstName, setFirstName] = useState<string>();
    const [lastName, setLastName] = useState<string>();

    useEffect(() => {
        setFirstName(props.firstName);
        setLastName(props.lastName);
    }, [ props.firstName, props.lastName ]);

    return (
        <Grid item xs={8}>
            <TextField
                id="publicInfo-firstName"
                label="First name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={firstName || ''}
                onChange={(ev: React.ChangeEvent<HTMLInputElement>) => setFirstName(ev.target.value)}
            />
        
            <TextField
                id="publicInfo-lastName"
                label="Last name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={lastName || ''}
                onChange={(ev: React.ChangeEvent<HTMLInputElement>) => setLastName(ev.target.value)}
            />
        </Grid>
    );
};

export default DetailsForm;