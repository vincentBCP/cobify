import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';
import { NavLink, Route, withRouter, RouteComponentProps } from 'react-router-dom';

import Carousel from 'react-material-ui-carousel'

import { makeStyles, createStyles, Theme } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

import Logo from '../../widgets/Logo';

import SigninForm from './SigninForm';
import ResetPasswordForm from './ResetPasswordForm';

import AuthAPI from '../../api/AuthAPI';

import * as actions from '../../store/actions';

import demo1Png from '../../assets/demo/demo1.png';
import demo2Png from '../../assets/demo/demo2.png';
import demo3Png from '../../assets/demo/demo3.png';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            //backgroundColor: '#f7f9fc',
            backgroundImage: 'linear-gradient(#344866, #52709f)',
            scrollbarColor: 'transparent transparent', /* thumb and track color */
            scrollbarWidth: 'none',
        },
        content: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'stretch',
            borderRadius: 20,
            height: '80%',
            width: '70%',
            overflow: 'hidden',
            backgroundColor: '#f7f9fc',
            boxShadow: "rgba(0,0,0,0.3) 1px 2px 5px 1px, rgba(0,0,0,0.3) 0px 1px 3px -1px"
        },
        demo: {
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: "50px 0",
            justifyContent: 'center',
            alignItems: 'center',

            '& p': {
                width: '60%',
                textAlign: 'center',
                color: 'rgba(0,0,0,0.7)',
                fontSize: '1.3em',
                fontStyle: 'italic'
            }
        },
        carousel: {
            width: '75%',
            height: '60%',
            marginTop: 40,
            marginBottom: 40
        },
        carouselSlide: {
            border: '1px solid rgba(0,0,0,0.03)',

            '& img': {
                width: '100%'
            }
        },
        form: {
            width: "42%",
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: "0 7%",
            backgroundColor: 'white'
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
            marginBottom: 20,
            justifyContent: 'center',

            '& p': {
                fontSize: '1.5em',
                color: '#c5c8cc',
                fontWeight: 'bold'
            }
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

interface ILoginProps {
    login: (arg1: string, arg2: string) => Promise<string>
}

const Login: React.FC<ILoginProps & RouteComponentProps> = props => {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [active, setActive] = useState(0);

    const classes = useStyles();

    useEffect(() => {
        setErrorMessage("");
        setSuccessMessage("");
        setLoading(false);
    }, [ props.match ]);

    const login = (creds: any) => {
        if (loading) return;
        setLoading(true);

        props
        .login(creds.email, creds.password)
        .then(b => {
            window.location.reload();
        })
        .catch(error => {
            // https://firebase.google.com/docs/auth/web/password-auth
            // https://firebase.google.com/docs/reference/js/firebase.auth.Error

            const code = error.code;

            switch (code) {
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                case 'auth/user-disabled':
                    setErrorMessage("Invalid email or password.");
                    break;
                case 'auth/too-many-requests':
                    setErrorMessage("Too many invalid attempts. Try again later.");
                    break;
                default: setErrorMessage("Error occured.")
            }
            
            setLoading(false);
        });
    }

    const sendResetPassword = (data: any) => {
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
            <div className={classes.content}>                
                <div className={classes.form}>
                    <div className={classes.header}>
                        
                        <Route
                            path="/login"
                            render={() => (
                                <Typography>Welcome</Typography>
                            )}
                        />
                        <Route
                            path="/resetPassword"
                            render={() => (
                                <Typography>Reset Password</Typography>
                            )}
                        />
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

                    <Route
                        path="/login"
                        render={() => (
                            <SigninForm
                                handleSubmit={login}
                                loading={loading}
                            />
                        )}
                    />
                    <Route
                        path="/resetPassword"
                        render={() => (
                            <ResetPasswordForm
                                handleSubmit={sendResetPassword}
                                loading={loading}
                            />
                        )}
                    />
                    
                    <div className={classes.footer}>
                        <Route
                            path="/login"
                            render={() => (
                                <NavLink to="/resetPassword">Forgot password?</NavLink>
                            )}
                        />
                        <Route
                            path="/resetPassword"
                            render={() => (
                                <NavLink to="/login">Back to login</NavLink>
                            )}
                        />
                    </div>
                </div>
                <div className={classes.demo}>
                    <Logo invert={true} />
                    <div className={classes.carousel}>
                        <Carousel
                            animation="slide"
                            navButtonsAlwaysInvisible={true}
                            onChange={(index: number) => {
                                setActive(index)
                            }}
                        >
                            <div className={classes.carouselSlide}>
                                <img src={demo1Png} alt="demo 1" />
                            </div>
                            <div className={classes.carouselSlide}>
                                <img src={demo2Png} alt="demo 2" />
                            </div>
                            <div className={classes.carouselSlide}>
                                <img src={demo3Png} alt="demo 3" />
                            </div>
                        </Carousel>
                    </div>
                    {
                        active === 0
                        ? <Typography>Manage your project's tasks in workplace.</Typography>
                        : null
                    }

                    {
                        active === 1
                        ? <Typography>Create boards for your projects.</Typography>
                        : null
                    }

                    {
                        active === 2
                        ? <Typography>Add users to work on tasks.</Typography>
                        : null
                    }
                </div>
            </div>
        </div>
    );
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        login: (email: string, password: string) => dispatch(actions.login(email, password))
    }
};

export default withRouter(connect(null, mapDispatchToProps)(Login));