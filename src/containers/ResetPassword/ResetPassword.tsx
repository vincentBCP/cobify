import React, { useState } from 'react';

import { NavLink } from 'react-router-dom';

import { useForm } from 'react-hook-form';

import { makeStyles, createStyles, Theme } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import Logo from '../../widgets/Logo';

import AuthAPI from '../../api/AuthAPI';

import { emailRegExp } from '../../constants';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        form: {
            width: 350
        },
        input: {
            marginBottom: 20
        },
        button: {
            width: '100%'
        },
        error: {
            textAlign: 'center',
            fontSize: '0.9em',
            backgroundColor: '#fff7f7',
            border: '1px solid #c72e2e',
            borderRadius: 5,
            padding: 15,
            marginBottom: 20
        },
        success: {
            textAlign: 'center',
            fontSize: '0.9em',
            backgroundColor: '#f7ffff',
            border: '1px solid #2ec7c7',
            borderRadius: 5,
            padding: 15,
            marginBottom: 20
        },
        header: {
            display: 'flex',
            justifyContent: 'center',
            marginBottom: 20
        },
        footer: {
            marginTop: 20,
            textAlign: 'right',
            
            '& a': {
                color: 'rgba(0, 0, 0, 0.3)',
                textDecoration: 'none'
            }
        }
    })
);

interface IFormInputs {
    email: string
}

const ResetPassword: React.FC = props => {
    const { register, handleSubmit, formState: { errors } } = useForm<IFormInputs>();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const classes = useStyles();

    const sendResetPassword = (data: IFormInputs) => {
        if (loading) return;
        setLoading(true);

        setSuccessMessage("");

        AuthAPI
        .sendResetPassword(data.email)
        .then(response => {
            setErrorMessage("");
            setSuccessMessage('Reset password link has been successfully sent to your email.');
        })
        .catch(error => {
            setSuccessMessage('');
            const errMsg = error.response.data.error.message;

            switch (errMsg) {
                case 'EMAIL_NOT_FOUND':
                    setErrorMessage("Email not found.")
                    break;
                default: setErrorMessage("Error occured.")
            }
        })
        .finally(() => setLoading(false));
    }

    return (
        <div className={classes.root}>
            <form onSubmit={handleSubmit(sendResetPassword)} className={classes.form}>
                <div className={classes.header}>
                    <Logo />
                </div>
                {
                    Boolean(errorMessage)
                    ? <Typography className={classes.error}>{errorMessage}</Typography>
                    : null
                }
                {
                    Boolean(successMessage)
                    ? <Typography className={classes.success}>{successMessage}</Typography>
                    : null
                }
                <TextField
                    fullWidth
                    label="Email"
                    className={classes.input}
                    required
                    error={errors.email !== undefined}
                    helperText={errors.email ? errors.email.message : ''}
                    inputProps={{
                        ...register('email', { 
                            required: 'Required', 
                            pattern: {
                                value: emailRegExp,
                                message: 'Invalid email format'
                            }
                        })
                    }}
                />
                <Button
                    type="submit"
                    className={classes.button}
                    color="primary"
                    variant="contained"
                >
                    { loading ? <CircularProgress color="inherit" size={22} /> : 'SEND RESET PASSWORD' }
                </Button>
                <div className={classes.footer}>
                    <NavLink to="/login">Back to login</NavLink>
                </div>
            </form>
        </div>
    );
};

export default ResetPassword;