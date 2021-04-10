import BoardAPI from '../../api/BoardAPI';

import BoardDTO from '../../models/dto/BoardDTO';
import Column from '../../models/types/Column';

import * as actionTypes from './actionTypes';

export const createBoard = (dto: BoardDTO) => {
    return (dispatch: any) => {
        return new Promise((resolve, reject) => {
            BoardAPI
            .createBoard(dto)
            .then(board => {
                dispatch({
                    type: actionTypes.ADD_BOARD,
                    payload: board
                });

                const defaultColumns = ["Backlog", "In Progress", "Completed"];

                board.columnIDs.forEach((colID, index) =>
                    dispatch({
                        type: actionTypes.ADD_COLUMN,
                        payload: {
                            id: colID,
                            name: defaultColumns[index],
                            boardID: board.id,
                            accountID: board.accountID
                        } as Column
                    })
                );

                resolve(board);
            })
            .catch(error => {
                console.log(error);
                reject(error);
            });
        });
    };
};