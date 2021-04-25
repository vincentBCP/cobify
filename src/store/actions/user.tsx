import UserAPI from '../../api/UserAPI';
import StorageAPI from '../../api/StorageAPI';

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
                reject(error);
            });
        });
    };
};

export const deleteUser = (user: User) => {
    return (dispatch: any) => {
        return new Promise((resolve, reject) => {
            const promises: any = [];

            if (user.profilePicture) {
                promises.push(StorageAPI.delete(user.profilePicture));
            }
            promises.push(UserAPI.deleteUser(user.id))

            Promise.all(promises)
            .then(email => {
                dispatch({
                    type: actionTypes.DELETE_USER,
                    payload: user.id // user id
                });

                resolve(user.id);
            })
            .catch(error => {
                reject(error);
            })
        });
    };
};