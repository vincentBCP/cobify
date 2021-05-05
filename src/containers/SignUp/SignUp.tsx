import React, { useState, useEffect } from 'react';
import ramdomcolor from 'randomcolor';

import { useForm } from 'react-hook-form';

import { NavLink, withRouter, RouteComponentProps } from 'react-router-dom';

import { makeStyles, createStyles, Theme, Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import FormMessage from '../../widgets/FormMessage';

import { emailRegExp } from '../../constants';

import AuthAPI from '../../api/AuthAPI';
import UserAPI from '../../api/UserAPI';

import UserRole from '../../models/enums/UserRole';

import AppContext from '../../context/appContext';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundImage: 'linear-gradient(#344866, #52709f)',
            scrollbarColor: 'transparent transparent', /* thumb and track color */
            scrollbarWidth: 'none',
        },
        content: {
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 20,
            width: 450,
            maxWidth: '90%',
            maxHeight: '90%',
            overflowY: 'auto',
            backgroundColor: '#f7f9fc',
            boxShadow: "rgba(0,0,0,0.3) 1px 2px 5px 1px, rgba(0,0,0,0.3) 0px 1px 3px -1px",
            padding: "2%",

            '&.sm': {
                width: '100%',
                maxWidth: '100%',
                padding: '5%',
                borderRadius: 0
            }
        },
        form: {
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
        },
        input: {
            marginBottom: 20
        },
        linear: {
            display: 'flex',
            marginBottom: 20,
            justifyContent: 'space-between',
            
            '& > div': {
                width: "calc(50% - 5px)"
            }
        },
        header: {
            display: 'flex',
            marginBottom: 30,
            justifyContent: 'center',

            '& p': {
                fontSize: '1.5em',
                color: '#c5c8cc',
                fontWeight: 'bold'
            }
        },
        login: {
            marginTop: 20,
            width: '100%',
            textAlign: 'right',
            
            '& a': {
                color: 'rgba(0, 0, 0, 0.3)',
                textDecoration: 'none'
            }
        }
    })
);

interface IFormInputs {
    organization: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string
}

const SignUp: React.FC<RouteComponentProps> = props => {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const { register, handleSubmit, formState: { errors } } = useForm<IFormInputs>();

    const classes = useStyles();

    const appContext = React.useContext(AppContext);

    useEffect(() => {
        window.document.title = "Sign up - Cobify";
    }, []);

    const signUp = (data: IFormInputs) => {
        if (loading) return;
        setLoading(true);

        AuthAPI.signupAndLogin(data.email, data.password)
        .then(response => {
            return UserAPI.createUser({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    accountID: 'signed_up',
                    organization: data.organization,
                    role: UserRole.ADMIN,
                    color: ramdomcolor(),
                    created: (new Date()).toISOString()
                });
        })
        .then(user => {
            window.location.replace('/');
        })
        .catch(error => {
            const code = error.code;

            switch (code) {
                case 'auth/email-already-in-use':
                    setErrorMessage("Email is already registered. Please login to upgrade your account instead.");
                    break;
                case 'auth/weak-password':
                    setErrorMessage("Password should be at least 6 characters.");
                    break;
                default: setErrorMessage("Error occured.")
            }
            
            setLoading(false);
        });
    }

    return (
        <div className={classes.root}>
            <div className={[classes.content, appContext.screenSize].join(' ')}>
                <div className={classes.header}>
                    <Typography>Create your account</Typography>
                </div>
                {
                    errorMessage
                    ? <FormMessage
                        type="error"
                        message={errorMessage || "You already have an account. Please login to upgrade your account instead."}
                    />
                    : null
                }     
                <form onSubmit={handleSubmit(signUp)} className={classes.form}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Organization"
                        required
                        error={errors.organization !== undefined}
                        helperText={errors.organization ? errors.organization.message : ''}
                        inputProps={{
                            ...register('organization', { 
                                required: 'Required'
                            })
                        }}
                        className={classes.input}
                    />
                    <div className={classes.linear}>
                        <TextField
                            variant="outlined"
                            label="First name"
                            required
                            error={errors.firstName !== undefined}
                            helperText={errors.firstName ? errors.firstName.message : ''}
                            inputProps={{
                                ...register('firstName', { 
                                    required: 'Required'
                                })
                            }}
                        />
                        <TextField
                            variant="outlined"
                            label="Last name"
                            required
                            error={errors.lastName !== undefined}
                            helperText={errors.lastName ? errors.lastName.message : ''}
                            inputProps={{
                                ...register('lastName', { 
                                    required: 'Required'
                                })
                            }}
                        />
                    </div>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Email"
                        type="email"
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
                        className={classes.input}
                    />
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Password"
                        type="password"
                        error={errors.password !== undefined}
                        required
                        helperText={errors.password ? errors.password.message : ''}
                        autoComplete="new-password"
                        inputProps={{
                            ...register('password', { 
                                required: 'Required'
                            })
                        }}
                        className={classes.input}
                    />
                    <Button
                        type="submit"
                        color="primary"
                        variant="contained"
                        fullWidth
                    >
                        { loading ? <CircularProgress color="inherit" size={22} /> : 'Create Account' }
                    </Button>
                </form>
                <div className={classes.login}>
                    <NavLink to="/login">Login</NavLink>
                </div>
            </div>
        </div>
    );
};

export default withRouter(SignUp);