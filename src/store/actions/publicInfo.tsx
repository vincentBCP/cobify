import * as actionTypes from './actionTypes';
import UserDetails from '../../models/types/UserDetails';

import AppAPI from '../../api/AppAPI';

export const updateUserDetails = (userDetails: UserDetails) => {
    return (dispatch: any) => {
        return new Promise((resolve, reject) => {
            AppAPI
            .updateUserDetails(userDetails)
            .then(response => {
                dispatch({
                    type: actionTypes.UPDATE_USER_DETAILS,
                    payload: userDetails
                });

                resolve(response);
            })
            .catch(error => reject(error));
        });
    };
};