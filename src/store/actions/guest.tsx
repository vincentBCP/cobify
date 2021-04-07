import GuestAPI from '../../api/GuestAPI';

import * as actionTypes from './actionTypes';

import Guest from '../../models/types/Guest';
import Invitation from '../../models/types/Invitation';
import GuestDTO from '../../models/dto/GuestDTO';

const ObjectID = require('bson-objectid');

export const sendGuestInvitation = (dto: GuestDTO) => {
    return (dispatch: any) => {
        return new Promise((resolve, reject) => {
            GuestAPI.sendGuestInvitation(dto)
            .then(response => {
                const guest: Guest = {
                    id: ObjectID(),
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    email: dto.email,
                    color: dto.color,
                    hostID: "1"
                };

                const invitation: Invitation = {
                    id: ObjectID(),
                    guestID: guest.id,
                    boardID: dto.boardID,
                    hostID: "1",
                    link: ""
                };

                dispatch({
                    type: actionTypes.ADD_GUEST,
                    payload: guest
                });

                dispatch({
                    type: actionTypes.ADD_INVITATION,
                    payload: invitation
                });

                resolve(true);
            })
            .catch(error => reject(error));
        });
    }
};