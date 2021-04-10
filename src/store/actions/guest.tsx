import GuestAPI from '../../api/GuestAPI';

import GuestDTO from '../../models/dto/GuestDTO';

import * as actionTypes from './actionTypes';

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