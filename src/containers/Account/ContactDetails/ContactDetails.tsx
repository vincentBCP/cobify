import React, { useEffect, useState } from 'react';

import { connect } from 'react-redux';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core';

import AppAPI from '../../../api/AppAPI';

import Aux from '../../../hoc/Auxi';

import CodeAuthenticator from '../../../widgets/CodeAuthenticator';

import * as actions from '../../../store/actions';

interface IContactDetailsProps {
    email: string,
    updateEmail: (arg1: string) => Promise<any>
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

const emailRegExp = /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*@[a-zA-Z]+(\.[a-zA-Z]+)*\.[a-z]{2,4}$/;

const ContactDetails: React.FC<IContactDetailsProps> = props => {
    const classes = useStyles();
    const [email, setEmail] = useState<string>();
    const [hasChange, setHasChange] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [authenticate, setAuthenticate] = useState(false);

    useEffect(() => {
        setEmail(props.email);
    }, [ props.email ]);

    const handleSaveChanges = () => {
        if (!hasChange || !email) return;
        if (!emailRegExp.test(email)) return;

        AppAPI
        .requestCode(email)
        .then(response => {
            setAuthenticate(true);
        })
        .catch(error => {

        });
    };

    const handleUpdateEmail = () => {
        setEditMode(true);
    };

    const handleCancel = () => {
        setEditMode(false);
        setEmail(props.email);
        setHasChange(false);
    };

    const handleSuccess = () => {
        if (!email) return;

        props
        .updateEmail(email)
        .then(response => {
            setAuthenticate(false);
            setEditMode(false);
            setHasChange(false);
        })
        .catch(error => {

        });
    };

    return (
        <Aux>
            <CodeAuthenticator
                open={authenticate}
                title="Email verification"
                message="Please enter the 6 digit code sent to the email you provided."
                handleCancel={() => {
                    setAuthenticate(false);
                }}
                handleSuccess={handleSuccess}
                handleFail={() => {
                    setAuthenticate(false);
                }}
            />

            <Card style={{marginBottom: 30}}>
                <CardContent>
                    <Typography style={{marginBottom: 15}}>Contact details</Typography>
                    <TextField
                        id="contactDetails-email"
                        label="Email"
                        fullWidth
                        variant="outlined"
                        className={classes.input}
                        disabled={!editMode}
                        value={email || ''}
                        onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
                            setEmail(ev.target.value);
                            setHasChange(true);
                        }}
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
                                color="default"
                                className={classes.button}
                                onClick={handleCancel}
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
                                onClick={handleSaveChanges}
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
                                onClick={handleUpdateEmail}
                            >
                                Update email
                            </Button>
                            : null
                        }
                    </Grid>
                </CardContent>
            </Card>
        </Aux>
    );
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        updateEmail: (email: string) => dispatch(actions.updateEmail(email))
    }
};

export default connect(null, mapDispatchToProps)(ContactDetails);