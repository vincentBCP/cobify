import * as actionTypes from './actionTypes';

import AuthAPI from '../../api/AuthAPI';
import GuestAPI from '../../api/GuestAPI';

export const login = (email: string, password: string) => {
    return (dispatch: any) => {
        return new Promise((resolve, reject) => {
            AuthAPI
            .login(email, password)
            .then(response => {
                localStorage.setItem("token", response.data.idToken);
                localStorage.setItem("refreshToken", response.data.refreshToken);
                
                return GuestAPI.getGuest(email.split('@')[0]);
            })
            .then(guest => {
                localStorage.setItem("email", guest.email);

                dispatch({
                    type: actionTypes.SET_USER,
                    payload: guest
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

                return GuestAPI.getGuest((storedEmail || "").split('@')[0]);
            })
            .then(guest => {
                dispatch({
                    type: actionTypes.SET_USER,
                    payload: guest
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