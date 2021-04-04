import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

const DetailsForm: React.FC = props => {
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');

    const user: any = useSelector((state: any) => state.app.user);

    useEffect(() => {
        if (!user) return;

        setFirstName(user.firstName || '');
        setLastName(user.lastName || '');
    }, [ user ]);

    if (!user) return null;

    return (
        <Grid item xs={8}>
            <TextField
                id="publicInfo-firstName"
                label="First name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={firstName}
                onChange={(ev: React.ChangeEvent<HTMLInputElement>) => setFirstName(ev.target.value)}
            />
        
            <TextField
                id="publicInfo-lastName"
                label="Last name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={lastName}
                onChange={(ev: React.ChangeEvent<HTMLInputElement>) => setLastName(ev.target.value)}
            />
        </Grid>
    );
};

export default DetailsForm;