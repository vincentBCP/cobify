import React, { useState } from 'react';

import { useForm } from 'react-hook-form';

import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { makeStyles, createStyles, Theme } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import Logo from '../../widgets/Logo';

import { emailRegExp } from '../../constants';

import * as actions from '../../store/actions';

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
        login: {
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
    email: string,
    password: string
}

interface ILoginProps {
    login: (arg1: string, arg2: string) => Promise<string>
}

const Login: React.FC<ILoginProps> = props => {
    const { register, handleSubmit, formState: { errors } } = useForm<IFormInputs>();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const classes = useStyles();

    const login = (creds: IFormInputs) => {
        if (loading) return;
        setLoading(true);

        props
        .login(creds.email, creds.password)
        .then(b => {
            window.location.reload();
        })
        .catch(error => {
            // https://firebase.google.com/docs/reference/rest/auth#section-sign-in-email-password

            console.log(error);
            const errMsg = error.response ? error.response.data.error.message : "ERR_OCCURED";

            switch (errMsg) {
                case 'EMAIL_NOT_FOUND':
                case 'INVALID_PASSWORD':
                case 'USER_DISABLED':
                    setErrorMessage("Invalid email or password.");
                    break;
                case 'TOO_MANY_ATTEMPTS_TRY_LATER':
                    setErrorMessage("Too many invalid attempts. Try again later.");
                    break;
                default: setErrorMessage("Error occured.")
            }
            
            setLoading(false)
        });
    }

    return (
        <div className={classes.root}>
            <form onSubmit={handleSubmit(login)} className={classes.form}>
                <div className={classes.header}>
                    <Logo />
                </div>
                {
                    Boolean(errorMessage)
                    ? <Typography className={classes.error}>{errorMessage}</Typography>
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
                <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    className={classes.input}
                    error={errors.password !== undefined}
                    required
                    helperText={errors.password ? errors.password.message : ''}
                    inputProps={{
                        ...register('password', { 
                            required: 'Required'
                        })
                    }}
                />
                <Button
                    type="submit"
                    className={classes.login}
                    color="primary"
                    variant="contained"
                >
                    { loading ? <CircularProgress color="inherit" size={22} /> : 'LOGIN' }
                </Button>
                <div className={classes.footer}>
                    <NavLink to="/resetPassword">Forgot password?</NavLink>
                </div>
            </form>
        </div>
    );
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        login: (email: string, password: string) => dispatch(actions.login(email, password))
    }
};

export default connect(null, mapDispatchToProps)(Login);