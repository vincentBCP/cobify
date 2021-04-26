import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';
import { NavLink, Route, withRouter, RouteComponentProps } from 'react-router-dom';

import Carousel from 'react-material-ui-carousel'

import { makeStyles, createStyles, Theme } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

import Logo from '../../widgets/Logo';

import SigninForm from './SigninForm';
import ResetPasswordForm from './ResetPasswordForm';

import FormMessage from '../../widgets/FormMessage';

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
            width: "45%",
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: "0 7%",
            backgroundColor: 'white'
        },
        login: {
            width: '100%'
        },
        logo: {
            display: 'flex',
            marginBottom: 20,
            justifyContent: 'center',
        },
        forgotPassword: {
            marginTop: 10,
            textAlign: 'right',
            
            '& a': {
                color: 'rgba(0, 0, 0, 0.3)',
                textDecoration: 'none'
            }
        },
        signUp: {
            display: 'flex',
            flexDirection: 'column',

            '& div': {
                display: 'flex',
                alignItems: 'center',
                marginTop: 10,
                marginBottom: 10,
                
                '& span': {
                    padding: '0 3px',
                    marginTop: -5,
                    color: '#6c7378'
                },
                '& div': {
                    borderTop: '1px solid #cbd2d6',
                    flexGrow: 1
                }
            },
            '& a': {
                backgroundColor: '#E1E7EB',
                textAlign: 'center',
                color: '#2C2E2F',
                borderRadius: 5,
                padding: 10,
                textDecoration: 'none',
                fontWeight: 'bold',
                transitionDuration: '0.3s',

                '&:hover': {
                    backgroundColor: "#d2dbe1"
                }
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

            if (error.toString().includes("Client is offline")) {
                window.location.reload();
                return;
            }

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
            
            const errMsg = error.code || error.response.data.error.message;

            switch (errMsg) {
                case 'auth/user-not-found':
                case 'EMAIL_NOT_FOUND':
                    setErrorMessage("Email not found.")
                    break;
                default: setErrorMessage("Error occured.")
            }
        })
        .catch(error => {
            setErrorMessage("Error occured.");
        })
        .finally(() => setLoading(false));
    }

    return (
        <div className={classes.root}>
            <div className={classes.content}>                
                <div className={classes.form}>
                    <Route
                        path="/login"
                        render={() => (
                            <div className={classes.logo}>
                                <Logo />
                            </div>
                        )}
                    />
                    <Route
                        path="/resetPassword"
                        render={() => (
                            <Typography style={{
                                textAlign: 'center', 
                                marginBottom: 5, 
                                fontSize: '1.2em', 
                                color: 'rgba(0,0,0,0.8)'
                            }}>
                                Reset Password
                            </Typography>
                        )}
                    />
                    <Route
                        path="/resetPassword"
                        render={() => (
                            <Typography style={{
                                textAlign: 'center', 
                                marginBottom: 20, 
                                fontSize: '1em', 
                                color: 'rgba(0,0,0,0.8)'
                            }}>
                                Enter your email to reset your password
                            </Typography>
                        )}
                    />
                    {
                        Boolean(errorMessage)
                        ? <FormMessage
                            type="error"
                            message={errorMessage}
                        />
                        : null
                    }
                    {
                        Boolean(successMessage)
                        ? <FormMessage
                            type="success"
                            message={successMessage}
                        />
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
                    
                    <div className={classes.forgotPassword}>
                        <Route
                            path="/login"
                            render={() => (
                                <NavLink to="/resetPassword">Forgot password?</NavLink>
                            )}
                        />
                        <Route
                            path="/resetPassword"
                            render={() => (
                                <NavLink to="/login">Login</NavLink>
                            )}
                        />
                    </div>

                    <Route
                        path="/login"
                        render={() => (
                            <div className={classes.signUp}>
                                <div><div></div><span>or</span><div></div></div>
                                <NavLink to="/signUp">Sign Up</NavLink>
                            </div>
                        )}
                    />
                </div>
                <div className={classes.demo}>
                    <Typography>How it works?</Typography>
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
                        ? <Typography>Create boards for your projects.</Typography>
                        : null
                    }
                    {
                        active === 1
                        ? <Typography>Add users to work with.</Typography>
                        : null
                    }
                    {
                        active === 2
                        ? <Typography>Manage tasks in workplace.</Typography>
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