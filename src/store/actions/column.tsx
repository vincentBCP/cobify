import ColumnAPI from '../../api/ColumnAPI';

import ColumnDTO from '../../models/dto/ColumnDTO';
import Column from '../../models/types/Column';

import * as actionTypes from './actionTypes';

const ObjectID = require('bson-objectid');

export const createColumn = (dto: ColumnDTO) => {
    return (dispatch: any) => {
        return new Promise((resolve, reject) => {
            ColumnAPI
            .createColumn(dto)
            .then(response => {
                dispatch({
                    type: actionTypes.ADD_COLUMN,
                    payload: {
                        id: ObjectID(),
                        name: dto.name,
                        boardID: dto.boardID,
                        hostID: dto.hostID
                    } as Column
                });

                resolve(true);
            })
            .catch(error => {
                console.log(error);
                reject(error);
            });
        });
    };
};