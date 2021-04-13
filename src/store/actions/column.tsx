import ColumnAPI from '../../api/ColumnAPI';

import ColumnDTO from '../../models/dto/ColumnDTO';

import * as actionTypes from './actionTypes';

export const getColumns = () => {
    return (dispatch: any) => {
        return new Promise((resolve, reject) => {
            ColumnAPI
            .getColumns()
            .then(columns => {
                dispatch({
                    type: actionTypes.SET_COLUMNS,
                    payload: columns
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