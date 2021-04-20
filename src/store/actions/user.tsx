import UserAPI from '../../api/UserAPI';

import UserDTO from '../../models/dto/UserDTO';
import User from '../../models/types/User';

import * as actionTypes from './actionTypes';

export const getUsers = (account: User) => {
    return (dispatch: any) => {
        return new Promise((resolve, reject) => {
            UserAPI
            .getUsers()
            .then(users => {
                dispatch({
                    type: actionTypes.SET_USERS,
                    payload: users
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

export const createUser = (dto: UserDTO) => {
    return (dispatch: any) => {
        return new Promise((resolve, reject) => {
            UserAPI
            .createUser(dto)
            .then(user => {
                const g = {
                    ...user,
                    displayName: user.firstName + " " + user.lastName,
                    initials: ((user.firstName).charAt(0).toUpperCase() + (user.lastName).charAt(0)).toUpperCase()
                };

                dispatch({
                    type: actionTypes.ADD_USER,
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

export const updateUser = (user: User) => {
    return (dispatch: any) => {
        return new Promise((resolve, reject) => {
            UserAPI
            .updateUser(user)
            .then(user => {
                dispatch({
                    type: actionTypes.UPDATE_USER,
                    payload: user
                });

                resolve(user);
            })
            .catch(error => {
                console.log(error);
                reject(error);
            });
        });
    };
};

export const deleteUser = (uID: string, email: string) => {
    return (dispatch: any) => {
        return new Promise((resolve, reject) => {
            UserAPI.deleteUser(email)
            .then(email => {
                dispatch({
                    type: actionTypes.DELETE_USER,
                    payload: uID // user id
                });

                resolve(uID);
            })
            .catch(error => {
                console.log(error);
                reject(error);
            })
        });
    };
};