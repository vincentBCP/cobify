import LabelAPI from '../../api/LabelAPI';

import LabelDTO from '../../models/dto/LabelDTO';
import User from '../../models/types/User';
import UserRole from '../../models/enums/UserRole';

import * as actionTypes from './actionTypes';

export const getLabels = (account: User) => {
    return (dispatch: any) => {
        return new Promise((resolve, reject) => {
            LabelAPI
            .getLabels()
            .then(labels => {
                dispatch({
                    type: actionTypes.SET_LABELS,
                    payload: labels.filter(l => {
                        if (account.role === UserRole.SYSADMIN) return true;

                        return l.accountID === account.id ||
                                l.accountID === account.accountID;
                    })
                });

                resolve(true);
            })
            .catch(error => {
                reject(error);
            });
        })
    }
};

export const createLabel = (dto: LabelDTO) => {
    return (dispatch: any) => {
        return new Promise((resolve, reject) => {
            LabelAPI
            .createLabel(dto)
            .then(label => {
                dispatch({
                    type: actionTypes.ADD_LABEL,
                    payload: label
                });

                resolve(label);
            })
            .catch(error => {
                reject(error);
            });
        });
    };
};

export const deleteLabel = (id: string) => {
    return (dispatch: any) => {
        return new Promise((resolve, reject) => {
            LabelAPI.deleteLabel(id)
            .then(response => {
                dispatch({
                    type: actionTypes.DELETE_LABEL,
                    payload: id
                });

                resolve(id);
            })
            .catch(error => {
                reject(error);
            })
        });
    };
};