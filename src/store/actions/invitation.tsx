import InvitationAPI from '../../api/InvitationAPI';

import * as actionTypes from './actionTypes';

import InvitationDTO from '../../models/dto/InvitationDTO';

export const deleteInvitation = (id: string) => {
    return (dispatch: any) => {
        return new Promise((resolve, reject) => {
            InvitationAPI.deleteInvitation(id)
            .then(id => {
                dispatch({
                    type: actionTypes.DELETE_INVITATION,
                    payload: id
                });

                resolve(id);
            })
            .catch(error => {
                console.log(error);
                reject(error);
            });
        });
    };
};

export const sendInvitation = (dto: InvitationDTO) => {
    return (dispatch: any) => {
        return new Promise((resolve, reject) => {
            InvitationAPI.sendInvitation(dto)
            .then(invitation => {
                dispatch({
                    type: actionTypes.ADD_INVITATION,
                    payload: invitation
                });

                resolve(invitation);
            })
            .catch(error => {
                console.log(error);
                reject(error);
            });
        });
    }
};