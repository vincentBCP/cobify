import { v4 as uuidv4 } from 'uuid';

import InvitationAPI from '../../api/InvitationAPI';

import * as actionTypes from './actionTypes';

import Invitation from '../../models/types/Invitation';
import InvitationDTO from '../../models/dto/InvitationDTO';

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

export const sendInvitation = (dto: InvitationDTO) => {
    return (dispatch: any) => {
        return new Promise((resolve, reject) => {
            InvitationAPI.sendInvitation(dto)
            .then(response => {
                const inv: Invitation = {
                    id: uuidv4(),
                    guestID: dto.guestID,
                    boardID: dto.boardID,
                    hostID: "1",
                    link: ""
                };

                dispatch({
                    type: actionTypes.ADD_INVITATION,
                    payload: inv
                });

                resolve(inv);
            })
            .catch(error => reject(error));
        });
    }
};