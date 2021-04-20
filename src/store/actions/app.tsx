import * as actionTypes from './actionTypes';
import User from '../../models/types/User';

import UserAPI from '../../api/UserAPI';

export const updateUserDetails = (account: User) => {
    return (dispatch: any) => {
        return new Promise((resolve, reject) => {

            UserAPI
            .updateUser(account)
            .then(account => {
                dispatch({
                    type: actionTypes.UPDATE_USER_DETAILS,
                    payload: account
                });

                resolve(account);
            })
            .catch(error => {
                console.log(error);
                reject(error);
            });
        });
    };
};

/*export const updateEmail = (email: string) => {
    return (dispatch: any) => {
        return new Promise((resolve, reject) => {
            AppAPI
            .updateEmail(email)
            .then(response => {
                dispatch({
                    type: actionTypes.UPDATE_EMAIL,
                    payload: email
                });

                resolve(true);
            })
            .catch(error => {
                console.log(error);
                reject(error);
            });
        });
    };
};*/