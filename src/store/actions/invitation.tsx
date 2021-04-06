import InvitationAPI from '../../api/InvitationAPI';

import * as actionTypes from './actionTypes';

export const deleteInvitation = (id: string) => {
    return (dispatch: any) => {
        return new Promise((resolve, reject) => {
            InvitationAPI.deleteInvitation(id)
            .then(response => {
                dispatch({
                    type: actionTypes.DELETE_INVITATION,
                    payload: id
                });

                resolve(true);
            })
            .catch(error => reject(error));
        });
    };
};