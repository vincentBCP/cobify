import InvitationAPI from '../../api/InvitationAPI';

import * as actionTypes from './actionTypes';

import InvitationDTO from '../../models/dto/InvitationDTO';
import User from '../../models/types/User';
import UserRole from '../../models/enums/UserRole';

export const getInvitations = (account: User) => {
    return (dispatch: any) => {
        return new Promise((resolve, reject) => {
            InvitationAPI
            .getInvitations()
            .then(invitations => {
                dispatch({
                    type: actionTypes.SET_INVITATIONS,
                    payload: invitations.filter(i => {
                        if (account.role === UserRole.SYSADMIN) return true;

                        return i.accountID === account.id ||
                                i.accountID === account.accountID;
                    })
                });

                resolve(true);
            })
            .catch(error => {
                console.log(error);
                reject(error);
            });
        })
    }
};

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