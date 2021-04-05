import React, { useEffect, useState } from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core';

interface IContactDetailsProps {
    email: string
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        input: {
            marginBottom: 20
        },
        button: {
            marginLeft: 10
        }
    })
);

const ContactDetails: React.FC<IContactDetailsProps> = props => {
    const classes = useStyles();
    const [email, setEmail] = useState<string>();
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        setEmail(props.email || '');
    }, [ props.email ]);

    return (
        <Card>
            <CardContent>
                <Typography style={{marginBottom: 15}}>Contact details</Typography>
                <TextField
                    id="contactDetails-email"
                    label="Email"
                    fullWidth
                    variant="outlined"
                    className={classes.input}
                    disabled={!editMode}
                    value={email}
                    onChange={(ev: React.ChangeEvent<HTMLInputElement>) => setEmail(ev.target.value)}
                />
                <Grid
                    container
                    direction="row"
                    justify="flex-end"
                    alignItems="center"
                >
                    {
                        editMode
                        ? <Button
                            color="secondary"
                            className={classes.button}
                            onClick={(ev: React.MouseEvent<HTMLButtonElement>) => setEditMode(false)}
                        >
                            Cancel
                        </Button>
                        : null
                    }

                    {
                        editMode 
                        ? <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            onClick={(ev: React.MouseEvent<HTMLButtonElement>) => setEditMode(false)}
                        >
                            Save changes
                        </Button>
                        : null
                    }
                    
                    {
                        !editMode
                        ? <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            onClick={(ev: React.MouseEvent<HTMLButtonElement>) => setEditMode(true)}
                        >
                            Update email
                        </Button>
                        : null
                    }
                </Grid>
            </CardContent>
        </Card>
    );
};

export default ContactDetails;