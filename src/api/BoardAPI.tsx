import { v4 as uuidv4 } from 'uuid';

import axios from '../axios';

import Board from '../models/types/Board';
import BoardDTO from '../models/dto/BoardDTO';

import ColumnAPI from './ColumnAPI';

const path = "boards/";
const extension = ".json";

class BoardAPI {
    public static getBoards(): Promise<Board[]> {
        return axios.get(path + extension)
            .then(response => {
                const data: any = response.data || {};

                return Object.keys(data).map(key =>
                    ({...data[key]} as Board))
            });
    };

    public static createBoard(dto: BoardDTO): Promise<Board> {
        const boardID = uuidv4();

        // create default board columns
        const promises = [
            ColumnAPI.createColumn({name: "Backlog", boardID: boardID, accountID: dto.accountID}),
            ColumnAPI.createColumn({name: "In Progress", boardID: boardID, accountID: dto.accountID}),
            ColumnAPI.createColumn({name: "Completed", boardID: boardID, accountID: dto.accountID})
        ];

        return Promise.all(promises)
        .then(columns => {
            return {
                id: boardID,
                ...dto,
                columnIDs: columns.map(c => c.id)
            } as Board
        })
        .then((newBoard: Board) => {
            return axios.put(path + boardID + extension, newBoard)
                .then(response => newBoard);
        });
    };

    public static updateBoard(board: Board): Promise<Board> {
        return axios.put(path + board.id + extension, board)
            .then(response => board);
    };

    public static deleteBoard(id: string): Promise<string> {
        return axios.delete(path + id + extension)
            .then(response => {
                console.log(response);
                return id;
            });
    };
};

export default BoardAPI;