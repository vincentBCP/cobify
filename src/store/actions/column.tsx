import ColumnAPI from '../../api/ColumnAPI';

import ColumnDTO from '../../models/dto/ColumnDTO';
import Column from '../../models/types/Column';
import User from '../../models/types/User';

import * as actionTypes from './actionTypes';

export const getColumns = (account: User) => {
    return (dispatch: any) => {
        return new Promise((resolve, reject) => {
            ColumnAPI
            .getColumns()
            .then(columns => {
                dispatch({
                    type: actionTypes.SET_COLUMNS,
                    payload: columns.filter(c => {
                        return c.accountID === account.id ||
                                c.accountID === account.accountID;
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

export const createColumn = (dto: ColumnDTO) => {
    return (dispatch: any) => {
        return new Promise((resolve, reject) => {
            ColumnAPI
            .createColumn(dto)
            .then(column => {
                dispatch({
                    type: actionTypes.ADD_COLUMN,
                    payload: column
                });

                resolve(column);
            })
            .catch(error => {
                console.log(error);
                reject(error);
            });
        });
    };
};

export const updateColumn = (column: Column) => {
    return (dispatch: any) => {
        return new Promise((resolve, reject) => {
            ColumnAPI
            .updateColumn(column)
            .then(column => {
                dispatch({
                    type: actionTypes.UPDATE_COLUMN,
                    payload: column
                });

                resolve(column);
            })
            .catch(error => {
                console.log(error);
                reject(error);
            });
        });
    };
};

export const deleteColumn = (id: string) => {
    return (dispatch: any) => {
        return new Promise((resolve, reject) => {
            ColumnAPI.deleteColumn(id)
            .then(response => {
                dispatch({
                    type: actionTypes.DELETE_COLUMN,
                    payload: id
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