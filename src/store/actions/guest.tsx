import GuestAPI from '../../api/GuestAPI';
import InvitationAPI from '../../api/InvitationAPI';

import GuestDTO from '../../models/dto/GuestDTO';
import Guest from '../../models/types/Guest';

import * as actionTypes from './actionTypes';

export const getGuests = () => {
    return (dispatch: any) => {
        return new Promise((resolve, reject) => {
            GuestAPI
            .getGuests()
            .then(guests => {
                dispatch({
                    type: actionTypes.SET_GUESTS,
                    payload: guests
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

export const createGuest = (dto: GuestDTO) => {
    return (dispatch: any) => {
        return new Promise((resolve, reject) => {
            GuestAPI
            .createGuest(dto)
            .then(guest => {
                const g = {
                    ...guest,
                    displayName: guest.firstName + " " + guest.lastName,
                    initials: ((guest.firstName).charAt(0).toUpperCase() + (guest.lastName).charAt(0)).toUpperCase()
                };

                dispatch({
                    type: actionTypes.ADD_GUEST,
                    payload: g
                });

                resolve(g);
            })
            .catch(error => {
                console.log(error);
                reject(error);
            });
        });
    };
};

export const updateGuest = (guest: Guest) => {
    return (dispatch: any) => {
        return new Promise((resolve, reject) => {
            GuestAPI
            .updateGuest(guest)
            .then(guest => {
                dispatch({
                    type: actionTypes.UPDATE_GUEST,
                    payload: guest
                });

                resolve(guest);
            })
            .catch(error => {
                console.log(error);
                reject(error);
            });
        });
    };
};

export const deleteGuest = (id: string, invitationIDs: string[]) => {
    return (dispatch: any) => {
        return new Promise((resolve, reject) => {
            const promises = [];

            promises.push(GuestAPI.deleteGuest(id));

            invitationIDs.forEach(id => promises.push(InvitationAPI.deleteInvitation(id)));

            Promise.all(promises)
            .then(id => {
                dispatch({
                    type: actionTypes.DELETE_GUEST,
                    payload: id
                });

                invitationIDs.forEach(id => {
                    dispatch({
                        type: actionTypes.DELETE_INVITATION,
                        payload: id
                    })
                });

                resolve(id);
            })
            .catch(error => {
                console.log(error);
                reject(error);
            })
        });
    };
};