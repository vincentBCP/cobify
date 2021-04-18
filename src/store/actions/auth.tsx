import * as actionTypes from './actionTypes';

import AuthAPI from '../../api/AuthAPI';
import UserAPI from '../../api/UserAPI';

export const login = (email: string, password: string) => {
    return (dispatch: any) => {
        return new Promise((resolve, reject) => {
            AuthAPI
            .login(email, password)
            .then(response => {
                localStorage.setItem("token", response.data.idToken);
                localStorage.setItem("refreshToken", response.data.refreshToken);
                
                return UserAPI.getUser(email);
            })
            .then(user => {
                localStorage.setItem("email", user.email);

                dispatch({
                    type: actionTypes.SET_ACCOUNT,
                    payload: user
                });

                resolve(true);
            })
            .catch(error => {
                localStorage.removeItem("token");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("email");

                console.log(error.response);
                reject(error);
            });
        });
    };
};

export const checkAuth = () => {
    return (dispatch: any) => {
        return new Promise((resolve, reject) => {
            const storedIDToken = localStorage.getItem("token");
            const storedRefreshToken = localStorage.getItem("refreshToken");
            const storedEmail = localStorage.getItem("email");

            if (!Boolean(storedIDToken) || !Boolean(storedRefreshToken) || !Boolean(storedEmail)) {
                resolve(false);
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

                resolve(true);
            })
            .catch(error => {
                localStorage.removeItem("token");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("email");
                
                console.log(error);
                reject(error);
            });
        });
    };
};