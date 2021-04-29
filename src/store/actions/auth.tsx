import * as actionTypes from './actionTypes';

import AuthAPI from '../../api/AuthAPI';
import UserAPI from '../../api/UserAPI';

export const login = (email: string, password: string) => {
    return (dispatch: any) => {
        return new Promise((resolve, reject) => {
            AuthAPI
            .signin(email, password)
            .then(refreshToken => {
                localStorage.setItem("refreshToken", refreshToken);
                
                return UserAPI.getAccounts(email);
            })
            .then(accounts => {
                if (accounts.length < 1) {
                    AuthAPI.deleteAccount();
                    reject({
                        code: 'auth/user-not-found'
                    });

                    return;
                }

                resolve(true);
            })
            .catch(error => {
                localStorage.removeItem("account");
                localStorage.removeItem("refreshToken");
                reject(error);
            });
        });
    };
};

export const checkAuth = () => {
    return (dispatch: any) => {
        return new Promise((resolve, reject) => {
            AuthAPI.isLoggedIn()
            .then(user => {
                const email = user.email;

                return UserAPI.getAccounts(email);
            })
            .then(accounts => {
                if (accounts.length < 1) {
                    AuthAPI.deleteAccount();
                    reject({
                        code: 'auth/user-not-found'
                    });
                    
                    return;
                }

                const selectedAccount = localStorage.getItem("account");

                const account = accounts.find(account => account.id === selectedAccount) || accounts[0];

                dispatch({
                    type: actionTypes.SET_ACCOUNT,
                    payload: account
                });

                resolve(account);
            })
            .catch(error => {
                // quick fix for annoying issue
                if (error.toString().includes("Client is offline")) {
                    window.location.reload();
                    return;
                }

                localStorage.removeItem("account");
                localStorage.removeItem("refreshToken");
                reject(error);
            });
            /*const storedRefreshToken = localStorage.getItem("refreshToken");
            const storedEmail = localStorage.getItem("email");

            if (!Boolean(storedRefreshToken) || !Boolean(storedEmail)) {
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("email");

                resolve(null);
                return;
            }

            AuthAPI
            .reLogin(storedRefreshToken || "")
            .then(response => {
                localStorage.setItem("token", response.data.id_token);
                localStorage.setItem("refreshToken", response.data.refresh_token);

                return UserAPI.getUser(storedEmail || "");
            })
            .then(user => {
                dispatch({
                    type: actionTypes.SET_ACCOUNT,
                    payload: user
                });

                resolve(user);
            })
            .catch(error => {
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("email");
                
                console.log(error);
                reject(error);
            });*/
        });
    };
};