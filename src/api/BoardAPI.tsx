import { v4 as uuidv4 } from 'uuid';

import Board from '../models/types/Board';
import BoardDTO from '../models/dto/BoardDTO';

import ColumnAPI from './ColumnAPI';

import API from './API';

import Collections from './Collections';

class BoardAPI extends API<Board> {
    constructor() {
        super(Collections.BOARDS);
    }

    public getBoards(): Promise<Board[]> {
        return super.getRecords();
    };

    public createBoard(dto: BoardDTO): Promise<Board> {
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
            return super.create(boardID, newBoard);
        });
    };

    public updateBoard(board: Board): Promise<Board> {
        return super.update(board.id, board);
    };

    public deleteBoard(id: string): Promise<string> {
        return super.delete(id);
    };
};

export default new BoardAPI();