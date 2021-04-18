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

import CodeAuthenticator from '../../../components/CodeAuthenticator';
import FormActions from '../../../widgets/FormModal/FormActions';

import * as actions from '../../../store/actions';

import { emailRegExp } from '../../../constants';

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

const ContactDetails: React.FC<IContactDetailsProps> = props => {
    const classes = useStyles();
    const [email, setEmail] = useState<string>();
    const [hasChange, setHasChange] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [authenticate, setAuthenticate] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        setEmail(props.email);
    }, [ props.email ]);

    const handleSaveChanges = () => {
        if (!hasChange || !email) return;
        if (!emailRegExp.test(email)) return;

        if (loading) return;
        setLoading(true);

        AppAPI
        .requestCode(email)
        .then(response => {
            setLoading(false);
            setSuccess(true);
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

    const handleCodeAuthSuccess = () => {
        if (!email) return;

        if (loading) return;
        setLoading(true);
        setSuccess(false);
        setAuthenticate(false);

        props
        .updateEmail(email)
        .then(response => {
            setEditMode(false);
            setHasChange(false);
            setLoading(false);
            setSuccess(false);
        })
        .catch(error => {

        });
    };

    const handleCodeAuthCancel = () => {
        setAuthenticate(false);
        setLoading(false);
        setSuccess(false);
    };

    const handleCodeAuthFail = () => {

    }

    return (
        <Aux>
            <CodeAuthenticator
                open={authenticate}
                title="Email verification"
                message="Please enter the 6 digit code sent to the email you provided."
                handleCancel={handleCodeAuthCancel}
                handleSuccess={handleCodeAuthSuccess}
                handleFail={handleCodeAuthFail}
            />

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
                        value={email || ''}
                        onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
                            setEmail(ev.target.value);
                            setHasChange(true);
                        }}
                    />

                    {
                        editMode
                        ? <FormActions
                            sendLabel="Save changes"
                            loading={loading}
                            success={success}
                            handleSend={handleSaveChanges}
                            handleCancel={handleCancel}

                        />
                        : null
                    }

                    {
                        !editMode
                        ? <Grid
                            container
                            direction="row"
                            justify="flex-end"
                            alignItems="center"
                        >
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                onClick={handleUpdateEmail}
                            >
                                Update email
                            </Button>
                        </Grid>
                        : null
                    }
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